import type {
  DictionaryEntry,
  EntryCategory,
  PartOfSpeech,
} from '../types/dictionary';
import {
  ADDITIONAL_PHRASES_LEXICON,
  DEEPENED_CURATED_PATCHES,
} from './enrichedCuratedData';
import { CURATED_LEXICON } from './lexiconData';
import { LEXICON_PART_1, type CompactLexiconTuple } from './lexiconPart1';
import { LEXICON_PART_2 } from './lexiconPart2';
import { LEXICON_PART_3 } from './lexiconPart3';
import { LEXICON_PART_4 } from './lexiconPart4';
import { LEXICON_PART_5 } from './lexiconPart5';
import { LEXICON_PART_6 } from './lexiconPart6';
import pdfWordRefsRaw from './pdfWordRefs.json';

interface PdfWordRef {
  bp: string[];
  pp: number[];
  sec: string;
  cat: 'L' | 'T' | 'I' | 'F';
  q: string;
  qb: string;
  qp: number;
  qs: string;
}

const pdfWordRefs = pdfWordRefsRaw as Record<string, PdfWordRef>;

function mapPos(code: CompactLexiconTuple[2]): PartOfSpeech {
  switch (code) {
    case 'N':
      return 'Kata Nama';
    case 'V':
      return 'Kata Kerja';
    case 'A':
      return 'Kata Sifat';
    case 'P':
      return 'Prinsip';
    default:
      return 'Frasa';
  }
}

function mapCategory(code: PdfWordRef['cat'] | undefined): EntryCategory {
  switch (code) {
    case 'L':
      return 'Langkah 1–12';
    case 'T':
      return 'Tradisi 1–12';
    case 'I':
      return 'Indeks Utama';
    default:
      return 'Frasa Teras';
  }
}

function toTitleHeadword(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const ENRICHED_CURATED: DictionaryEntry[] = CURATED_LEXICON.map((entry) => {
  const patch = DEEPENED_CURATED_PATCHES[entry.id];
  if (!patch) return entry;
  const mergedExcerpts = patch.extraExcerpts
    ? [
        ...patch.extraExcerpts,
        ...entry.excerpts.filter(
          (ex) =>
            !patch.extraExcerpts!.some((extra) => extra.quote === ex.quote),
        ),
      ]
    : entry.excerpts;

  return {
    ...entry,
    definitionEn: patch.definitionEn ?? entry.definitionEn,
    definitionMs: patch.definitionMs ?? entry.definitionMs,
    usageNoteEn: patch.usageNoteEn ?? entry.usageNoteEn,
    aliases: patch.aliases ?? entry.aliases,
    excerpts: mergedExcerpts,
  };
});

const COMPACT_PARTS: CompactLexiconTuple[] = [
  ...LEXICON_PART_1,
  ...LEXICON_PART_2,
  ...LEXICON_PART_3,
  ...LEXICON_PART_4,
  ...LEXICON_PART_5,
  ...LEXICON_PART_6,
];

const CURATED_KEYS = new Set(
  [...ENRICHED_CURATED, ...ADDITIONAL_PHRASES_LEXICON].flatMap((entry) => [
    entry.term.toLowerCase(),
    ...(entry.aliases ?? []).map((a) => a.toLowerCase()),
  ]),
);

const EXTENDED_ENTRIES: DictionaryEntry[] = COMPACT_PARTS.filter(
  ([word]) => !CURATED_KEYS.has(word.toLowerCase()),
).map(([word, malayTerm, posCode, defEn, defMs]) => {
  const key = word.toLowerCase();
  const ref = pdfWordRefs[key];
  const section = ref?.sec || 'General Reference';
  const bookPages = ref?.bp ?? [];
  const pdfPages = ref?.pp ?? [];

  return {
    id: `ext-${key}`,
    term: toTitleHeadword(word),
    malayTerm,
    partOfSpeech: mapPos(posCode),
    category: mapCategory(ref?.cat),
    definitionEn: defEn,
    definitionMs: defMs,
    usageNoteEn:
      bookPages.length > 0
        ? `Used in ${section} (Book pp. ${bookPages.join(', ')}). Select any page number below to read the exact passage in context.`
        : `Reference vocabulary term appearing in It Works: How and Why.`,
    usageNoteMs:
      bookPages.length > 0
        ? `Digunakan dalam bahagian ${section} (Halaman Buku: ${bookPages.join(', ')}).`
        : `Istilah rujukan daripada teks PDF It Works: How and Why.`,
    bookPages,
    pdfPages,
    section,
    excerpts: ref?.q
      ? [
          {
            bookPage: ref.qb,
            pdfPage: ref.qp,
            section: ref.qs,
            quote: ref.q,
          },
        ]
      : [],
    source: 'curated',
  };
});

export const FULL_LEXICON: DictionaryEntry[] = [
  ...ENRICHED_CURATED,
  ...ADDITIONAL_PHRASES_LEXICON,
  ...EXTENDED_ENTRIES,
];
