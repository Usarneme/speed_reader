import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import { Platform } from 'react-native';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Configure pdfjs worker if available
if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
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
        const cleanText = htmlContent
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
 * Main router function: accepts file URI or Web File/Blob object
 */
export async function parseFileToText(fileInput, fileName = '') {
  const name = typeof fileInput === 'object' && fileInput?.name ? fileInput.name : fileName;
  const lowerName = name.toLowerCase();

  if (lowerName.endsWith('.pdf')) {
    return await parsePdf(fileInput);
  } else if (lowerName.endsWith('.epub')) {
    return await parseEpub(fileInput);
  } else if (lowerName.endsWith('.rtf')) {
    return await parseRtf(fileInput);
  } else {
    return await getFileText(fileInput);
  }
}
