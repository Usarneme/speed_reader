import { File as ExpoFile } from 'expo-file-system';
import JSZip from 'jszip';
import pako from 'pako';
import { Platform } from 'react-native';

/**
 * Platform-safe Base64 to Uint8Array decoder (pure JS, safe for Hermes & Web)
 */
function base64ToUint8Array(base64) {
  if (!base64) return new Uint8Array(0);
  const cleanBase64 = base64.replace(/[\r\n\s]/g, '');
  if (typeof atob !== 'undefined') {
    const binaryString = atob(cleanBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }
  let bufferLength = Math.floor(cleanBase64.length * 0.75);
  const len = cleanBase64.length;
  if (cleanBase64[len - 1] === '=') bufferLength--;
  if (cleanBase64[len - 2] === '=') bufferLength--;
  const arrayBuffer = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const encoded1 = lookup[cleanBase64.charCodeAt(i)];
    const encoded2 = lookup[cleanBase64.charCodeAt(i + 1)];
    const encoded3 = lookup[cleanBase64.charCodeAt(i + 2)];
    const encoded4 = lookup[cleanBase64.charCodeAt(i + 3)];
    arrayBuffer[p++] = (encoded1 << 2) | (encoded2 >> 4);
    if (encoded3 !== 0 && cleanBase64[i + 2] !== '=') {
      arrayBuffer[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    }
    if (encoded4 !== 0 && cleanBase64[i + 3] !== '=') {
      arrayBuffer[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
  }
  return arrayBuffer;
}

/**
 * Convert Uint8Array to UTF-8 decoded string safely without stack overflow
 */
function uint8ArrayToString(bytes) {
  if (!bytes || bytes.length === 0) return '';
  if (typeof TextDecoder !== 'undefined') {
    try {
      return new TextDecoder('utf-8').decode(bytes);
    } catch (e) {
      // Fallback if encoding error
    }
  }
  let str = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    const sub = bytes.subarray(i, i + 8192);
    str += String.fromCharCode.apply(null, sub);
  }
  return str;
}

/**
 * Get Uint8Array byte buffer from file input using modern Expo SDK 54 File API
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
    const uri = typeof fileInput === 'string' ? fileInput : fileInput?.uri;
    try {
      const file = new ExpoFile(uri);
      return await file.bytes();
    } catch (e) {
      console.warn('ExpoFile.bytes fallback:', e);
      const legacyFS = require('expo-file-system/legacy');
      const base64 = await legacyFS.readAsStringAsync(uri, {
        encoding: legacyFS.EncodingType?.Base64 || 'base64',
      });
      return base64ToUint8Array(base64);
    }
  }
}

/**
 * Get raw string content from file input using modern Expo SDK 54 File API
 */
async function getFileText(fileInput, existingBytes = null) {
  if (existingBytes && existingBytes.length > 0) {
    return uint8ArrayToString(existingBytes);
  }
  if (Platform.OS === 'web') {
    if (fileInput instanceof Blob || (typeof File !== 'undefined' && fileInput instanceof File)) {
      return await fileInput.text();
    }
    const response = await fetch(fileInput);
    return await response.text();
  } else {
    const uri = typeof fileInput === 'string' ? fileInput : fileInput?.uri;
    try {
      const file = new ExpoFile(uri);
      return await file.text();
    } catch (e) {
      console.warn('ExpoFile.text fallback:', e);
      const legacyFS = require('expo-file-system/legacy');
      return await legacyFS.readAsStringAsync(uri);
    }
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
    .replace(/&#39;/gi, "'")
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
 * Helper to decode PDF string escapes and sanitize non-printable bytes
 */
function decodePdfString(pdfStr) {
  if (!pdfStr) return '';
  return pdfStr
    .replace(/\\([()])/g, '$1')
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\(\d{3})/g, (m, oct) => {
      const code = parseInt(oct, 8);
      return String.fromCharCode(code);
    });
}

/**
 * Helper to parse PDF hex string literals (<48656c6c6f>) safely
 */
function parseHexPdfString(hex) {
  if (!hex) return '';
  let str = '';
  if (hex.length % 4 === 0) {
    for (let i = 0; i < hex.length; i += 4) {
      const code = parseInt(hex.substring(i, i + 4), 16);
      if (code >= 32 && code <= 0xd7ff) str += String.fromCharCode(code);
    }
  }
  if (!str) {
    for (let i = 0; i < hex.length; i += 2) {
      const code = parseInt(hex.substring(i, i + 2), 16);
      if (code >= 32 && code <= 126) str += String.fromCharCode(code);
      else if (code === 10 || code === 13 || code === 9) str += ' ';
    }
  }
  return str;
}

/**
 * Extract text from decompressed PDF stream content string
 */
function parsePdfStreamText(decompressedStr) {
  let text = '';
  // 1. Match Tj string literals: (Hello World) Tj or (Hello World) ' or (Hello World) "
  const tjRegex = /\(([^()\\]*(?:\\.[^()\\]*)*)\)\s*(?:Tj|['"])/g;
  let match;
  while ((match = tjRegex.exec(decompressedStr)) !== null) {
    if (match[1]) {
      const decoded = decodePdfString(match[1]);
      if (decoded.trim()) text += decoded.trim() + ' ';
    }
  }

  // 2. Match TJ array literals: [(Hello) -10 (World) <48656c6c6f>] TJ
  const tjArrayRegex = /\[\s*((?:\((?:[^()\\]*(?:\\.[^()\\]*)*)\)|<[0-9a-fA-F]*>|-?\d+(?:\.\d+)?|\s+)+)\]\s*TJ/gi;
  while ((match = tjArrayRegex.exec(decompressedStr)) !== null) {
    const arrayContent = match[1];
    const innerTjRegex = /\(([^()\\]*(?:\\.[^()\\]*)*)\)/g;
    let innerMatch;
    while ((innerMatch = innerTjRegex.exec(arrayContent)) !== null) {
      if (innerMatch[1]) {
        const decoded = decodePdfString(innerMatch[1]);
        if (decoded.trim()) text += decoded.trim() + ' ';
      }
    }
    const innerHexRegex = /<([0-9a-fA-F]+)>/g;
    let hexMatch;
    while ((hexMatch = innerHexRegex.exec(arrayContent)) !== null) {
      const hex = hexMatch[1];
      const parsedHex = parseHexPdfString(hex);
      if (parsedHex.trim()) text += parsedHex.trim() + ' ';
    }
  }

  // 3. Match standalone hex strings: <48656c6c6f> Tj
  const hexTjRegex = /<([0-9a-fA-F]+)>\s*(?:Tj|['"])/g;
  while ((match = hexTjRegex.exec(decompressedStr)) !== null) {
    if (match[1]) {
      const parsedHex = parseHexPdfString(match[1]);
      if (parsedHex.trim()) text += parsedHex.trim() + ' ';
    }
  }

  return text;
}

/**
 * Extract plain text from a PDF file using PDF.js legacy engine (resolves CMaps, ToUnicode, and page fonts)
 */
export async function parsePdf(fileInput, existingBytes = null) {
  try {
    const bytes = existingBytes || (await getFileBytes(fileInput));

    // Primary: Use PDFJS legacy build configured for inline non-worker execution
    try {
      if (typeof globalThis !== 'undefined') {
        if (!globalThis.window) globalThis.window = globalThis;
        if (globalThis.navigator) {
          if (typeof globalThis.navigator.platform !== 'string') {
            globalThis.navigator.platform = '';
          }
          if (typeof globalThis.navigator.userAgent !== 'string') {
            globalThis.navigator.userAgent = '';
          }
        } else {
          globalThis.navigator = { platform: '', userAgent: '' };
        }
      }
      const pdfjsWorker = require('pdfjs-dist/legacy/build/pdf.worker.js');
      if (typeof globalThis !== 'undefined') {
        globalThis.pdfjsWorker = pdfjsWorker;
      }
      const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

      const loadingTask = pdfjsLib.getDocument({
        data: bytes,
        disableWorker: true,
        isEvalSupported: false,
        useSystemFonts: true,
      });

      const pdfDoc = await loadingTask.promise;
      let pdfjsText = '';

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageItems = textContent.items.map(item => item.str).filter(Boolean);
        if (pageItems.length > 0) {
          pdfjsText += pageItems.join(' ') + ' ';
        }
      }

      const cleanedPdfjsText = pdfjsText.replace(/\s+/g, ' ').trim();
      if (cleanedPdfjsText.length > 0) {
        return cleanedPdfjsText;
      }
    } catch (pdfjsErr) {
      console.warn('PDFJS extraction notice, trying stream fallback:', pdfjsErr);
    }

    // Secondary Fallback: Stream FlateDecode inspection
    let extractedText = '';
    let i = 0;
    while (i < bytes.length - 6) {
      if (
        bytes[i] === 115 && // 's'
        bytes[i + 1] === 116 && // 't'
        bytes[i + 2] === 114 && // 'r'
        bytes[i + 3] === 101 && // 'e'
        bytes[i + 4] === 97 && // 'a'
        bytes[i + 5] === 109 // 'm'
      ) {
        let startPos = i + 6;
        if (bytes[startPos] === 13) startPos++;
        if (bytes[startPos] === 10) startPos++;

        let endPos = startPos;
        while (endPos < bytes.length - 9) {
          if (
            bytes[endPos] === 101 &&
            bytes[endPos + 1] === 110 &&
            bytes[endPos + 2] === 100 &&
            bytes[endPos + 3] === 115 &&
            bytes[endPos + 4] === 116 &&
            bytes[endPos + 5] === 114 &&
            bytes[endPos + 6] === 101 &&
            bytes[endPos + 7] === 97 &&
            bytes[endPos + 8] === 109
          ) {
            break;
          }
          endPos++;
        }

        if (endPos > startPos) {
          let rawEnd = endPos;
          if (bytes[rawEnd - 1] === 10) rawEnd--;
          if (bytes[rawEnd - 1] === 13) rawEnd--;

          const streamBytes = bytes.subarray(startPos, rawEnd);
          let decompressedStr = '';

          try {
            const decompressed = pako.inflate(streamBytes);
            decompressedStr = uint8ArrayToString(decompressed);
          } catch (inflateErr) {
            decompressedStr = uint8ArrayToString(streamBytes);
          }

          if (decompressedStr) {
            extractedText += parsePdfStreamText(decompressedStr) + ' ';
          }
        }

        i = endPos + 9;
      } else {
        i++;
      }
    }

    // Fallback: If no stream text extracted, search whole raw byte string
    if (!extractedText.trim()) {
      const rawPdfStr = uint8ArrayToString(bytes);
      extractedText = parsePdfStreamText(rawPdfStr);
    }

    const cleanedText = extractedText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanedText.length > 0) {
      return cleanedText;
    }

    return 'No readable text content could be extracted from this PDF file.';
  } catch (err) {
    console.error('Error parsing PDF file:', err);
    return 'Unable to read text from this PDF file.';
  }
}

/**
 * Extract plain text from a Microsoft Word .docx file
 */
export async function parseDocx(fileInput, existingBytes = null) {
  try {
    const bytes = existingBytes || (await getFileBytes(fileInput));
    const zip = await JSZip.loadAsync(bytes);
    const docXmlFile = zip.file('word/document.xml');

    if (!docXmlFile) {
      throw new Error('Not a valid .docx structure');
    }

    const xmlText = await docXmlFile.async('text');
    const paragraphMatches = xmlText.match(/<w:p[^>]*>[\s\S]*?<\/w:p>/g) || [xmlText];
    let fullText = '';

    for (const pXml of paragraphMatches) {
      const textMatches = pXml.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
      const paragraphText = textMatches
        .map(tag => tag.replace(/<[^>]+>/g, ''))
        .join('');
      if (paragraphText.trim()) {
        fullText += paragraphText.trim() + ' ';
      }
    }

    const cleaned = fullText.replace(/\s+/g, ' ').trim();
    return cleaned || stripHtml(xmlText);
  } catch (err) {
    console.error('Error parsing .docx file:', err);
    return 'Unable to read text from this .docx file.';
  }
}

/**
 * Extract plain text from an OpenDocument .odt file
 */
export async function parseOdt(fileInput, existingBytes = null) {
  try {
    const bytes = existingBytes || (await getFileBytes(fileInput));
    const zip = await JSZip.loadAsync(bytes);
    const contentXmlFile = zip.file('content.xml');

    if (!contentXmlFile) {
      throw new Error('Not a valid .odt structure');
    }

    const xmlText = await contentXmlFile.async('text');
    return stripHtml(xmlText);
  } catch (err) {
    console.error('Error parsing .odt file:', err);
    return 'Unable to read text from this .odt file.';
  }
}

/**
 * Extract plain text from an EPUB file
 */
export async function parseEpub(fileInput, existingBytes = null) {
  try {
    const bytes = existingBytes || (await getFileBytes(fileInput));
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
          fullText += cleanText + ' ';
        }
      }
    }
    return fullText.replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.error('Error parsing EPUB file:', err);
    return 'Unable to read text from this EPUB file.';
  }
}

/**
 * Extract plain text from an RTF file
 */
export async function parseRtf(fileInput, existingBytes = null) {
  try {
    const rawRtf = await getFileText(fileInput, existingBytes);
    const cleanText = rawRtf
      .replace(/{\\fonttbl[\s\S]*?}/gi, '')
      .replace(/{\\colortbl[\s\S]*?}/gi, '')
      .replace(/{\\stylesheet[\s\S]*?}/gi, '')
      .replace(/{\\info[\s\S]*?}/gi, '')
      .replace(/\\u(\d{1,5})\??/gi, (match, code) => String.fromCharCode(parseInt(code, 10)))
      .replace(/\\([a-z]{1,32})(-?\d{1,10})?[ ]?/gi, ' ')
      .replace(/\\'([0-9a-f]{2})/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/[{}]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return cleanText;
  } catch (err) {
    console.error('Error parsing RTF file:', err);
    return 'Unable to read text from this RTF file.';
  }
}

/**
 * Main router function: auto-detects file type by magic byte header & filename extension
 */
export async function parseFileToText(fileInput, fileName = '') {
  try {
    const bytes = await getFileBytes(fileInput);

    if (!bytes || bytes.length === 0) {
      return await getFileText(fileInput);
    }

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
      return await parsePdf(fileInput, bytes);
    }

    if (isZipHeader) {
      try {
        const zip = await JSZip.loadAsync(bytes);
        if (zip.file('word/document.xml')) {
          console.log('Auto-detected Microsoft Word .docx file by zip contents');
          return await parseDocx(fileInput, bytes);
        }
        if (zip.file('content.xml')) {
          console.log('Auto-detected OpenDocument .odt file by zip contents');
          return await parseOdt(fileInput, bytes);
        }
      } catch (zipErr) {
        console.warn('Failed zip structure check:', zipErr);
      }

      console.log('Auto-detected EPUB/ZIP file by magic header signature');
      return await parseEpub(fileInput, bytes);
    }

    // 2. Check Text-based Signatures (RTF / HTML / XML)
    const textHeader = uint8ArrayToString(bytes.subarray(0, Math.min(512, bytes.length))).trim();

    if (textHeader.startsWith('{\\rtf')) {
      console.log('Auto-detected RTF file by magic text header');
      return await parseRtf(fileInput, bytes);
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
      const rawText = await getFileText(fileInput, bytes);
      return stripHtml(rawText);
    }

    // 3. Fallback to extension check if magic headers were neutral
    const name = typeof fileInput === 'object' && fileInput?.name ? fileInput.name : fileName;
    const lowerName = name.toLowerCase();

    if (lowerName.endsWith('.pdf')) {
      return await parsePdf(fileInput, bytes);
    } else if (lowerName.endsWith('.docx')) {
      return await parseDocx(fileInput, bytes);
    } else if (lowerName.endsWith('.odt')) {
      return await parseOdt(fileInput, bytes);
    } else if (lowerName.endsWith('.epub')) {
      return await parseEpub(fileInput, bytes);
    } else if (lowerName.endsWith('.rtf')) {
      return await parseRtf(fileInput, bytes);
    } else if (lowerName.endsWith('.md') || lowerName.endsWith('.markdown')) {
      const rawText = await getFileText(fileInput, bytes);
      return stripMarkdown(rawText);
    } else if (lowerName.endsWith('.html') || lowerName.endsWith('.htm')) {
      const rawText = await getFileText(fileInput, bytes);
      return stripHtml(rawText);
    } else {
      return await getFileText(fileInput, bytes);
    }
  } catch (err) {
    console.warn('Magic signature check fallback, reading as plain text:', err);
    return await getFileText(fileInput);
  }
}
