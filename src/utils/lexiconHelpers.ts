import type {
  DictionaryEntry,
  EntryCategory,
  PartOfSpeech,
} from '../types/dictionary';

export function formatPosEn(pos: PartOfSpeech): string {
  switch (pos) {
    case 'Kata Nama':
      return 'Noun';
    case 'Kata Kerja':
      return 'Verb';
    case 'Kata Sifat':
      return 'Adjective';
    case 'Prinsip':
      return 'Principle';
    case 'Frasa':
    default:
      return 'Phrase';
  }
}

export function formatCategoryEn(category: EntryCategory): string {
  switch (category) {
    case 'Indeks Utama':
      return 'Main Index';
    case 'Langkah 1–12':
      return 'Steps 1–12';
    case 'Tradisi 1–12':
      return 'Traditions 1–12';
    case 'Frasa Teras':
    default:
      return 'Core Phrases';
  }
}

export function getUsageNoteEn(entry: DictionaryEntry): string {
  if (entry.usageNoteEn && entry.usageNoteEn.trim()) {
    return entry.usageNoteEn.trim();
  }
  const pagesLabel =
    entry.bookPages.length > 0
      ? ` (Book pp. ${entry.bookPages.join(', ')})`
      : '';
  if (entry.excerpts.length > 0) {
    return `Appears in ${entry.section}${pagesLabel}, where it underscores key recovery principles in context.`;
  }
  if (entry.section && entry.section !== 'Rujukan Umum') {
    return `Referenced in ${entry.section}${pagesLabel} of It Works: How and Why.`;
  }
  return `Reference term from It Works: How and Why${pagesLabel}.`;
}

