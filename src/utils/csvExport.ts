import type { DictionaryEntry } from '../types/dictionary';

function escapeCsvCell(value: string): string {
  const normalized = (value ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

export function generateDictionaryCsv(entries: DictionaryEntry[]): string {
  const headers = [
    'ID',
    'Istilah Inggeris',
    'Padanan Bahasa Melayu',
    'Golongan Kata',
    'Kategori',
    'Bahagian Buku',
    'Halaman Buku',
    'Halaman PDF',
    'Definisi (English)',
    'Definisi (Bahasa Melayu)',
    'Nota Konteks (BM)',
    'Petikan PDF',
    'Sumber',
  ];

  const rows = entries.map((entry) => [
    entry.id,
    entry.term,
    entry.malayTerm,
    entry.partOfSpeech,
    entry.category,
    entry.section,
    entry.bookPages.join(', '),
    entry.pdfPages.join(', '),
    entry.definitionEn,
    entry.definitionMs,
    entry.usageNoteMs ?? entry.usageNoteEn ?? '',
    entry.excerpts[0]?.quote ?? '',
    entry.source,
  ]);

  const csvLines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ];

  // UTF-8 BOM for seamless Excel & Google Sheets Malay character import
  return `\uFEFF${csvLines.join('\r\n')}`;
}
