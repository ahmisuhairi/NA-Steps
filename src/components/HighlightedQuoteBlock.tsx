import { BookOpenText } from 'lucide-react';
import type { PdfExcerpt } from '../types/dictionary';

interface HighlightedQuoteBlockProps {
  excerpts: PdfExcerpt[];
  highlightTerm: string;
  onOpenPdfPage: (pdfPage: number, highlightQuery?: string) => void;
  compact?: boolean;
}

export function HighlightedQuoteBlock({
  excerpts,
  highlightTerm,
  onOpenPdfPage,
  compact = false,
}: HighlightedQuoteBlockProps) {
  if (!excerpts || excerpts.length === 0) return null;

  const [featured, ...additional] = excerpts;

  return (
    <section
      className={`rounded-md border border-[var(--accent-lapis)]/25 bg-[var(--paper-surface)] ${
        compact ? 'p-3.5' : 'p-5'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-wider text-[var(--accent-lapis)]">
          Verbatim Quote from PDF
        </h3>
        <button
          type="button"
          onClick={() => onOpenPdfPage(featured.pdfPage, highlightTerm)}
          className="inline-flex min-h-[32px] items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--accent-lapis)] hover:underline whitespace-nowrap"
        >
          <BookOpenText className="h-3.5 w-3.5 shrink-0" />
          <span>
            {featured.section} · p. {featured.bookPage} (PDF {featured.pdfPage})
          </span>
        </button>
      </div>

      <blockquote
        className={`mt-2.5 font-[family-name:var(--font-display)] italic leading-relaxed text-[var(--ink-primary)] ${
          compact ? 'text-lg' : 'text-xl sm:text-[22px]'
        }`}
      >
        “{featured.quote}”
      </blockquote>

      {additional.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-[var(--paper-border)] pt-3">
          {additional.map((ex, idx) => (
            <div key={`${ex.pdfPage}-${idx}`} className="text-sm">
              <blockquote className="italic leading-relaxed text-[var(--ink-secondary)]">
                “{ex.quote}”
              </blockquote>
              <button
                type="button"
                onClick={() => onOpenPdfPage(ex.pdfPage, highlightTerm)}
                className="mt-1 inline-flex min-h-[28px] items-center font-[family-name:var(--font-mono)] text-[11px] text-[var(--accent-lapis)] hover:underline"
              >
                {ex.section} · Book p. {ex.bookPage} · PDF p. {ex.pdfPage} →
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
