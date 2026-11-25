import { BookOpenText, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { PdfPageOccurrence } from '../types/dictionary';
import { normalizeHeadwordForPdfSearch } from '../utils/lexiconHelpers';

interface PageOccurrencesGridProps {
  term: string;
  fallbackPdfPages?: number[];
  fallbackBookPages?: string[];
  onOpenPdfPage: (pdfPage: number, highlightQuery?: string) => void;
  defaultTrackFilter?: 'all' | 'steps' | 'traditions';
  compact?: boolean;
}

const occurrenceCache = new Map<
  string,
  { totalPages: number; totalMatches: number; occurrences: PdfPageOccurrence[] }
>();

type TrackFilter = 'all' | 'steps' | 'traditions';

export function PageOccurrencesGrid({
  term,
  fallbackPdfPages = [],
  fallbackBookPages = [],
  onOpenPdfPage,
  defaultTrackFilter = 'all',
  compact = false,
}: PageOccurrencesGridProps) {
  const searchQuery = useMemo(() => normalizeHeadwordForPdfSearch(term), [term]);
  const [occurrences, setOccurrences] = useState<PdfPageOccurrence[]>(() => {
    const cached = occurrenceCache.get(searchQuery.toLowerCase());
    return cached?.occurrences ?? [];
  });
  const [totalMatches, setTotalMatches] = useState<number>(() => {
    const cached = occurrenceCache.get(searchQuery.toLowerCase());
    return cached?.totalMatches ?? 0;
  });
  const [loading, setLoading] = useState(false);
  const [trackFilter, setTrackFilter] = useState<TrackFilter>(defaultTrackFilter);

  useEffect(() => {
    setTrackFilter(defaultTrackFilter);
  }, [searchQuery, defaultTrackFilter]);

  useEffect(() => {
    const key = searchQuery.toLowerCase();
    if (!key) {
      setOccurrences([]);
      setTotalMatches(0);
      return;
    }

    const cached = occurrenceCache.get(key);
    if (cached) {
      setOccurrences(cached.occurrences);
      setTotalMatches(cached.totalMatches);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/pdf/occurrences?q=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data.occurrences)
          ? (data.occurrences as PdfPageOccurrence[])
          : [];
        const matches = Number(data.totalMatches || 0);
        occurrenceCache.set(key, {
          totalPages: list.length,
          totalMatches: matches,
          occurrences: list,
        });
        setOccurrences(list);
        setTotalMatches(matches);
      })
      .catch(() => {
        if (!cancelled) {
          setOccurrences([]);
          setTotalMatches(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  const effectiveOccurrences = useMemo<PdfPageOccurrence[]>(() => {
    if (occurrences.length > 0) return occurrences;
    return fallbackPdfPages.map((pdfPage, idx) => ({
      pdfPage,
      bookPage: fallbackBookPages[idx] || String(pdfPage),
      section:
        pdfPage <= 94
          ? 'Twelve Steps'
          : pdfPage <= 163
            ? 'Twelve Traditions'
            : 'Index',
      matchCount: 1,
      track:
        pdfPage <= 7
          ? 'intro'
          : pdfPage <= 94
            ? 'steps'
            : pdfPage <= 163
              ? 'traditions'
              : 'index',
    }));
  }, [occurrences, fallbackPdfPages, fallbackBookPages]);

  const stepsCount = useMemo(
    () => effectiveOccurrences.filter((o) => o.track === 'steps').length,
    [effectiveOccurrences],
  );
  const traditionsCount = useMemo(
    () => effectiveOccurrences.filter((o) => o.track === 'traditions').length,
    [effectiveOccurrences],
  );

  const visibleOccurrences = useMemo(() => {
    if (trackFilter === 'all') return effectiveOccurrences;
    const filtered = effectiveOccurrences.filter((o) => o.track === trackFilter);
    return filtered.length > 0 ? filtered : effectiveOccurrences;
  }, [effectiveOccurrences, trackFilter]);

  if (!loading && effectiveOccurrences.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[var(--paper-border)] pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-wider text-[var(--ink-muted)]">
            All PDF &amp; Book Page Occurrences
          </h3>
          <p className="mt-0.5 tabular-nums font-[family-name:var(--font-mono)] text-xs text-[var(--ink-secondary)]">
            {loading ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Scanning all 167 PDF pages...</span>
              </span>
            ) : (
              <span>
                Found on {effectiveOccurrences.length}{' '}
                {effectiveOccurrences.length === 1 ? 'page' : 'pages'}
                {totalMatches > 0 ? ` · ${totalMatches} total matches` : ''}
              </span>
            )}
          </p>
        </div>

        {(stepsCount > 0 || traditionsCount > 0) &&
          stepsCount !== effectiveOccurrences.length &&
          traditionsCount !== effectiveOccurrences.length && (
            <div className="inline-flex items-center gap-1 rounded-md border border-[var(--paper-border)] bg-[var(--paper-surface)] p-0.5">
              <button
                type="button"
                onClick={() => setTrackFilter('all')}
                className={`min-h-[28px] rounded px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11px] transition-colors whitespace-nowrap ${
                  trackFilter === 'all'
                    ? 'bg-[var(--paper-card)] font-semibold text-[var(--accent-lapis)] shadow-xs'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                All ({effectiveOccurrences.length})
              </button>
              {stepsCount > 0 && (
                <button
                  type="button"
                  onClick={() => setTrackFilter('steps')}
                  className={`min-h-[28px] rounded px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11px] transition-colors whitespace-nowrap ${
                    trackFilter === 'steps'
                      ? 'bg-[var(--paper-card)] font-semibold text-[var(--accent-lapis)] shadow-xs'
                      : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                  }`}
                >
                  Steps ({stepsCount})
                </button>
              )}
              {traditionsCount > 0 && (
                <button
                  type="button"
                  onClick={() => setTrackFilter('traditions')}
                  className={`min-h-[28px] rounded px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11px] transition-colors whitespace-nowrap ${
                    trackFilter === 'traditions'
                      ? 'bg-[var(--paper-card)] font-semibold text-[var(--accent-lapis)] shadow-xs'
                      : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                  }`}
                >
                  Traditions ({traditionsCount})
                </button>
              )}
            </div>
          )}
      </div>

      <div
        className={`mt-3 grid gap-2 ${
          compact
            ? 'grid-cols-3 sm:grid-cols-4'
            : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
        }`}
      >
        {visibleOccurrences.map((occ) => (
          <button
            key={`${searchQuery}-occ-${occ.pdfPage}`}
            type="button"
            title={`${occ.section} · Book p. ${occ.bookPage} · PDF p. ${occ.pdfPage} (${occ.matchCount}×)`}
            onClick={() => onOpenPdfPage(occ.pdfPage, searchQuery)}
            className="group flex min-h-[44px] flex-col items-start justify-center rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-2.5 py-1.5 text-left transition-colors hover:border-[var(--accent-lapis)] hover:bg-[var(--paper-surface)]"
          >
            <span className="flex w-full items-center justify-between gap-1 font-[family-name:var(--font-mono)] text-xs font-semibold text-[var(--accent-lapis)] tabular-nums">
              <span className="truncate">p. {occ.bookPage}</span>
              <BookOpenText className="h-3 w-3 shrink-0 opacity-70 group-hover:opacity-100" />
            </span>
            <span className="mt-0.5 block w-full truncate font-[family-name:var(--font-mono)] text-[10px] text-[var(--ink-muted)] tabular-nums">
              PDF {occ.pdfPage}
              {occ.matchCount > 1 ? ` · ${occ.matchCount}×` : ''}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
