import {
  BookOpenText,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  entryBelongsToChapter,
  STEP_CHAPTERS,
  TRADITION_CHAPTERS,
} from '../data/chapters';
import type {
  ChapterDefinition,
  DictionaryEntry,
  PdfPageRecord,
} from '../types/dictionary';
import {
  buildWordAndPhraseLookup,
  formatCategoryEn,
  formatPosEn,
  tokenizeTextWithPhrases,
} from '../utils/lexiconHelpers';
import { ContextNoteBlock } from './ContextNoteBlock';
import { HighlightedQuoteBlock } from './HighlightedQuoteBlock';
import { PageOccurrencesGrid } from './PageOccurrencesGrid';

interface FocusedStudyViewProps {
  track: 'steps' | 'traditions';
  entries: DictionaryEntry[];
  onSaveAiEntry: (entry: DictionaryEntry) => void;
  onOpenPdfPage: (pdfPage: number, highlightQuery?: string) => void;
}

type StudySubView = 'reader' | 'vocabulary';

function shortSelectorLabel(chapter: ChapterDefinition): string {
  if (chapter.id === 'Introduction') return 'Intro';
  return chapter.id.replace('Tradition ', 'Trad. ');
}

function getShortChipNumber(chapter: ChapterDefinition, idx: number): string {
  if (chapter.id === 'Introduction') return 'Intro';
  if (chapter.id.startsWith('Step ')) return `Step ${idx}`;
  return `Tradition ${idx + 1}`;
}