export function normalizeHeadwordForPdfSearch(term: string): string {
  return term.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeTokenText(raw: string): string {
  return raw
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .toLowerCase()
    .replace(/^[^a-z0-9'-]+|[^a-z0-9'-]+$/g, '');
}

function splitPhraseTokens(phrase: string): string[] {
  return phrase
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[.,;:!?()"\u201C\u201D]/g, ' ')
    .trim()
    .split(/\s+/)
    .map((t) => normalizeTokenText(t))
    .filter(Boolean);
}

export interface PhraseRule {
  tokens: string[];
  displayPhrase: string;
  entry: DictionaryEntry;
}

export interface WordAndPhraseLookup {
  singleIndex: Map<string, DictionaryEntry>;
  phraseByFirstToken: Map<string, PhraseRule[]>;
}

export function buildWordLookupIndex(
  entries: DictionaryEntry[],
): Map<string, DictionaryEntry> {
  const map = new Map<string, DictionaryEntry>();
  for (const entry of entries) {
    const clean = normalizeHeadwordForPdfSearch(entry.term).toLowerCase();
    if (clean && !map.has(clean)) {
      map.set(clean, entry);
    }
    const raw = entry.term.toLowerCase();
    if (raw && !map.has(raw)) {
      map.set(raw, entry);
    }
    for (const alias of entry.aliases ?? []) {
      const cleanAlias = alias.trim().toLowerCase();
      if (cleanAlias && !map.has(cleanAlias)) {
        map.set(cleanAlias, entry);
      }
    }
  }
  return map;
}

export function buildWordAndPhraseLookup(
  entries: DictionaryEntry[],
): WordAndPhraseLookup {
  const singleIndex = buildWordLookupIndex(entries);
  const phraseByFirstToken = new Map<string, PhraseRule[]>();
  const seenKeys = new Set<string>();

  const registerPhrase = (phrase: string, entry: DictionaryEntry) => {
    const tokens = splitPhraseTokens(phrase);
    if (tokens.length < 2) return;
    const key = tokens.join(' ');
    if (seenKeys.has(key)) return;
    seenKeys.add(key);

    const first = tokens[0];
    const existing = phraseByFirstToken.get(first) ?? [];
    existing.push({ tokens, displayPhrase: phrase.trim(), entry });
    phraseByFirstToken.set(first, existing);
  };

  for (const entry of entries) {
    for (const alias of entry.aliases ?? []) {
      registerPhrase(alias, entry);
    }
    const clean = normalizeHeadwordForPdfSearch(entry.term);
    if (clean) {
      registerPhrase(clean, entry);
    }
  }

  for (const [first, rules] of phraseByFirstToken.entries()) {
    rules.sort((a, b) => b.tokens.length - a.tokens.length);
    phraseByFirstToken.set(first, rules);
  }

  return { singleIndex, phraseByFirstToken };
}

export function findEntryForToken(
  rawWord: string,
  index: Map<string, DictionaryEntry>,
): DictionaryEntry | null {
  const clean = normalizeTokenText(rawWord);
  if (!clean || clean.length < 2) return null;

  const direct = index.get(clean);
  if (direct) return direct;

  const candidates: string[] = [];
  if (clean.endsWith("'s")) candidates.push(clean.slice(0, -2));
  if (clean.endsWith('ies') && clean.length > 4) {
    candidates.push(`${clean.slice(0, -3)}y`);
  }
  if (clean.endsWith('es') && clean.length > 4) {
    candidates.push(clean.slice(0, -2));
    candidates.push(clean.slice(0, -1));
  }
  if (clean.endsWith('s') && clean.length > 3) {
    candidates.push(clean.slice(0, -1));
  }
  if (clean.endsWith('ed') && clean.length > 4) {
    candidates.push(clean.slice(0, -2));
    candidates.push(clean.slice(0, -1));
    if (clean.endsWith('ied')) candidates.push(`${clean.slice(0, -3)}y`);
  }
  if (clean.endsWith('ing') && clean.length > 5) {
    candidates.push(clean.slice(0, -3));
    candidates.push(`${clean.slice(0, -3)}e`);
  }
  if (clean.endsWith('ly') && clean.length > 4) {
    candidates.push(clean.slice(0, -2));
  }
  if (clean.endsWith('ness') && clean.length > 6) {
    candidates.push(clean.slice(0, -4));
  }

  for (const candidate of candidates) {
    const hit = index.get(candidate);
    if (hit) return hit;
  }

  return null;
}

export interface InteractiveTextSegment {
  kind: 'space' | 'plain' | 'word' | 'phrase';
  text: string;
  query: string;
  entry: DictionaryEntry | null;
}

/**
 * Splits chapter prose into interactive segments, greedily matching multi-word
 * recovery phrases & proper nouns longest-first before falling back to single words.
 */
export function tokenizeTextWithPhrases(
  text: string,
  lookup: WordAndPhraseLookup,
): InteractiveTextSegment[] {
  const rawParts = text.split(/(\s+)/);
  const wordMeta = rawParts.map((part) => ({
    raw: part,
    isSpace: /^\s+$/.test(part),
    norm: normalizeTokenText(part),
  }));

  const segments: InteractiveTextSegment[] = [];
  let i = 0;

  while (i < wordMeta.length) {
    const current = wordMeta[i];
    if (current.isSpace) {
      segments.push({
        kind: 'space',
        text: current.raw,
        query: '',
        entry: null,
      });
      i += 1;
      continue;
    }

    if (
      !current.norm ||
      current.norm.length < 2 ||
      !/[a-zA-Z]/.test(current.norm)
    ) {
      segments.push({
        kind: 'plain',
        text: current.raw,
        query: '',
        entry: null,
      });
      i += 1;
      continue;
    }

    // Check longest-first multi-word phrase match starting at wordMeta[i]
    const candidates = lookup.phraseByFirstToken.get(current.norm);
    let matchedRule: PhraseRule | null = null;
    let matchedEndIdx = i;

    if (candidates && candidates.length > 0) {
      for (const rule of candidates) {
        let cursor = i;
        let ok = true;
        for (let k = 0; k < rule.tokens.length; k += 1) {
          while (cursor < wordMeta.length && wordMeta[cursor].isSpace) {
            cursor += 1;
          }
          if (
            cursor >= wordMeta.length ||
            wordMeta[cursor].norm !== rule.tokens[k]
          ) {
            ok = false;
            break;
          }
          matchedEndIdx = cursor;
          cursor += 1;
        }
        if (ok) {
          matchedRule = rule;
          break;
        }
      }
    }

    if (matchedRule) {
      const spanText = wordMeta
        .slice(i, matchedEndIdx + 1)
        .map((m) => m.raw)
        .join('');
      segments.push({
        kind: 'phrase',
        text: spanText,
        query: matchedRule.displayPhrase,
        entry: matchedRule.entry,
      });
      i = matchedEndIdx + 1;
      continue;
    }

    const singleEntry = findEntryForToken(current.norm, lookup.singleIndex);
    segments.push({
      kind: 'word',
      text: current.raw,
      query: current.raw.replace(/^[^a-zA-Z0-9'-]+|[^a-zA-Z0-9'-]+$/g, ''),
      entry: singleEntry,
    });
    i += 1;
  }

  return segments;
}
