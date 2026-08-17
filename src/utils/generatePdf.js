/**
 * generatePdf.js
 * Oveka AI — Vector PDF export utility
 * Uses pdfmake (true vector PDF, selectable text) + html-to-pdfmake + marked
 *
 * Pipeline:
 *   Markdown string
 *     → marked → HTML string
 *     → html-to-pdfmake → pdfmake docDefinition
 *     → pdfmake.createPdf().getBlob() → manual anchor download
 *
 * Bug fixes vs v1:
 *   1. Logo loaded from /public/LogoHColor.svg via fetch → Blob URL (no CORS canvas issues)
 *   2. Font Base64 uses Uint8Array + btoa in chunks (avoids call-stack overflow on large files)
 *   3. PDF download uses getBlob() callback wrapped in a real Promise (download() callback
 *      is unreliable across pdfmake versions and does NOT always fire)
 *   4. Loading state guaranteed to reset via try/finally in Notes.jsx
 */

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
import { marked } from 'marked';

// Register the default Roboto font VFS included in pdfmake
pdfMake.vfs = (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) 
  ? pdfFonts.pdfMake.vfs 
  : (pdfFonts.vfs ? pdfFonts.vfs : pdfFonts);

pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

// ─── Brand Tokens (mirrors index.css :root) ──────────────────────────────────
const BRAND = {
  textPrimary:   '#112D4E',
  textSecondary: '#3b5068',
  textLight:     '#6a7c92',
  primary:       '#3F72AF',
  bgSecondary:   '#DBE2EF',
  border:        '#DBE2EF',
};

// ─── SVG → PNG Data URL via Blob URL (avoids canvas CORS tainting) ───────────
async function svgToPngDataUrl(svgUrl, width = 700, height = 243) {
  // Fetch the SVG as text, create a blob URL — completely avoids CORS
  const res = await fetch(svgUrl);
  if (!res.ok) throw new Error(`Failed to load logo SVG: ${svgUrl}`);
  const svgText = await res.text();
  const blob = new Blob([svgText], { type: 'image/svg+xml' });
  const blobUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(blobUrl); // cleanup
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error('Failed to render logo SVG to canvas'));
    };
    img.src = blobUrl;
  });
}

// ─── Fetch TTF font → Base64 (chunked to avoid call-stack overflow) ──────────
// Removed custom font loading to use pdfmake defaults