export function FocusedStudyView({
  track,
  entries,
  onSaveAiEntry,
  onOpenPdfPage,
}: FocusedStudyViewProps) {
  const chapters = track === 'steps' ? STEP_CHAPTERS : TRADITION_CHAPTERS;
  const defaultChapterId = track === 'steps' ? 'Step One' : 'Tradition One';

  const [selectedChapterId, setSelectedChapterId] =
    useState<string>(defaultChapterId);
  const [subView, setSubView] = useState<StudySubView>('reader');
  const [chapterPages, setChapterPages] = useState<PdfPageRecord[]>([]);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [pagesError, setPagesError] = useState<string | null>(null);

  // Interactive tap-to-define inspector state (words & multi-word phrases)
  const [inspectedQuery, setInspectedQuery] = useState<string | null>(null);
  const [inspectedEntry, setInspectedEntry] = useState<DictionaryEntry | null>(
    null,
  );
  const [aiLookingUp, setAiLookingUp] = useState(false);
  const [aiLookupError, setAiLookupError] = useState<string | null>(null);
  const [aiSavedNotice, setAiSavedNotice] = useState(false);

  // Vocabulary sub-view state
  const [vocabFilter, setVocabFilter] = useState('');
  const [vocabLimit, setVocabLimit] = useState(40);

  // Reset selected chapter cleanly when switching between Steps and Traditions
  useEffect(() => {
    setSelectedChapterId(track === 'steps' ? 'Step One' : 'Tradition One');
    setInspectedQuery(null);
    setInspectedEntry(null);
    setVocabFilter('');
    setVocabLimit(40);
  }, [track]);

  useEffect(() => {
    setVocabLimit(40);
    setAiLookupError(null);
    setAiSavedNotice(false);
  }, [selectedChapterId, vocabFilter]);

  const activeChapter = useMemo(() => {
    return (
      chapters.find((c) => c.id === selectedChapterId) ??
      chapters[track === 'steps' ? 1 : 0] ??
      chapters[0]
    );
  }, [chapters, selectedChapterId, track]);

  const activeIndex = useMemo(
    () => chapters.findIndex((c) => c.id === activeChapter.id),
    [chapters, activeChapter.id],
  );

  const prevChapter = activeIndex > 0 ? chapters[activeIndex - 1] : null;
  const nextChapter =
    activeIndex >= 0 && activeIndex < chapters.length - 1
      ? chapters[activeIndex + 1]
      : null;

  const wordAndPhraseLookup = useMemo(
    () => buildWordAndPhraseLookup(entries),
    [entries],
  );

  const chapterEntries = useMemo(() => {
    const q = vocabFilter.trim().toLowerCase();
    return entries
      .filter((entry) => entryBelongsToChapter(entry, activeChapter))
      .filter((entry) => {
        if (!q) return true;
        return [
          entry.term,
          entry.malayTerm,
          entry.definitionMs,
          entry.definitionEn,
          entry.usageNoteEn ?? '',
          ...(entry.aliases ?? []),
        ]
          .join(' ')
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [entries, activeChapter, vocabFilter]);

  useEffect(() => {
    let cancelled = false;
    setPagesLoading(true);
    setPagesError(null);

    const params = new URLSearchParams({
      start: String(activeChapter.startPdfPage),
      end: String(activeChapter.endPdfPage),
    });

    fetch(`/api/pdf/pages?${params.toString()}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load chapter pages.');
        }
        return Array.isArray(data.pages) ? (data.pages as PdfPageRecord[]) : [];
      })
      .then((pages) => {
        if (!cancelled) setChapterPages(pages);
      })
      .catch((err) => {
        if (!cancelled) {
          setPagesError(
            err instanceof Error
              ? err.message
              : 'Failed to fetch chapter text from the PDF.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setPagesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeChapter.startPdfPage, activeChapter.endPdfPage]);

  const handleTapSegment = (query: string, entry: DictionaryEntry | null) => {
    if (!query || query.length < 2) return;
    setInspectedQuery(query);
    setInspectedEntry(entry);
    setAiLookupError(null);
    setAiSavedNotice(false);
  };

  const handleAnalyzeTappedWord = async () => {
    if (!inspectedQuery) return;
    setAiLookingUp(true);
    setAiLookupError(null);

    try {
      const res = await fetch('/api/dictionary/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inspectedQuery }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || 'Unable to generate bilingual definition.',
        );
      }
      setInspectedEntry(data.entry as DictionaryEntry);
    } catch (err) {
      setAiLookupError(
        err instanceof Error ? err.message : 'Failed to reach lookup service.',
      );
    } finally {
      setAiLookingUp(false);
    }
  };

  const handleSaveAiEntry = (entry: DictionaryEntry) => {
    onSaveAiEntry(entry);
    setAiSavedNotice(true);
  };

  const renderInspectorContent = (isMobileSheet: boolean) => {
    if (!inspectedQuery) {
      return (
        <div className="rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-6 text-center lg:sticky lg:top-20">
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--ink-muted)]">
            Word &amp; Phrase Study Inspector
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--ink-primary)]">
            Tap any underlined phrase or word
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
            Key terms, Step &amp; Tradition phrases (such as{' '}
            <em>Twelve Steps</em>, <em>Higher Power</em>, and{' '}
            <em>First Step</em>), and character traits highlight directly as
            complete expressions with full Bahasa Malaysia &amp; English
            meanings.
          </p>
        </div>
      );
    }

    return (
      <div
        className={
          isMobileSheet
            ? 'p-5 pb-8'
            : 'rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto'
        }
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--paper-border)] pb-3.5">
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              {inspectedEntry
                ? `${formatPosEn(inspectedEntry.partOfSpeech)} · ${formatCategoryEn(inspectedEntry.category)}`
                : 'Tapped Term in Context'}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight text-[var(--ink-primary)]">
              {inspectedEntry ? inspectedEntry.term : inspectedQuery}
            </h3>
            {inspectedEntry && (
              <p className="mt-0.5 text-base font-medium text-[var(--accent-lapis)]">
                {inspectedEntry.malayTerm}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setInspectedQuery(null);
              setInspectedEntry(null);
            }}
            aria-label="Close word inspector"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {inspectedEntry ? (
          <div className="mt-4 space-y-4">
            {inspectedEntry.source === 'ai-lookup' && !aiSavedNotice && (
              <button
                type="button"
                onClick={() => handleSaveAiEntry(inspectedEntry)}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-[var(--accent-forest)] bg-[var(--accent-forest)] px-3 py-1.5 text-xs font-medium text-[#fbf9f5] whitespace-nowrap"
              >
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span>Add to Local Dictionary</span>
              </button>
            )}

            {aiSavedNotice && (
              <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-forest)]">
                Added to dictionary
              </p>
            )}

            {/* Bahasa Malaysia Definition */}
            <div className="rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] p-3.5">
              <h4 className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-wider text-[var(--accent-lapis)]">
                Definisi Bahasa Malaysia
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-primary)]">
                {inspectedEntry.definitionMs}
              </p>
            </div>

            {/* English Definition */}
            <div>
              <h4 className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                English Definition
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-[var(--ink-secondary)]">
                {inspectedEntry.definitionEn}
              </p>
            </div>

            {/* Highlighted Verbatim Quote from PDF */}
            {inspectedEntry.excerpts.length > 0 && (
              <HighlightedQuoteBlock
                excerpts={inspectedEntry.excerpts}
                highlightTerm={inspectedQuery}
                onOpenPdfPage={onOpenPdfPage}
                compact
              />
            )}

            {/* Context Note in Book (English only) */}
            <ContextNoteBlock entry={inspectedEntry} compact />

            {/* All PDF Page Occurrences Grid */}
            <PageOccurrencesGrid
              term={inspectedEntry.term}
              fallbackPdfPages={inspectedEntry.pdfPages}
              fallbackBookPages={inspectedEntry.bookPages}
              onOpenPdfPage={onOpenPdfPage}
              defaultTrackFilter={track}
              compact
            />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
              &ldquo;{inspectedQuery}&rdquo; does not have a dedicated curated
              entry yet. Generate an English &amp; Bahasa Malaysia meaning from
              the PDF or inspect every page where it appears below.
            </p>

            {aiLookupError && (
              <p className="rounded border border-red-300 bg-red-50 p-3 text-xs text-red-900">
                {aiLookupError}
              </p>
            )}

            <button
              type="button"
              onClick={handleAnalyzeTappedWord}
              disabled={aiLookingUp}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-[var(--accent-lapis)] bg-[var(--accent-lapis)] px-4 py-2.5 text-sm font-semibold text-[#fbf9f5] hover:bg-[var(--accent-lapis-hover)] disabled:opacity-60"
            >
              {aiLookingUp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>
                {aiLookingUp
                  ? 'Looking up bilingual meaning...'
                  : 'Generate Bilingual Meaning (EN & BM)'}
              </span>
            </button>

            <PageOccurrencesGrid
              term={inspectedQuery}
              onOpenPdfPage={onOpenPdfPage}
              defaultTrackFilter={track}
              compact
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Focused Track Header */}
      <div className="border-b border-[var(--paper-border)] pb-5">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          {track === 'steps'
            ? 'Book One · Focused Step Study'
            : 'Book Two · Focused Tradition Study'}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
          {track === 'steps' ? 'The Twelve Steps' : 'The Twelve Traditions'}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--ink-secondary)]">
          {track === 'steps'
            ? 'Read each Step deeply one at a time. Tap any underlined phrase or word in the text to read its Bahasa Malaysia explanation, English meaning, impactful verbatim PDF quote, and page occurrences.'
            : 'Focus exclusively on the Twelve Traditions. Read each Tradition interactively, inspect key recovery phrases and principles, and jump directly into the PDF.'}
        </p>
      </div>

      {/* Horizontal Chapter Progression Selector */}
      <div
        aria-label={
          track === 'steps' ? 'Select Step chapter' : 'Select Tradition chapter'
        }
        className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar"
      >
        {chapters.map((chapter, idx) => {
          const isSelected = chapter.id === activeChapter.id;
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => {
                setSelectedChapterId(chapter.id);
                setInspectedQuery(null);
                setInspectedEntry(null);
                setVocabFilter('');
              }}
              className={`inline-flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-md border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                isSelected
                  ? 'border-[var(--accent-lapis)] bg-[var(--accent-lapis)] text-[#fbf9f5]'
                  : 'border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)] hover:border-[var(--accent-lapis)]'
              }`}
            >
              <span>
                {track === 'steps'
                  ? getShortChipNumber(chapter, idx)
                  : shortSelectorLabel(chapter)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Chapter Study Bar */}
      <section className="mt-4 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--paper-border)] pb-4 lg:flex-row lg:items-end">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)] tabular-nums">
              {activeChapter.group} · Book pp. {activeChapter.bookRange} · PDF{' '}
              {activeChapter.startPdfPage}–{activeChapter.endPdfPage}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              {activeChapter.titleEn}
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-secondary)]">
              {activeChapter.subtitleEn}
            </p>
          </div>

          <div className="inline-flex self-start rounded-md border border-[var(--paper-border)] bg-[var(--paper-surface)] p-0.5 lg:self-auto">
            <button
              type="button"
              onClick={() => setSubView('reader')}
              className={`min-h-[38px] rounded px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                subView === 'reader'
                  ? 'bg-[var(--paper-card)] font-semibold text-[var(--accent-lapis)] shadow-xs'
                  : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
              }`}
            >
              Interactive Reader
            </button>
            <button
              type="button"
              onClick={() => setSubView('vocabulary')}
              className={`min-h-[38px] rounded px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                subView === 'vocabulary'
                  ? 'bg-[var(--paper-card)] font-semibold text-[var(--accent-lapis)] shadow-xs'
                  : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
              }`}
            >
              Vocabulary ({chapterEntries.length})
            </button>
          </div>
        </div>

        {/* Sub-view 1: Interactive Reader with Phrase & Word Tap-to-Define */}
        {subView === 'reader' && (
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-md border border-[var(--paper-border)] bg-[var(--paper-surface)]/70 px-3.5 py-2.5 text-xs text-[var(--ink-secondary)]">
                <span>
                  Tap any{' '}
                  <span className="underline decoration-[var(--accent-lapis)]/65 underline-offset-4">
                    underlined phrase or word
                  </span>{' '}
                  (such as <em>First Step</em>, <em>Twelve Steps</em>, or{' '}
                  <em>closed-mindedness</em>) to read its Bahasa Malaysia
                  explanation &amp; PDF quote.
                </span>
              </div>

              {pagesLoading ? (
                <div className="flex items-center gap-2.5 py-12 text-sm text-[var(--ink-muted)]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading {activeChapter.titleEn} pages...</span>
                </div>
              ) : pagesError ? (
                <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-900">
                  {pagesError}
                </div>
              ) : (
                <div className="space-y-6">
                  {chapterPages.map((page) => {
                    const segments = tokenizeTextWithPhrases(
                      page.text,
                      wordAndPhraseLookup,
                    );
                    return (
                      <article
                        key={page.pdfPage}
                        className="rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] p-5 sm:p-6"
                      >
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--paper-border)] pb-2.5">
                          <span className="tabular-nums font-[family-name:var(--font-mono)] text-xs font-medium text-[var(--ink-muted)]">
                            Book Page {page.bookPage} · PDF {page.pdfPage}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenPdfPage(
                                page.pdfPage,
                                inspectedQuery ?? undefined,
                              )
                            }
                            className="inline-flex min-h-[32px] items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--accent-lapis)] hover:underline whitespace-nowrap"
                          >
                            <BookOpenText className="h-3.5 w-3.5 shrink-0" />
                            <span>View Original PDF</span>
                          </button>
                        </div>

                        <p className="max-w-prose text-base leading-[1.85] text-[var(--ink-primary)] sm:text-[17px]">
                          {segments.map((seg, idx) => {
                            if (seg.kind === 'space' || seg.kind === 'plain') {
                              return <Fragment key={idx}>{seg.text}</Fragment>;
                            }

                            const isInspected =
                              inspectedQuery?.toLowerCase() ===
                              seg.query.toLowerCase();

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() =>
                                  handleTapSegment(seg.query, seg.entry)
                                }
                                title={
                                  seg.entry
                                    ? `${seg.entry.term} — ${seg.entry.malayTerm}`
                                    : `Tap to look up "${seg.query}"`
                                }
                                className={`inline rounded-sm px-[1px] text-left transition-colors ${
                                  isInspected
                                    ? 'bg-[var(--accent-lapis)] text-[#fbf9f5]'
                                    : seg.kind === 'phrase'
                                      ? 'font-medium underline decoration-[var(--accent-lapis)] decoration-[1.5px] underline-offset-[5px] hover:bg-[var(--accent-lapis)]/12 hover:text-[var(--accent-lapis)]'
                                      : seg.entry
                                        ? 'underline decoration-[var(--accent-lapis)]/45 decoration-1 underline-offset-[5px] hover:bg-[var(--accent-lapis)]/12 hover:text-[var(--accent-lapis)]'
                                        : 'hover:bg-[var(--paper-surface)] hover:text-[var(--accent-lapis)]'
                                }`}
                              >
                                {seg.text}
                              </button>
                            );
                          })}
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Desktop Margin Word & Phrase Study Inspector */}
            <aside className="hidden lg:col-span-5 lg:block">
              {renderInspectorContent(false)}
            </aside>
          </div>
        )}

        {/* Sub-view 2: Chapter Key Vocabulary */}
        {subView === 'vocabulary' && (
          <div className="mt-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input
                type="text"
                value={vocabFilter}
                onChange={(e) => setVocabFilter(e.target.value)}
                placeholder={`Filter vocabulary & phrases in ${activeChapter.titleEn}...`}
                aria-label="Filter chapter vocabulary"
                className="min-h-[44px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] py-2 pl-9 pr-3 text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:border-[var(--accent-lapis)] focus:outline-none"
              />
            </div>

            {chapterEntries.length === 0 ? (
              <div className="mt-5 rounded border border-[var(--paper-border)] bg-[var(--paper-bg)] p-8 text-center">
                <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink-primary)]">
                  No matching vocabulary in this filter
                </p>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">
                  Switch back to{' '}
                  <button
                    type="button"
                    onClick={() => setSubView('reader')}
                    className="font-semibold text-[var(--accent-lapis)] hover:underline"
                  >
                    Interactive Reader
                  </button>{' '}
                  to read the chapter text and tap any word or phrase.
                </p>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-[var(--paper-border)]">
                {chapterEntries.slice(0, vocabLimit).map((entry) => (
                  <article key={entry.id} className="py-6 first:pt-2 last:pb-2">
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--ink-primary)]">
                        {entry.term}
                      </h3>
                      <p className="text-base font-medium text-[var(--accent-lapis)]">
                        {entry.malayTerm}
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)]">
                        {formatPosEn(entry.partOfSpeech)} ·{' '}
                        {formatCategoryEn(entry.category)}
                      </p>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--accent-lapis)]">
                          Definisi Bahasa Malaysia
                        </span>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--ink-primary)]">
                          {entry.definitionMs}
                        </p>
                      </div>
                      <div>
                        <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                          English Definition
                        </span>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--ink-secondary)]">
                          {entry.definitionEn}
                        </p>
                      </div>
                    </div>

                    {entry.excerpts.length > 0 && (
                      <div className="mt-4">
                        <HighlightedQuoteBlock
                          excerpts={entry.excerpts}
                          highlightTerm={entry.term}
                          onOpenPdfPage={onOpenPdfPage}
                          compact
                        />
                      </div>
                    )}

                    <div className="mt-4">
                      <ContextNoteBlock entry={entry} compact />
                    </div>

                    <div className="mt-4">
                      <PageOccurrencesGrid
                        term={entry.term}
                        fallbackPdfPages={entry.pdfPages}
                        fallbackBookPages={entry.bookPages}
                        onOpenPdfPage={onOpenPdfPage}
                        defaultTrackFilter={track}
                        compact
                      />
                    </div>
                  </article>
                ))}
                {chapterEntries.length > vocabLimit && (
                  <div className="pt-5 text-center">
                    <button
                      type="button"
                      onClick={() => setVocabLimit((prev) => prev + 60)}
                      className="min-h-[44px] rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-4 py-2 font-[family-name:var(--font-mono)] text-xs font-medium text-[var(--accent-lapis)] hover:border-[var(--accent-lapis)]"
                    >
                      Load more ({chapterEntries.length - vocabLimit} remaining)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Prev / Next Chapter Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--paper-border)] pt-5">
          {prevChapter ? (
            <button
              type="button"
              onClick={() => {
                setSelectedChapterId(prevChapter.id);
                setInspectedQuery(null);
                setInspectedEntry(null);
                setVocabFilter('');
              }}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3.5 py-2 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)] whitespace-nowrap"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>{prevChapter.titleEn}</span>
            </button>
          ) : (
            <span />
          )}

          {nextChapter && (
            <button
              type="button"
              onClick={() => {
                setSelectedChapterId(nextChapter.id);
                setInspectedQuery(null);
                setInspectedEntry(null);
                setVocabFilter('');
              }}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3.5 py-2 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)] whitespace-nowrap"
            >
              <span>{nextChapter.titleEn}</span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </button>
          )}
        </div>
      </section>

      {/* Mobile Bottom Sheet for Word & Phrase Study Inspector (< lg) */}
      {subView === 'reader' && inspectedQuery && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-[#1c1917]/40 backdrop-blur-[1px] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={`Word inspector for ${inspectedQuery}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setInspectedQuery(null);
              setInspectedEntry(null);
            }
          }}
        >
          <div className="max-h-[84vh] w-full overflow-y-auto rounded-t-2xl border-t border-[var(--paper-border)] bg-[var(--paper-card)] shadow-2xl">
            <div className="sticky top-0 z-10 flex justify-center bg-[var(--paper-card)] pt-2.5 pb-1">
              <span
                aria-hidden="true"
                className="h-1 w-10 rounded-full bg-[var(--paper-border)]"
              />
            </div>
            {renderInspectorContent(true)}
          </div>
        </div>
      )}
    </div>
  );
}
