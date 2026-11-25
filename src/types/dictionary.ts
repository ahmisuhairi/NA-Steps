export type PartOfSpeech =
  | 'Kata Nama'
  | 'Frasa'
  | 'Prinsip'
  | 'Kata Kerja'
  | 'Kata Sifat';

export type EntryCategory =
  | 'Indeks Utama'
  | 'Langkah 1–12'
  | 'Tradisi 1–12'
  | 'Frasa Teras';

export type EntrySource = 'curated' | 'ai-lookup' | 'custom';

export interface PdfExcerpt {
  bookPage: string;
  pdfPage: number;
  section: string;
  quote: string;
}

export interface DictionaryEntry {
  id: string;
  term: string;
  malayTerm: string;
  partOfSpeech: PartOfSpeech;
  category: EntryCategory;
  definitionEn: string;
  definitionMs: string;
  usageNoteMs?: string;
  usageNoteEn?: string;
  bookPages: string[];
  pdfPages: number[];
  section: string;
  excerpts: PdfExcerpt[];
  source: EntrySource;
  aliases?: string[];
}

export interface PdfPageRecord {
  pdfPage: number;
  bookPage: string;
  section: string;
  text: string;
}

export interface PdfPageOccurrence {
  pdfPage: number;
  bookPage: string;
  section: string;
  matchCount: number;
  track: 'intro' | 'steps' | 'traditions' | 'index';
}

export interface PdfSearchSnippet {
  text: string;
  matchCount: number;
}

export interface PdfSearchHit {
  pdfPage: number;
  bookPage: string;
  section: string;
  matchCount: number;
  snippets: string[];
}

export interface PdfCorpusStats {
  title: string;
  subtitle: string;
  totalPdfPages: number;
  sections: string[];
}

export interface GasConfigOptions {
  includeSeedData: boolean;
  includeGeminiLookup: boolean;
  includeDrivePdfImporter: boolean;
  webAppAccess: 'ANYONE_ANONYMOUS' | 'ANYONE' | 'MYSELF';
}

export type ActiveTab =
  | 'dictionary'
  | 'steps'
  | 'traditions'
  | 'search'
  | 'gas'
  | 'guide';

export type ChapterGroup =
  | 'Introduction'
  | 'Twelve Steps'
  | 'Twelve Traditions'
  | 'Appendix';

export interface ChapterDefinition {
  id: string;
  group: ChapterGroup;
  titleEn: string;
  titleMs: string;
  subtitleEn: string;
  bookRange: string;
  startPdfPage: number;
  endPdfPage: number;
}
