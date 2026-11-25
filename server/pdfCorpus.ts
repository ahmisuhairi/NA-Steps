import fs from 'fs';
import path from 'path';
import type {
  PdfCorpusStats,
  PdfPageRecord,
  PdfSearchHit,
} from '../src/types/dictionary.ts';

const PDF_RELATIVE_PATH = path.join(
  process.cwd(),
  'public',
  'assets',
  'aistudio',
  'h_w_48c140b4.pdf',
);

function mapPdfPageMeta(pdfPage: number): { bookPage: string; section: string } {
  if (pdfPage <= 5) {
    return { bookPage: `PDF ${pdfPage}`, section: 'Front Matter & Contents' };
  }
  if (pdfPage === 6) return { bookPage: 'i', section: 'Introduction' };
  if (pdfPage === 7) return { bookPage: 'ii', section: 'Introduction' };
  if (pdfPage === 8) return { bookPage: '1', section: 'Book One: The Twelve Steps' };
  if (pdfPage >= 9 && pdfPage <= 17) return { bookPage: String(pdfPage - 6), section: 'Step One' };
  if (pdfPage >= 18 && pdfPage <= 24) return { bookPage: String(pdfPage - 6), section: 'Step Two' };
  if (pdfPage >= 25 && pdfPage <= 31) return { bookPage: String(pdfPage - 6), section: 'Step Three' };
  if (pdfPage >= 32 && pdfPage <= 40) return { bookPage: String(pdfPage - 6), section: 'Step Four' };
  if (pdfPage >= 41 && pdfPage <= 47) return { bookPage: String(pdfPage - 6), section: 'Step Five' };
  if (pdfPage >= 48 && pdfPage <= 54) return { bookPage: String(pdfPage - 6), section: 'Step Six' };
  if (pdfPage >= 55 && pdfPage <= 59) return { bookPage: String(pdfPage - 6), section: 'Step Seven' };
  if (pdfPage >= 60 && pdfPage <= 65) return { bookPage: String(pdfPage - 6), section: 'Step Eight' };
  if (pdfPage >= 66 && pdfPage <= 74) return { bookPage: String(pdfPage - 6), section: 'Step Nine' };
  if (pdfPage >= 75 && pdfPage <= 81) return { bookPage: String(pdfPage - 6), section: 'Step Ten' };
  if (pdfPage >= 82 && pdfPage <= 87) return { bookPage: String(pdfPage - 6), section: 'Step Eleven' };
  if (pdfPage >= 88 && pdfPage <= 94) return { bookPage: String(pdfPage - 6), section: 'Step Twelve' };
  if (pdfPage === 95) return { bookPage: '89', section: 'Book Two: The Twelve Traditions' };
  if (pdfPage >= 96 && pdfPage <= 102) return { bookPage: String(pdfPage - 5), section: 'Tradition One' };
  if (pdfPage >= 103 && pdfPage <= 110) return { bookPage: String(pdfPage - 5), section: 'Tradition Two' };
  if (pdfPage >= 111 && pdfPage <= 115) return { bookPage: String(pdfPage - 5), section: 'Tradition Three' };
  if (pdfPage >= 116 && pdfPage <= 121) return { bookPage: String(pdfPage - 5), section: 'Tradition Four' };
  if (pdfPage >= 122 && pdfPage <= 126) return { bookPage: String(pdfPage - 5), section: 'Tradition Five' };
  if (pdfPage >= 127 && pdfPage <= 132) return { bookPage: String(pdfPage - 5), section: 'Tradition Six' };
  if (pdfPage >= 133 && pdfPage <= 140) return { bookPage: String(pdfPage - 5), section: 'Tradition Seven' };
  if (pdfPage >= 141 && pdfPage <= 143) return { bookPage: String(pdfPage - 5), section: 'Tradition Eight' };
  if (pdfPage >= 144 && pdfPage <= 148) return { bookPage: String(pdfPage - 5), section: 'Tradition Nine' };
  if (pdfPage >= 149 && pdfPage <= 153) return { bookPage: String(pdfPage - 5), section: 'Tradition Ten' };
  if (pdfPage >= 154 && pdfPage <= 157) return { bookPage: String(pdfPage - 5), section: 'Tradition Eleven' };
  if (pdfPage >= 158 && pdfPage <= 163) return { bookPage: String(pdfPage - 5), section: 'Tradition Twelve' };
  return { bookPage: String(pdfPage - 5), section: 'Index' };
}

