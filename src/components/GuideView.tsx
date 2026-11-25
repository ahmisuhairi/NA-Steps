import { ArrowRight, Download, Loader2, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getFreshIdToken } from '../lib/auth';
import type { ActiveTab } from '../types/dictionary';

interface GuideStep {
  number: string;
  title: string;
  body: string;
}

interface GuideViewProps {
  onDownloadCsv: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  isOwner: boolean;
  ownerEmail: string | null;
}

export function GuideView({
  onDownloadCsv,
  onNavigateTab,
  isOwner,
  ownerEmail,
}: GuideViewProps) {
  const [steps, setSteps] = useState<GuideStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGuide = useCallback(async () => {
    if (!isOwner) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getFreshIdToken();
      if (!token) {
        throw new Error('Authentication session not available.');
      }
      const res = await fetch('/api/owner/guide', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = (await res.json()) as {
        steps?: GuideStep[];
        error?: string;
      };
      if (!res.ok || !Array.isArray(data.steps)) {
        throw new Error(data.error || 'Unable to load Setup Guide.');
      }
      setSteps(data.steps);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load Setup Guide.',
      );
    } finally {
      setLoading(false);
    }
  }, [isOwner]);

  useEffect(() => {
    void loadGuide();
  }, [loadGuide]);

  if (!isOwner) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="border-b border-[var(--paper-border)] pb-5">
        <p className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--accent-forest)]">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          <span>Owner Setup Manual ({ownerEmail})</span>
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
          Google Apps Script Setup Guide
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
          Follow these six steps to run the HTML Service dictionary web app and
          PDF URL text extractor inside Google Workspace with zero external
          hosting.
        </p>
      </div>

      {loading ? (
        <div className="mt-6 flex items-center gap-2.5 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-6 text-sm text-[var(--ink-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Verifying owner session &amp; loading Setup Guide...</span>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-5 text-sm text-red-900">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void loadGuide()}
            className="mt-3 min-h-[40px] rounded-md border border-red-400 bg-white px-4 py-1.5 text-xs font-semibold text-red-900 hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-[var(--paper-border)] rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)]">
          {steps.map((step) => (
            <section key={step.number} className="p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
                <span className="tabular-nums shrink-0 font-[family-name:var(--font-mono)] text-xs font-semibold tracking-widest text-[var(--accent-lapis)]">
                  STEP {step.number}
                </span>
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--ink-primary)]">
                    {step.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-secondary)]">
                    {step.body}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-surface)]/80 p-5">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--ink-primary)]">
            Ready to deploy?
          </h3>
          <p className="text-sm text-[var(--ink-secondary)]">
            Download the CSV dataset or open GAS Script to copy your code.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onDownloadCsv}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-md border border-[var(--paper-border)] bg-[var(--paper-card)] px-4 py-2 text-sm font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)] whitespace-nowrap"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>Download CSV</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('gas')}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-md border border-[var(--accent-lapis)] bg-[var(--accent-lapis)] px-4 py-2 text-sm font-semibold text-[#fbf9f5] hover:bg-[var(--accent-lapis-hover)] whitespace-nowrap"
          >
            <span>Open GAS Script</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
