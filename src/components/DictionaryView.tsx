import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { DictionaryEntry, EntryCategory } from '../types/dictionary';
import { formatCategoryEn, formatPosEn } from '../utils/lexiconHelpers';
import { ContextNoteBlock } from './ContextNoteBlock';
import { HighlightedQuoteBlock } from './HighlightedQuoteBlock';
import { PageOccurrencesGrid } from './PageOccurrencesGrid';

interface DictionaryViewProps {
  entries: DictionaryEntry[];
  selectedId: string;
  externalSelectNonce?: number;
  onSelectEntry: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenPdfPage: (pdfPage: number, highlightQuery?: string) => void;
  onDeleteCustomEntry: (id: string) => void;
}

type FilterCategory = 'All' | EntryCategory;

const CATEGORY_TABS: { id: FilterCategory; label: string }[] = [
  { id: 'All', label: 'All' },
  { id: 'Indeks Utama', label: 'Main Index' },
  { id: 'Langkah 1–12', label: 'Steps 1–12' },
  { id: 'Tradisi 1–12', label: 'Traditions 1–12' },
  { id: 'Frasa Teras', label: 'Core Phrases' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function DictionaryView({
  entries,
  selectedId,
  externalSelectNonce = 0,
  onSelectEntry,
  onOpenAddModal,
  onOpenPdfPage,
  onDeleteCustomEntry,
}: DictionaryViewProps) {
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');
  const [displayLimit, setDisplayLimit] = useState<number>(120);
  const [mobilePane, setMobilePane] = useState<'list' | 'detail'>('list');
  const [copiedDef, setCopiedDef] = useState(false);

  useEffect(() => {
    setDisplayLimit(120);
  }, [query, activeLetter, activeCategory]);

  useEffect(() => {
    if (externalSelectNonce > 0) {
      setMobilePane('detail');
    }
  }, [externalSelectNonce]);

  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((entry) => {
      const first = entry.term.trim().charAt(0).toUpperCase();
      if (first) set.add(first);
    });
    return set;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .filter((entry) => {
        if (activeCategory !== 'All' && entry.category !== activeCategory) {
          return false;
        }

        if (activeLetter) {
          if (entry.term.trim().charAt(0).toUpperCase() !== activeLetter) {
            return false;
          }
        }

        if (q) {
          const haystack = [
            entry.term,
            entry.malayTerm,
            entry.definitionEn,
            entry.definitionMs,
            entry.usageNoteEn ?? '',
            entry.section,
            entry.bookPages.join(' '),
            ...(entry.aliases ?? []),
          ]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [entries, query, activeLetter, activeCategory]);

  const activeEntry = useMemo(() => {
    return (
      filteredEntries.find((e) => e.id === selectedId) ||
      entries.find((e) => e.id === selectedId) ||
      filteredEntries[0] ||
      null
    );
  }, [filteredEntries, entries, selectedId]);

  const activeIndex = useMemo(() => {
    if (!activeEntry) return -1;
    return filteredEntries.findIndex((e) => e.id === activeEntry.id);
  }, [filteredEntries, activeEntry]);

  const prevEntry = activeIndex > 0 ? filteredEntries[activeIndex - 1] : null;
  const nextEntry =
    activeIndex >= 0 && activeIndex < filteredEntries.length - 1
      ? filteredEntries[activeIndex + 1]
      : null;

  const handleSelectEntry = (id: string) => {
    onSelectEntry(id);
    setMobilePane('detail');
    setCopiedDef(false);
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyDefinition = async () => {
    if (!activeEntry) return;
    const text = [
      `${activeEntry.term} — ${activeEntry.malayTerm}`,
      `Bahasa Malaysia: ${activeEntry.definitionMs}`,
      `English: ${activeEntry.definitionEn}`,
      activeEntry.excerpts[0]?.quote
        ? `PDF Quote: "${activeEntry.excerpts[0].quote}" (Book p. ${activeEntry.excerpts[0].bookPage})`
        : '',
      activeEntry.bookPages.length > 0
        ? `Book Pages: ${activeEntry.bookPages.join(', ')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopiedDef(true);
      window.setTimeout(() => setCopiedDef(false), 2000);
    } catch {
      // Ignore if clipboard unavailable
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      {/* Compact Editorial Intro Strip */}
      <div className="mb-5 flex flex-col justify-between gap-4 border-b border-[var(--paper-border)] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)] tabular-nums">
            It Works: How and Why · {entries.length.toLocaleString()} Bilingual
            Entries
          </p>
          <h1 className="mt-1 [text-wrap:balance] font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
            Bilingual Dictionary &amp; Key Phrases
          </h1>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-2 self-start rounded-md border border-[var(--paper-border)] bg-[var(--paper-card)] px-4 py-2 text-sm font-medium text-[var(--ink-primary)] transition-colors hover:border-[var(--accent-lapis)] hover:text-[var(--accent-lapis)] whitespace-nowrap sm:self-auto"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>Add Term</span>
        </button>
      </div>

      {/* Responsive 2-Column Editorial Reference Shell */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Sticky Rail: Filters & Headword List */}
        <aside
          className={`lg:col-span-5 xl:col-span-4 ${
            mobilePane === 'detail' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-4 lg:sticky lg:top-20">
            {/* Search Box */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search English terms, BM meanings, or page..."
                aria-label="Search dictionary entries"
                className="min-h-[44px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] py-2 pl-10 pr-10 text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:border-[var(--accent-lapis)] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter Strip */}
            <div className="no-scrollbar mt-3 flex flex-nowrap gap-1.5 overflow-x-auto border-b border-[var(--paper-border)] pb-3 sm:flex-wrap sm:overflow-visible">
              {CATEGORY_TABS.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`min-h-[36px] shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-lapis)] text-[#fbf9f5]'
                        : 'bg-[var(--paper-surface)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* A-Z Quick Index Strip */}
            <div className="no-scrollbar mt-3 flex flex-nowrap gap-1 overflow-x-auto border-b border-[var(--paper-border)] pb-3 sm:flex-wrap sm:overflow-visible">
              <button
                type="button"
                onClick={() => setActiveLetter('')}
                className={`min-h-[32px] shrink-0 whitespace-nowrap rounded px-2.5 py-1 font-[family-name:var(--font-mono)] text-xs transition-colors ${
                  activeLetter === ''
                    ? 'bg-[var(--accent-lapis)] font-semibold text-[#fbf9f5]'
                    : 'text-[var(--ink-secondary)] hover:bg-[var(--paper-surface)]'
                }`}
              >
                All
              </button>
              {ALPHABET.map((letter) => {
                const hasEntries = availableLetters.has(letter);
                const isActive = activeLetter === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    disabled={!hasEntries}
                    onClick={() => setActiveLetter(isActive ? '' : letter)}
                    className={`min-h-[32px] min-w-[30px] shrink-0 rounded px-1.5 py-1 font-[family-name:var(--font-mono)] text-xs transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-lapis)] font-semibold text-[#fbf9f5]'
                        : hasEntries
                          ? 'text-[var(--ink-primary)] hover:bg-[var(--paper-surface)]'
                          : 'cursor-not-allowed text-[var(--ink-muted)]/35'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* Count & Reset Bar */}
            <div className="mt-3 flex items-center justify-between font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)] tabular-nums">
              <span>{filteredEntries.length.toLocaleString()} entries</span>
              {(query || activeLetter || activeCategory !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveLetter('');
                    setActiveCategory('All');
                  }}
                  className="min-h-[32px] px-1 text-[var(--accent-lapis)] hover:underline"
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* Scrollable Headword List */}
            <div className="mt-2 max-h-[58vh] divide-y divide-[var(--paper-border)] overflow-y-auto pr-1 lg:max-h-[480px]">
              {filteredEntries.length === 0 ? (
                <div className="py-10 text-center text-sm text-[var(--ink-muted)]">
                  No matching terms found. Try another keyword or use the{' '}
                  <span className="font-semibold">Search</span> tab.
                </div>
              ) : (
                <>
                  {filteredEntries.slice(0, displayLimit).map((entry) => {
                    const isSelected = activeEntry?.id === entry.id;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => handleSelectEntry(entry.id)}
                        className={`group flex min-h-[56px] w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-[var(--paper-surface)]'
                            : 'hover:bg-[var(--paper-bg)]'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span
                              className={`truncate font-[family-name:var(--font-display)] text-lg font-semibold leading-snug ${
                                isSelected
                                  ? 'text-[var(--accent-lapis)]'
                                  : 'text-[var(--ink-primary)]'
                              }`}
                            >
                              {entry.term}
                            </span>
                            <span className="tabular-nums shrink-0 font-[family-name:var(--font-mono)] text-[11px] text-[var(--ink-muted)]">
                              {entry.bookPages.length > 0
                                ? `p. ${entry.bookPages[0]}`
                                : ''}
                            </span>
                          </div>
                          <span className="block truncate text-xs text-[var(--ink-secondary)]">
                            {entry.malayTerm}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[var(--ink-muted)] lg:hidden" />
                      </button>
                    );
                  })}
                  {filteredEntries.length > displayLimit && (
                    <div className="py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setDisplayLimit((prev) => prev + 180)}
                        className="min-h-[44px] rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-4 py-2 font-[family-name:var(--font-mono)] text-xs font-medium text-[var(--accent-lapis)] hover:border-[var(--accent-lapis)]"
                      >
                        Load more ({filteredEntries.length - displayLimit}{' '}
                        remaining)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Right Main Reading Pane */}
        <main
          className={`lg:col-span-7 xl:col-span-8 ${
            mobilePane === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Mobile Back-to-List Bar */}
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => setMobilePane('list')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--paper-border)] bg-[var(--paper-card)] px-3.5 py-2 text-sm font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)]"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span>Back to List</span>
            </button>

            {activeIndex >= 0 && (
              <span className="tabular-nums font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)]">
                {activeIndex + 1} / {filteredEntries.length}
              </span>
            )}
          </div>

          {activeEntry ? (
            <article className="rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-5 sm:p-8 lg:p-10">
              {/* Headword Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-[var(--paper-border)] pb-6 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <h2 className="[text-wrap:balance] font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--ink-primary)] sm:text-5xl">
                    {activeEntry.term}
                  </h2>
                  <p className="mt-2 text-xl font-medium text-[var(--accent-lapis)] sm:text-2xl">
                    {activeEntry.malayTerm}
                  </p>

                  {/* Unboxed Inline Middot Metadata */}
                  <p className="mt-3 font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)]">
                    {[
                      formatPosEn(activeEntry.partOfSpeech),
                      formatCategoryEn(activeEntry.category),
                      activeEntry.section,
                      activeEntry.source === 'ai-lookup'
                        ? 'AI Lookup'
                        : activeEntry.source === 'custom'
                          ? 'Custom Entry'
                          : 'Curated Corpus',
                    ].join(' · ')}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyDefinition}
                    className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-1.5 text-xs font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--accent-lapis)] hover:text-[var(--accent-lapis)] whitespace-nowrap"
                  >
                    {copiedDef ? (
                      <>
                        <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent-forest)]" />
                        <span className="text-[var(--accent-forest)]">
                          Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 shrink-0" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {activeEntry.source !== 'curated' && (
                    <button
                      type="button"
                      onClick={() => onDeleteCustomEntry(activeEntry.id)}
                      aria-label="Delete custom entry"
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--ink-muted)] transition-colors hover:border-red-700 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Fuller Bilingual Definitions */}
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <section>
                  <h3 className="font-[family-name:var(--font-mono)] text-xs font-medium text-[var(--accent-lapis)]">
                    Definisi Bahasa Malaysia
                  </h3>
                  <p className="mt-2 max-w-prose text-base leading-[1.75] text-[var(--ink-primary)]">
                    {activeEntry.definitionMs}
                  </p>
                </section>

                <section>
                  <h3 className="font-[family-name:var(--font-mono)] text-xs font-medium text-[var(--ink-muted)]">
                    English Definition
                  </h3>
                  <p className="mt-2 max-w-prose text-base leading-[1.75] text-[var(--ink-secondary)]">
                    {activeEntry.definitionEn}
                  </p>
                </section>
              </div>

              {/* Highlighted Verbatim Quote from PDF */}
              {activeEntry.excerpts.length > 0 && (
                <div className="mt-6">
                  <HighlightedQuoteBlock
                    excerpts={activeEntry.excerpts}
                    highlightTerm={activeEntry.term}
                    onOpenPdfPage={onOpenPdfPage}
                  />
                </div>
              )}

              {/* Context Note in Book (English only, no toggle) */}
              <div className="mt-6">
                <ContextNoteBlock entry={activeEntry} />
              </div>

              {/* Compact Grid of ALL Matching PDF & Book Pages */}
              <div className="mt-6">
                <PageOccurrencesGrid
                  term={activeEntry.term}
                  fallbackPdfPages={activeEntry.pdfPages}
                  fallbackBookPages={activeEntry.bookPages}
                  onOpenPdfPage={onOpenPdfPage}
                />
              </div>

              {/* Sequential Dictionary Page Turners */}
              {(prevEntry || nextEntry) && (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--paper-border)] pt-5">
                  {prevEntry ? (
                    <button
                      type="button"
                      onClick={() => handleSelectEntry(prevEntry.id)}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3.5 py-2 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)]"
                    >
                      <ChevronLeft className="h-4 w-4 shrink-0" />
                      <span className="max-w-[140px] truncate">
                        {prevEntry.term}
                      </span>
                    </button>
                  ) : (
                    <span />
                  )}

                  {nextEntry && (
                    <button
                      type="button"
                      onClick={() => handleSelectEntry(nextEntry.id)}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3.5 py-2 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)]"
                    >
                      <span className="max-w-[140px] truncate">
                        {nextEntry.term}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    </button>
                  )}
                </div>
              )}
            </article>
          ) : (
            <div className="rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-10 text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink-primary)]">
                No entry selected
              </p>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                Choose a term from the list on the left or adjust your search
                filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