function cleanPdfPageText(raw: string): string {
  return raw
    .replace(/\u00ad/g, '')
    .replace(/([a-zA-Z])-\s+([a-zA-Z])/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

let corpusPromise: Promise<PdfPageRecord[]> | null = null;

export async function loadPdfCorpus(): Promise<PdfPageRecord[]> {
  if (corpusPromise) {
    return corpusPromise;
  }

  corpusPromise = (async () => {
    if (!fs.existsSync(PDF_RELATIVE_PATH)) {
      throw new Error(`Fail PDF tidak dijumpai di ${PDF_RELATIVE_PATH}`);
    }

    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const buffer = fs.readFileSync(PDF_RELATIVE_PATH);
    const data = new Uint8Array(buffer);
    const doc = await pdfjs.getDocument({ data, verbosity: 0 }).promise;

    const pages: PdfPageRecord[] = [];
    for (let pageNum = 1; pageNum <= doc.numPages; pageNum += 1) {
      const page = await doc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const rawText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      const { bookPage, section } = mapPdfPageMeta(pageNum);
      pages.push({
        pdfPage: pageNum,
        bookPage,
        section,
        text: cleanPdfPageText(rawText),
      });
    }

    return pages;
  })();

  return corpusPromise;
}

export async function getCorpusStats(): Promise<PdfCorpusStats> {
  const pages = await loadPdfCorpus();
  const sections = Array.from(new Set(pages.map((p) => p.section)));
  return {
    title: 'It Works: How and Why',
    subtitle: 'The Twelve Steps and Twelve Traditions of Narcotics Anonymous',
    totalPdfPages: pages.length,
    sections,
  };
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildSnippets(text: string, query: string, maxSnippets = 2): string[] {
  const pattern = new RegExp(escapeRegExp(query), 'gi');
  const snippets: string[] = [];
  let match: RegExpExecArray | null;
  const usedRanges: Array<[number, number]> = [];

  while ((match = pattern.exec(text)) !== null && snippets.length < maxSnippets) {
    const idx = match.index;
    const overlaps = usedRanges.some(([s, e]) => idx >= s && idx <= e);
    if (overlaps) continue;

    const start = Math.max(0, idx - 115);
    const end = Math.min(text.length, idx + query.length + 145);
    usedRanges.push([start, end]);

    const prefix = start > 0 ? '…' : '';
    const suffix = end < text.length ? '…' : '';
    snippets.push(`${prefix}${text.slice(start, end).trim()}${suffix}`);
  }

  return snippets;
}

export async function searchPdfPages(
  query: string,
  sectionFilter?: string,
  limit = 40,
): Promise<{ totalMatches: number; hits: PdfSearchHit[] }> {
  const normalized = query.trim();
  if (!normalized) {
    return { totalMatches: 0, hits: [] };
  }

  const pages = await loadPdfCorpus();
  const pattern = new RegExp(escapeRegExp(normalized), 'gi');
  const hits: PdfSearchHit[] = [];

  for (const page of pages) {
    if (sectionFilter && sectionFilter !== 'all' && page.section !== sectionFilter) {
      continue;
    }
    const matches = page.text.match(pattern);
    if (matches && matches.length > 0) {
      hits.push({
        pdfPage: page.pdfPage,
        bookPage: page.bookPage,
        section: page.section,
        matchCount: matches.length,
        snippets: buildSnippets(page.text, normalized, 2),
      });
    }
  }

  hits.sort((a, b) => b.matchCount - a.matchCount || a.pdfPage - b.pdfPage);

  return {
    totalMatches: hits.length,
    hits: hits.slice(0, limit),
  };
}

export async function getPdfPageByNumber(
  pdfPage: number,
): Promise<PdfPageRecord | null> {
  const pages = await loadPdfCorpus();
  return pages.find((p) => p.pdfPage === pdfPage) ?? null;
}

export async function getPdfPageByBookPage(
  bookPage: string,
): Promise<PdfPageRecord | null> {
  const pages = await loadPdfCorpus();
  return (
    pages.find(
      (p) => p.bookPage.toLowerCase() === bookPage.trim().toLowerCase(),
    ) ?? null
  );
}

export async function getPdfPagesByRange(
  startPdfPage: number,
  endPdfPage: number,
): Promise<PdfPageRecord[]> {
  const pages = await loadPdfCorpus();
  return pages.filter(
    (p) => p.pdfPage >= startPdfPage && p.pdfPage <= endPdfPage,
  );
}

function classifyTrack(
  pdfPage: number,
): 'intro' | 'steps' | 'traditions' | 'index' {
  if (pdfPage <= 7) return 'intro';
  if (pdfPage <= 94) return 'steps';
  if (pdfPage <= 163) return 'traditions';
  return 'index';
}

export async function getWordOccurrences(rawQuery: string): Promise<{
  query: string;
  totalPages: number;
  totalMatches: number;
  occurrences: Array<{
    pdfPage: number;
    bookPage: string;
    section: string;
    matchCount: number;
    track: 'intro' | 'steps' | 'traditions' | 'index';
  }>;
}> {
  const normalized = rawQuery.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return { query: '', totalPages: 0, totalMatches: 0, occurrences: [] };
  }

  const pages = await loadPdfCorpus();
  const isSingleWord = /^[a-zA-Z0-9'-]+$/.test(normalized);
  const wordBoundaryPattern = isSingleWord
    ? new RegExp(`\\b${escapeRegExp(normalized)}\\b`, 'gi')
    : new RegExp(escapeRegExp(normalized), 'gi');
  const substringPattern = new RegExp(escapeRegExp(normalized), 'gi');

  const buildOccurrences = (pattern: RegExp) => {
    const list: Array<{
      pdfPage: number;
      bookPage: string;
      section: string;
      matchCount: number;
      track: 'intro' | 'steps' | 'traditions' | 'index';
    }> = [];
    let totalMatches = 0;

    for (const page of pages) {
      const matches = page.text.match(pattern);
      if (matches && matches.length > 0) {
        totalMatches += matches.length;
        list.push({
          pdfPage: page.pdfPage,
          bookPage: page.bookPage,
          section: page.section,
          matchCount: matches.length,
          track: classifyTrack(page.pdfPage),
        });
      }
    }

    return { list, totalMatches };
  };

  let result = buildOccurrences(wordBoundaryPattern);
  if (result.list.length === 0 && isSingleWord) {
    result = buildOccurrences(substringPattern);
  }

  return {
    query: normalized,
    totalPages: result.list.length,
    totalMatches: result.totalMatches,
    occurrences: result.list,
  };
}
