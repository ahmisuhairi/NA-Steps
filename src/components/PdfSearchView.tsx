import { BookOpenText, Loader2, PlusCircle, Search, Sparkles } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import type {
  DictionaryEntry,
  PdfCorpusStats,
  PdfSearchHit,
} from '../types/dictionary';
import { formatPosEn } from '../utils/lexiconHelpers';
import { ContextNoteBlock } from './ContextNoteBlock';

interface PdfSearchViewProps {
  onOpenPdfPage: (pdfPage: number, highlightQuery?: string) => void;
  onSaveAiEntry: (entry: DictionaryEntry) => void;
  existingIds: Set<string>;
}

const SAMPLE_QUERIES = [
  'surrender',
  'acting as if',
  'spiritual void',
  'principles before personalities',
  'willingness',
  'sanity',
  'recovery',
];

function highlightText(text: string, query: string) {
  const clean = query.trim();
  if (!clean) return text;
  const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, idx) =>
    regex.test(part) ? (
      <mark
        key={idx}
        className="rounded-sm bg-[var(--accent-lapis)]/15 px-0.5 font-semibold text-[var(--accent-lapis)]"
      >
        {part}
      </mark>
    ) : (
      <Fragment key={idx}>{part}</Fragment>
    ),
  );
}

export function PdfSearchView({
  onOpenPdfPage,
  onSaveAiEntry,
  existingIds,
}: PdfSearchViewProps) {
  const [stats, setStats] = useState<PdfCorpusStats | null>(null);
  const [query, setQuery] = useState('surrender');
  const [section, setSection] = useState('all');
  const [hits, setHits] = useState<PdfSearchHit[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiEntry, setAiEntry] = useState<DictionaryEntry | null>(null);
  const [savedEntryIds, setSavedEntryIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/pdf/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {
        // Ignore non-fatal stats fetch error
      });
  }, []);

  const executeSearch = async (targetQuery: string, targetSection: string) => {
    const clean = targetQuery.trim();
    if (!clean) {
      setHits([]);
      setTotalMatches(0);
      return;
    }

    setSearching(true);
    setSearchError(null);
    setAiEntry(null);
    setAiError(null);

    try {
      const params = new URLSearchParams({
        q: clean,
        section: targetSection,
      });
      const res = await fetch(`/api/pdf/search?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'PDF search failed.');
      }
      setHits(Array.isArray(data.hits) ? data.hits : []);
      setTotalMatches(Number(data.totalMatches || 0));
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : 'Network error while searching PDF.',
      );
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    executeSearch('surrender', 'all');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, section);
  };

  const handleAiLookup = async () => {
    const clean = query.trim();
    if (!clean) return;
    setAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/dictionary/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: clean }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate bilingual definition.');
      }
      setAiEntry(data.entry);
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : 'Failed to connect to lookup server.',
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveEntry = (entry: DictionaryEntry) => {
    onSaveAiEntry(entry);
    setSavedEntryIds((prev) => new Set(prev).add(entry.id));
  };

  const isAlreadySaved =
    aiEntry !== null &&
    (savedEntryIds.has(aiEntry.id) || existingIds.has(aiEntry.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="border-b border-[var(--paper-border)] pb-5">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          Full-Text Search ·{' '}
          {stats ? `${stats.totalPdfPages} PDF Pages` : '167 PDF Pages'}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
          Search Every Word &amp; Phrase in the PDF
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-secondary)]">
          Search any English word or phrase across all 167 book pages, inspect
          matching passages in context, and generate bilingual English &amp;
          Bahasa Malaysia entries grounded in the text.
        </p>
      </div>

      {/* Search Form Card */}
      <section className="mt-6 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-5">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 md:flex-row md:items-center"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a word or phrase (e.g. surrender, spiritual void)..."
              aria-label="PDF search keywords"
              className="min-h-[44px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] py-2.5 pl-9 pr-3 text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:border-[var(--accent-lapis)] focus:outline-none"
            />
          </div>

          <select
            value={section}
            onChange={(e) => {
              const nextSec = e.target.value;
              setSection(nextSec);
              executeSearch(query, nextSec);
            }}
            aria-label="Filter by book section"
            className="min-h-[44px] rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2.5 text-sm text-[var(--ink-primary)] focus:border-[var(--accent-lapis)] focus:outline-none md:w-56"
          >
            <option value="all">All Chapters</option>
            {(stats?.sections ?? []).map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={searching}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-md border border-[var(--accent-lapis)] bg-[var(--accent-lapis)] px-5 py-2.5 text-sm font-semibold text-[#fbf9f5] transition-colors hover:bg-[var(--accent-lapis-hover)] disabled:opacity-60 whitespace-nowrap"
          >
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>Search PDF</span>
          </button>

          <button
            type="button"
            onClick={handleAiLookup}
            disabled={aiLoading || !query.trim()}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-md border border-[var(--paper-border)] bg-[var(--paper-surface)] px-4 py-2.5 text-sm font-medium text-[var(--ink-primary)] transition-colors hover:border-[var(--accent-lapis)] hover:text-[var(--accent-lapis)] disabled:opacity-60 whitespace-nowrap"
          >
            {aiLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--accent-lapis)]" />
            )}
            <span>Bilingual Analysis (AI)</span>
          </button>
        </form>

        {/* Quick Sample Phrases */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--paper-border)] pt-3">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--ink-muted)]">
            Try searching:
          </span>
          {SAMPLE_QUERIES.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setQuery(sample);
                executeSearch(sample, section);
              }}
              className="min-h-[34px] rounded border border-[var(--paper-border)] bg-[var(--paper-bg)] px-2.5 py-1 text-xs text-[var(--ink-secondary)] transition-colors hover:border-[var(--accent-lapis)] hover:text-[var(--accent-lapis)]"
            >
              {sample}
            </button>
          ))}
        </div>
      </section>

      {/* AI Bilingual Lookup Result */}
      {(aiError || aiEntry) && (
        <section className="mt-6 rounded-lg border border-[var(--accent-lapis)]/35 bg-[var(--paper-card)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--paper-border)] pb-4">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--accent-lapis)]">
                Bilingual Entry Grounded in PDF Excerpts
              </p>
              {aiEntry && (
                <>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink-primary)]">
                    {aiEntry.term}
                  </h2>
                  <p className="mt-0.5 text-lg font-medium text-[var(--accent-lapis)]">
                    {aiEntry.malayTerm}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)]">
                    {[
                      formatPosEn(aiEntry.partOfSpeech),
                      aiEntry.section,
                      aiEntry.bookPages.length > 0
                        ? `Book pp. ${aiEntry.bookPages.join(', ')}`
                        : 'No literal substring match',
                    ].join(' · ')}
                  </p>
                </>
              )}
            </div>

            {aiEntry && (
              <button
                type="button"
                disabled={isAlreadySaved}
                onClick={() => handleSaveEntry(aiEntry)}
                className={`inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  isAlreadySaved
                    ? 'border-[var(--accent-forest)]/40 bg-[var(--paper-surface)] text-[var(--accent-forest)]'
                    : 'border-[var(--accent-lapis)] bg-[var(--accent-lapis)] text-[#fbf9f5] hover:bg-[var(--accent-lapis-hover)]'
                }`}
              >
                <PlusCircle className="h-4 w-4 shrink-0" />
                <span>
                  {isAlreadySaved ? 'Saved to Dictionary' : 'Save to Dictionary'}
                </span>
              </button>
            )}
          </div>

          {aiError && (
            <p className="mt-3 text-sm text-red-800">{aiError}</p>
          )}

          {aiEntry && (
            <div className="mt-4 space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--accent-lapis)]">
                    Definisi Bahasa Malaysia
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-primary)]">
                    {aiEntry.definitionMs}
                  </p>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--ink-muted)]">
                    English Definition
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-secondary)]">
                    {aiEntry.definitionEn}
                  </p>
                </div>
              </div>
              <ContextNoteBlock entry={aiEntry} compact />
            </div>
          )}
        </section>
      )}

      {/* Search Results */}
      <section className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)] tabular-nums">
            {searching
              ? 'Searching full PDF text...'
              : `${hits.length} matching pages (${totalMatches} total pages matched) for "${query.trim()}"`}
          </p>
        </div>

        {searchError && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">
            {searchError}
          </div>
        )}

        {!searching && !searchError && hits.length === 0 && query.trim() && (
          <div className="rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-8 text-center">
            <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink-primary)]">
              No exact match found in PDF
            </p>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              Try a root word (e.g. &ldquo;accept&rdquo;, &ldquo;fear&rdquo;,
              &ldquo;humility&rdquo;) or click{' '}
              <span className="font-semibold">Bilingual Analysis (AI)</span> to
              explore its meaning.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {hits.map((hit) => (
            <article
              key={`${hit.pdfPage}-${hit.bookPage}`}
              className="rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-5 transition-colors hover:border-[var(--accent-lapis)]/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--paper-border)] pb-3">
                <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)] tabular-nums">
                  <span className="font-semibold text-[var(--ink-primary)]">
                    {hit.section}
                  </span>
                  {' · '}Book p. {hit.bookPage}
                  {' · '}PDF p. {hit.pdfPage}
                  {' · '}
                  {hit.matchCount} {hit.matchCount === 1 ? 'match' : 'matches'}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenPdfPage(hit.pdfPage, query.trim())}
                  className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--accent-lapis)] hover:border-[var(--accent-lapis)] whitespace-nowrap"
                >
                  <BookOpenText className="h-3.5 w-3.5 shrink-0" />
                  <span>Read Full Page</span>
                </button>
              </div>

              <div className="mt-3 space-y-2.5">
                {hit.snippets.map((snippet, idx) => (
                  <p
                    key={idx}
                    className="text-sm leading-relaxed text-[var(--ink-primary)]"
                  >
                    {highlightText(snippet, query)}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