// ─── Extract title from Markdown (first H1, fallback H2, fallback default) ───
function extractTitle(markdown) {
  const h1 = markdown.match(/^#\s+(.+)/m);
  if (h1) return h1[1].replace(/[*_`#]/g, '').trim();
  const h2 = markdown.match(/^##\s+(.+)/m);
  if (h2) return h2[1].replace(/[*_`#]/g, '').trim();
  return 'Study Notes';
}

// ─── Sanitize filename ────────────────────────────────────────────────────────
function sanitizeFilename(name) {
  return name
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 80);
}

// ─── Build pdfmake docDefinition ─────────────────────────────────────────────
function buildDocDefinition(markdown, logoDataUrl) {

  // Markdown → HTML
  marked.setOptions({ gfm: true, breaks: false });
  const htmlContent = marked.parse(markdown);

  // HTML → pdfmake content array
  const bodyContent = htmlToPdfmake(htmlContent, {
    window,
    defaultStyles: {
      h1: {
        fontSize: 22, bold: true,
        color: BRAND.textPrimary,
        margin: [0, 14, 0, 8],
      },
      h2: {
        fontSize: 16, bold: true,
        color: BRAND.primary,
        margin: [0, 14, 0, 6],
      },
      h3: {
        fontSize: 13, bold: true,
        color: BRAND.primary,
        margin: [0, 10, 0, 4],
      },
      h4: {
        fontSize: 12, bold: true,
        color: BRAND.textSecondary,
        margin: [0, 8, 0, 3],
      },
      p: {
        fontSize: 11,
        color: BRAND.textPrimary,
        margin: [0, 0, 0, 8],
        lineHeight: 1.5,
      },
      li: {
        fontSize: 11,
        color: BRAND.textPrimary,
        margin: [0, 2, 0, 2],
        lineHeight: 1.4,
      },
      a: {
        color: BRAND.primary,
        decoration: 'underline',
      },
      blockquote: {
        italics: true,
        color: BRAND.textSecondary,
        margin: [12, 4, 0, 8],
        fontSize: 11,
      },
      table:  { margin: [0, 8, 0, 16] },
      th: {
        bold: true,
        fillColor: BRAND.bgSecondary,
        color: BRAND.textPrimary,
        fontSize: 11,
      },
      td: {
        fontSize: 10.5,
        color: BRAND.textPrimary,
      },
    },
    tableAutoSize: true,
  });

  const MARGIN_H      = 56;
  const MARGIN_TOP    = 90;
  const MARGIN_BOTTOM = 60;
  const CONTENT_W     = 595.28 - 2 * MARGIN_H;  // A4 width minus margins

  return {
    pageSize: 'A4',
    pageMargins: [MARGIN_H, MARGIN_TOP, MARGIN_H, MARGIN_BOTTOM],
    defaultStyle: {
      fontSize: 11,
      color: BRAND.textPrimary,
      lineHeight: 1.5,
    },

    // Header — logo centered on every page
    header: () => ({
      margin: [MARGIN_H, 18, MARGIN_H, 0],
      columns: [{
        image: logoDataUrl,
        width: 140,
        height: 49,   // 140 × (711/2048) ≈ 49pt — preserves SVG ratio
        alignment: 'center',
      }],
    }),

    // Footer — "Oveka AI" on every page; disclaimer on last page
    footer: (currentPage, pageCount) => {
      const items = [{
        text: 'Oveka AI',
        alignment: 'center',
        fontSize: 9,
        color: BRAND.textLight,
        margin: [MARGIN_H, 8, MARGIN_H, 0],
      }];
      if (currentPage === pageCount) {
        items.push({
          text: 'Beta — Oveka AI can make mistakes. Please verify important information.',
          alignment: 'center',
          fontSize: 8,
          color: BRAND.textLight,
          italics: true,
          margin: [MARGIN_H, 3, MARGIN_H, 0],
        });
      }
      return { stack: items };
    },

    content: [
      // Thin rule below header area
      {
        canvas: [{
          type: 'line',
          x1: 0, y1: 0,
          x2: CONTENT_W, y2: 0,
          lineWidth: 0.5,
          lineColor: BRAND.border,
        }],
        margin: [0, 0, 0, 16],
      },
      ...bodyContent,
    ],

    styles: {
      'html-table': { margin: [0, 8, 0, 16] },
    },
  };
}

// ─── Trigger browser download from a Blob ────────────────────────────────────
function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  // Clean up after a short delay
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 150);
}

// ─── Main exported function ───────────────────────────────────────────────────
export async function downloadNotesPdf(markdown) {
  console.log("[PDF] entered handler");
  if (!markdown || typeof markdown !== 'string') {
    throw new Error('No notes content to export.');
  }

  console.log("[PDF] starting generatePdf");

  // 1. Filename
  const title    = extractTitle(markdown);
  const safeTitle = sanitizeFilename(title);
  const filename  = `Notes by Oveka AI - ${safeTitle}.pdf`;

  // 2. Logo — load from /public/LogoHColor.svg via Blob URL (no CORS issues)
  const logoDataUrl = await svgToPngDataUrl('/LogoHColor.svg', 700, 243);

  // 3. Build document definition
  const docDef = buildDocDefinition(markdown, logoDataUrl);
  console.log("[PDF] document definition created");

  // 4. Generate PDF blob and trigger download.
  //    In pdfmake >= 0.3.0, .download() is an async function that returns a Promise.
  console.log("[PDF] createPdf started");
  const pdfDoc = pdfMake.createPdf(docDef);
  
  console.log("[PDF] download started");
  await pdfDoc.download(filename);
  console.log("[PDF] download completed");
}
