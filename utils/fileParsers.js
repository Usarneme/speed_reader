import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import { Platform } from 'react-native';

/**
 * Platform-safe Base64 to Uint8Array decoder (pure JS, safe for Hermes & Web without DOM/atob)
 */
function base64ToUint8Array(base64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }
  let bufferLength = base64.length * 0.75;
  const len = base64.length;
  if (base64[len - 1] === '=') bufferLength--;
  if (base64[len - 2] === '=') bufferLength--;
  const arrayBuffer = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const encoded1 = lookup[base64.charCodeAt(i)];
    const encoded2 = lookup[base64.charCodeAt(i + 1)];
    const encoded3 = lookup[base64.charCodeAt(i + 2)];
    const encoded4 = lookup[base64.charCodeAt(i + 3)];
    arrayBuffer[p++] = (encoded1 << 2) | (encoded2 >> 4);
    if (encoded3 !== 64 && base64[i + 2] !== '=') {
      arrayBuffer[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    }
    if (encoded4 !== 64 && base64[i + 3] !== '=') {
      arrayBuffer[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
  }
  return arrayBuffer;
}

/**
 * Get Uint8Array byte buffer from file input (supports Web File/Blob objects, blob: URIs, and native file URIs)
 */
async function getFileBytes(fileInput) {
  if (Platform.OS === 'web') {
    if (fileInput instanceof Blob || (typeof File !== 'undefined' && fileInput instanceof File)) {
      const buffer = await fileInput.arrayBuffer();
      return new Uint8Array(buffer);
    }
    const response = await fetch(fileInput);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  } else {
    const base64 = await FileSystem.readAsStringAsync(fileInput, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64ToUint8Array(base64);
  }
}

/**
 * Get raw string content from file input
 */
async function getFileText(fileInput) {
  if (Platform.OS === 'web') {
    if (fileInput instanceof Blob || (typeof File !== 'undefined' && fileInput instanceof File)) {
      return await fileInput.text();
    }
    const response = await fetch(fileInput);
    return await response.text();
  } else {
    return await FileSystem.readAsStringAsync(fileInput);
  }
}

/**
 * Helper to strip HTML / XML markup tags from HTML documents
 */
export function stripHtml(htmlContent) {
  if (!htmlContent) return '';
  return htmlContent
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Helper to strip Markdown formatting syntax (#, **, *, `, >) for clean speed reading
 */
export function stripMarkdown(mdText) {
  if (!mdText) return '';
  return mdText
    .replace(/^#+\s+/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/^\s*>+\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract plain text from a PDF file using pure JS stream text extraction (DOM-free, Hermes safe)
 */
export async function parsePdf(fileInput) {
  try {
    const bytes = await getFileBytes(fileInput);
    let pdfString = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const sub = bytes.subarray(i, i + chunkSize);
      pdfString += String.fromCharCode.apply(null, sub);
    }

    const textMatches = [];
    const tjRegex = /\(([^()\\]*(?:\\.[^()\\]*)*)\)\s*Tj/g;
    let match;
    while ((match = tjRegex.exec(pdfString)) !== null) {
      if (match[1]) {
        textMatches.push(match[1].replace(/\\([()])/g, '$1').replace(/\\n/g, ' '));
      }
    }

    const tjArrayRegex = /\[\s*((?:\((?:[^()\\]*(?:\\.[^()\\]*)*)\)|-?\d+(?:\.\d+)?|\s+)+)\]\s*TJ/g;
    while ((match = tjArrayRegex.exec(pdfString)) !== null) {
      const arrayContent = match[1];
      const innerTjRegex = /\(([^()\\]*(?:\\.[^()\\]*)*)\)/g;
      let innerMatch;
      while ((innerMatch = innerTjRegex.exec(arrayContent)) !== null) {
        if (innerMatch[1]) {
          textMatches.push(innerMatch[1].replace(/\\([()])/g, '$1').replace(/\\n/g, ' '));
        }
      }
    }

    const extracted = textMatches.join(' ').replace(/\s+/g, ' ').trim();
    if (extracted.length > 0) {
      return extracted;
    }

    // Fallback text extraction for non-compressed text objects
    const rawWords = pdfString.match(/[A-Za-z0-9,.!?'" -]{4,}/g) || [];
    const filtered = rawWords.filter(
      w =>
        !w.startsWith('obj') &&
        !w.startsWith('endobj') &&
        !w.startsWith('stream') &&
        !w.startsWith('endstream') &&
        !w.startsWith('xref')
    );
    return filtered.join(' ').trim();
  } catch (err) {
    console.error('Error parsing PDF file:', err);
    return await getFileText(fileInput);
  }
}

/**
 * Extract plain text from a Microsoft Word .docx file
 */
export async function parseDocx(fileInput) {
  try {
    const bytes = await getFileBytes(fileInput);
    const zip = await JSZip.loadAsync(bytes);
    const docXmlFile = zip.file('word/document.xml');

    if (!docXmlFile) {
      throw new Error('Not a valid .docx structure');
    }

    const xmlText = await docXmlFile.async('text');
    const textMatches = xmlText.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
    const plainText = textMatches
      .map(tag => tag.replace(/<[^>]+>/g, ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return plainText || stripHtml(xmlText);
  } catch (err) {
    console.error('Error parsing .docx file:', err);
    return await getFileText(fileInput);
  }
}

/**
 * Extract plain text from an OpenDocument .odt file
 */
export async function parseOdt(fileInput) {
  try {
    const bytes = await getFileBytes(fileInput);
    const zip = await JSZip.loadAsync(bytes);
    const contentXmlFile = zip.file('content.xml');

    if (!contentXmlFile) {
      throw new Error('Not a valid .odt structure');
    }

    const xmlText = await contentXmlFile.async('text');
    return stripHtml(xmlText);
  } catch (err) {
    console.error('Error parsing .odt file:', err);
    return await getFileText(fileInput);
  }
}

/**
 * Extract plain text from an EPUB file
 */
export async function parseEpub(fileInput) {
  try {
    const bytes = await getFileBytes(fileInput);
    const zip = await JSZip.loadAsync(bytes);

    let fullText = '';
    const fileEntries = Object.keys(zip.files).sort();

    for (const filename of fileEntries) {
      const lower = filename.toLowerCase();
      if (
        (lower.endsWith('.xhtml') || lower.endsWith('.html') || lower.endsWith('.htm')) &&
        !zip.files[filename].dir
      ) {
        const htmlContent = await zip.files[filename].async('text');
        const cleanText = stripHtml(htmlContent);

        if (cleanText.length > 0) {
          fullText += cleanText + '\n\n';
        }
      }
    }
    return fullText.trim();
  } catch (err) {
    console.error('Error parsing EPUB file:', err);
    return await getFileText(fileInput);
  }
}

/**
 * Extract plain text from an RTF file
 */
export async function parseRtf(fileInput) {
  try {
    const rawRtf = await getFileText(fileInput);
    const cleanText = rawRtf
      .replace(/{\\fonttbl[\s\S]*?}/gi, '')
      .replace(/{\\colortbl[\s\S]*?}/gi, '')
      .replace(/{\\stylesheet[\s\S]*?}/gi, '')
      .replace(/{\\info[\s\S]*?}/gi, '')
      .replace(/\\([a-z]{1,32})(-?\d{1,10})?[ ]?/gi, ' ')
      .replace(/\\'([0-9a-f]{2})/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/[{}]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return cleanText;
  } catch (err) {
    console.error('Error parsing RTF file:', err);
    return await getFileText(fileInput);
  }
}

/**
 * Main router function: auto-detects file type by magic byte header & filename extension
 */
export async function parseFileToText(fileInput, fileName = '') {
  try {
    const bytes = await getFileBytes(fileInput);

    // 1. Check Magic Byte Signatures:
    // PDF Magic Number: %PDF (0x25 0x50 0x44 0x46)
    const isPdfHeader =
      bytes.length >= 4 &&
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46;

    // ZIP Magic Number: PK\x03\x04 (0x50 0x4B 0x03 0x04)
    const isZipHeader =
      bytes.length >= 4 &&
      bytes[0] === 0x50 &&
      bytes[1] === 0x4b &&
      bytes[2] === 0x03 &&
      bytes[3] === 0x04;

    if (isPdfHeader) {
      console.log('Auto-detected PDF file by magic header signature');
      return await parsePdf(fileInput);
    }

    if (isZipHeader) {
      try {
        const zip = await JSZip.loadAsync(bytes);
        if (zip.file('word/document.xml')) {
          console.log('Auto-detected Microsoft Word .docx file by zip contents');
          return await parseDocx(fileInput);
        }
        if (zip.file('content.xml')) {
          console.log('Auto-detected OpenDocument .odt file by zip contents');
          return await parseOdt(fileInput);
        }
      } catch (zipErr) {
        console.warn('Failed zip structure check:', zipErr);
      }

      console.log('Auto-detected EPUB/ZIP file by magic header signature');
      return await parseEpub(fileInput);
    }

    // 2. Check Text-based Signatures (RTF / HTML / XML)
    const textHeader = String.fromCharCode.apply(null, Array.from(bytes.slice(0, 512))).trim();

    if (textHeader.startsWith('{\\rtf')) {
      console.log('Auto-detected RTF file by magic text header');
      return await parseRtf(fileInput);
    }

    const lowerHeader = textHeader.toLowerCase();
    if (
      lowerHeader.startsWith('<!doctype html') ||
      lowerHeader.startsWith('<html') ||
      lowerHeader.startsWith('<?xml') ||
      lowerHeader.includes('<body') ||
      lowerHeader.includes('<head')
    ) {
      console.log('Auto-detected HTML/XML file by text header');
      const rawText = await getFileText(fileInput);
      return stripHtml(rawText);
    }

    // 3. Fallback to extension check if magic headers were neutral
    const name = typeof fileInput === 'object' && fileInput?.name ? fileInput.name : fileName;
    const lowerName = name.toLowerCase();

    if (lowerName.endsWith('.pdf')) {
      return await parsePdf(fileInput);
    } else if (lowerName.endsWith('.docx')) {
      return await parseDocx(fileInput);
    } else if (lowerName.endsWith('.odt')) {
      return await parseOdt(fileInput);
    } else if (lowerName.endsWith('.epub')) {
      return await parseEpub(fileInput);
    } else if (lowerName.endsWith('.rtf')) {
      return await parseRtf(fileInput);
    } else if (lowerName.endsWith('.md') || lowerName.endsWith('.markdown')) {
      const rawText = await getFileText(fileInput);
      return stripMarkdown(rawText);
    } else if (lowerName.endsWith('.html') || lowerName.endsWith('.htm')) {
      const rawText = await getFileText(fileInput);
      return stripHtml(rawText);
    } else {
      return await getFileText(fileInput);
    }
  } catch (err) {
    console.warn('Magic signature check fallback, reading as plain text:', err);
    return await getFileText(fileInput);
  }
}
