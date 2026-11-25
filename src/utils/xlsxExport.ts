import { BOOK_CHAPTERS, entryBelongsToChapter } from '../data/chapters';
import type { DictionaryEntry } from '../types/dictionary';
import { formatCategoryEn, formatPosEn, getUsageNoteEn } from './lexiconHelpers';

export async function downloadDictionaryXlsx(
  entries: DictionaryEntry[],
): Promise<void> {
  const XLSX = await import('xlsx');

  const dictionaryRows = entries.map((entry) => ({
    ID: entry.id,
    'English Term': entry.term,
    'Bahasa Malaysia Term': entry.malayTerm,
    'Part of Speech': formatPosEn(entry.partOfSpeech),
    Category: formatCategoryEn(entry.category),
    'Book Section': entry.section,
    'Book Pages': entry.bookPages.join(', '),
    'PDF Pages': entry.pdfPages.join(', '),
    'English Definition': entry.definitionEn,
    'Bahasa Malaysia Definition': entry.definitionMs,
    'Context Note (English)': getUsageNoteEn(entry),
    'Verbatim PDF Quote': entry.excerpts[0]?.quote ?? '',
    'Quote Book Page': entry.excerpts[0]?.bookPage ?? '',
    'Quote PDF Page': entry.excerpts[0]?.pdfPage ?? '',
    Source: entry.source,
  }));

  const chapterRows = BOOK_CHAPTERS.map((chapter) => ({
    'Chapter ID': chapter.id,
    Track: chapter.group,
    'English Title': chapter.titleEn,
    'Bahasa Malaysia Title': chapter.titleMs,
    Subtitle: chapter.subtitleEn,
    'Book Page Range': chapter.bookRange,
    'Start PDF Page': chapter.startPdfPage,
    'End PDF Page': chapter.endPdfPage,
    'Related Dictionary Entries': entries.filter((entry) =>
      entryBelongsToChapter(entry, chapter),
    ).length,
  }));

  const dictionarySheet = XLSX.utils.json_to_sheet(dictionaryRows);
  dictionarySheet['!cols'] = [
    { wch: 24 }, // ID
    { wch: 28 }, // English Term
    { wch: 30 }, // BM Term
    { wch: 14 }, // Part of Speech
    { wch: 16 }, // Category
    { wch: 22 }, // Book Section
    { wch: 18 }, // Book Pages
    { wch: 18 }, // PDF Pages
    { wch: 52 }, // English Definition
    { wch: 56 }, // BM Definition
    { wch: 44 }, // Context Note
    { wch: 64 }, // Verbatim Quote
    { wch: 14 }, // Quote Book Page
    { wch: 14 }, // Quote PDF Page
    { wch: 12 }, // Source
  ];

  const chaptersSheet = XLSX.utils.json_to_sheet(chapterRows);
  chaptersSheet['!cols'] = [
    { wch: 18 },
    { wch: 18 },
    { wch: 22 },
    { wch: 24 },
    { wch: 44 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 22 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, dictionarySheet, 'Bilingual Dictionary');
  XLSX.utils.book_append_sheet(workbook, chaptersSheet, 'Chapters Summary');

  XLSX.writeFile(workbook, 'it-works-bilingual-database.xlsx');
}
