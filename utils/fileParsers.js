import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import { Platform } from 'react-native';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';

// Configure pdfjs worker to silence warning and handle inline execution
if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
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
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
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
 * Extract plain text from a PDF file
 */
export async function parsePdf(fileInput) {
  try {
    const data = await getFileBytes(fileInput);
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdfDocument = await loadingTask.promise;

    let textContent = '';
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const content = await page.getTextContent();
      const pageStrings = content.items.map(item => item.str);
      textContent += pageStrings.join(' ') + '\n\n';
    }
    return textContent.trim();
  } catch (err) {
    console.error('Error parsing PDF file:', err);
    throw new Error('Failed to extract text from PDF file.');
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
    throw new Error('Failed to extract text from .docx file.');
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
    throw new Error('Failed to extract text from .odt file.');
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
    throw new Error('Failed to extract text from EPUB file.');
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
    throw new Error('Failed to extract text from RTF file.');
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
      // Differentiate .docx, .odt, and .epub ZIP archives
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
