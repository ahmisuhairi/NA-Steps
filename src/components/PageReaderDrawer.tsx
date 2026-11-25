import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  X,
} from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import type { PdfPageRecord } from '../types/dictionary';

interface PageReaderDrawerProps {
  pdfPage: number | null;
  highlightQuery?: string;
  onClose: () => void;
  onChangePage: (nextPage: number) => void;
}

function highlightPageText(text: string, query?: string) {
  const clean = query?.trim();
  if (!clean) return text;
  const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.split(regex).map((part, idx) =>
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

export function PageReaderDrawer({
  pdfPage,
  highlightQuery,
  onClose,
  onChangePage,
}: PageReaderDrawerProps) {
  const [record, setRecord] = useState<PdfPageRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'text' | 'pdf'>('text');

  useEffect(() => {
    if (pdfPage === null) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/pdf/page/${pdfPage}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'PDF page not found.');
        }
        return data as PdfPageRecord;
      })
      .then((data) => {
        if (!cancelled) setRecord(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load PDF page.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pdfPage]);

  if (pdfPage === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1c1917]/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label={`PDF Page Reader ${pdfPage}`}
    >
      <div className="flex h-full w-full max-w-2xl flex-col border-l border-[var(--paper-border)] bg-[var(--paper-bg)] shadow-2xl">
        {/* Drawer Header */}
        <header className="flex items-center justify-between gap-4 border-b border-[var(--paper-border)] bg-[var(--paper-card)] px-5 py-4">
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--ink-muted)] tabular-nums">
              {record
                ? `${record.section} · Book p. ${record.bookPage} · PDF ${record.pdfPage}/167`
                : `PDF Page ${pdfPage} / 167`}
            </p>
            <h2 className="mt-0.5 truncate font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--ink-primary)]">
              Full Page Reader
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close page reader"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Sub-Toolbar: Mode Switch + Page Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--paper-border)] bg-[var(--paper-surface)] px-5 py-2.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode('text')}
              className={`min-h-[34px] rounded px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === 'text'
                  ? 'bg-[var(--accent-lapis)] text-[#fbf9f5]'
                  : 'text-[var(--ink-secondary)] hover:bg-[var(--paper-card)]'
              }`}
            >
              Extracted Text
            </button>
            <button
              type="button"
              onClick={() => setViewMode('pdf')}
              className={`inline-flex min-h-[34px] items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === 'pdf'
                  ? 'bg-[var(--accent-lapis)] text-[#fbf9f5]'
                  : 'text-[var(--ink-secondary)] hover:bg-[var(--paper-card)]'
              }`}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span>Original PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pdfPage <= 1}
              onClick={() => onChangePage(pdfPage - 1)}
              className="inline-flex min-h-[34px] items-center gap-1 rounded border border-[var(--paper-border)] bg-[var(--paper-card)] px-2.5 py-1 text-xs font-medium text-[var(--ink-primary)] disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <span className="tabular-nums font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)]">
              {pdfPage} / 167
            </span>
            <button
              type="button"
              disabled={pdfPage >= 167}
              onClick={() => onChangePage(pdfPage + 1)}
              className="inline-flex min-h-[34px] items-center gap-1 rounded border border-[var(--paper-border)] bg-[var(--paper-card)] px-2.5 py-1 text-xs font-medium text-[var(--ink-primary)] disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'pdf' ? (
            <iframe
              key={pdfPage}
              src={`/assets/aistudio/h_w_48c140b4.pdf#page=${pdfPage}`}
              title={`PDF Page ${pdfPage}`}
              className="h-full min-h-[540px] w-full rounded border border-[var(--paper-border)] bg-white"
            />
          ) : loading ? (
            <div className="flex items-center gap-2.5 py-12 text-sm text-[var(--ink-muted)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading page {pdfPage}...</span>
            </div>
          ) : error ? (
            <p className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-900">
              {error}
            </p>
          ) : record ? (
            <div className="rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-6">
              <p className="whitespace-pre-wrap text-base leading-[1.8] text-[var(--ink-primary)]">
                {highlightPageText(record.text, highlightQuery)}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
