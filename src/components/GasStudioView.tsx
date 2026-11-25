import {
  Check,
  Copy,
  Download,
  FileCode2,
  FileSpreadsheet,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DictionaryEntry, GasConfigOptions } from '../types/dictionary';
import {
  generateCodeGs,
  generateCssHtml,
  generateIndexHtml,
  generateJavaScriptHtml,
} from '../utils/gasGenerator';

interface GasStudioViewProps {
  entries: DictionaryEntry[];
  onDownloadCsv: () => void;
  onDownloadXlsx: () => void;
  xlsxBusy?: boolean;
  isOwner: boolean;
  ownerEmail: string | null;
}

type ScriptFileTab = 'code' | 'index' | 'css' | 'javascript';

function triggerTextDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function copyTextSafely(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to textarea selection copy below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function GasStudioView({
  entries,
  onDownloadCsv,
  onDownloadXlsx,
  xlsxBusy = false,
  isOwner,
  ownerEmail,
}: GasStudioViewProps) {
  const [options, setOptions] = useState<GasConfigOptions>({
    includeSeedData: true,
    includeGeminiLookup: true,
    includeDrivePdfImporter: true,
    webAppAccess: 'ANYONE_ANONYMOUS',
  });
  const [activeFile, setActiveFile] = useState<ScriptFileTab>('code');
  const [copied, setCopied] = useState(false);

  const codeGs = useMemo(
    () => (isOwner ? generateCodeGs(entries, options) : ''),
    [entries, options, isOwner],
  );
  const indexHtml = useMemo(
    () => (isOwner ? generateIndexHtml(options) : ''),
    [options, isOwner],
  );
  const cssHtml = useMemo(
    () => (isOwner ? generateCssHtml() : ''),
    [isOwner],
  );
  const javaScriptHtml = useMemo(
    () => (isOwner ? generateJavaScriptHtml(options) : ''),
    [options, isOwner],
  );

  if (!isOwner) {
    return null;
  }

  const activeContent =
    activeFile === 'code'
      ? codeGs
      : activeFile === 'index'
        ? indexHtml
        : activeFile === 'css'
          ? cssHtml
          : javaScriptHtml;

  const activeFilename =
    activeFile === 'code'
      ? 'Code.gs'
      : activeFile === 'index'
        ? 'Index.html'
        : activeFile === 'css'
          ? 'css.html'
          : 'JavaScript.html';

  const handleCopy = async () => {
    const ok = await copyTextSafely(activeContent);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--paper-border)] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--accent-forest)]">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>
              Owner Workspace ({ownerEmail}) · Google Apps Script (V8)
            </span>
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
            Google Apps Script &amp; HTML Service Studio
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--ink-secondary)]">
            Copy &amp; paste ready-to-run{' '}
            <code className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-lapis)]">
              Code.gs
            </code>
            ,{' '}
            <code className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-lapis)]">
              Index.html
            </code>
            ,{' '}
            <code className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-lapis)]">
              css.html
            </code>
            , and{' '}
            <code className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-lapis)]">
              JavaScript.html
            </code>{' '}
            including modular HTML Service UI templates (via{' '}
            <code className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-lapis)]">
              include()
            </code>
            ) and{' '}
            <code className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-lapis)]">
              extractTextFromPdfUrl(pdfUrl)
            </code>{' '}
            using Google Drive &amp; Google Docs API.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={onDownloadXlsx}
            disabled={xlsxBusy}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-md border border-[var(--accent-forest)] bg-[var(--accent-forest)] px-4 py-2 text-sm font-semibold text-[#fbf9f5] transition-colors hover:opacity-95 disabled:opacity-60 whitespace-nowrap"
          >
            {xlsxBusy ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 shrink-0" />
            )}
            <span>
              {xlsxBusy
                ? 'Generating XLSX...'
                : `Download XLSX Database (${entries.length})`}
            </span>
          </button>

          <button
            type="button"
            onClick={onDownloadCsv}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-md border border-[var(--paper-border)] bg-[var(--paper-card)] px-4 py-2 text-sm font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)] hover:text-[var(--accent-lapis)] whitespace-nowrap"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Config Panel */}
        <aside className="space-y-5 lg:col-span-4">
          <div className="rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--ink-primary)]">
              Script Configuration
            </h2>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Changes update <code>Code.gs</code>, <code>Index.html</code>,{' '}
              <code>css.html</code>, and <code>JavaScript.html</code> in real
              time.
            </p>

            <div className="mt-4 space-y-3.5 border-t border-[var(--paper-border)] pt-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={options.includeSeedData}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      includeSeedData: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-[var(--paper-border)] accent-[var(--accent-lapis)]"
                />
                <span className="text-sm">
                  <span className="block font-medium text-[var(--ink-primary)]">
                    Include seedDictionaryData()
                  </span>
                  <span className="block text-xs text-[var(--ink-muted)]">
                    Populates all {entries.length} bilingual entries into your
                    Google Sheet in one click.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={options.includeDrivePdfImporter}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      includeDrivePdfImporter: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-[var(--paper-border)] accent-[var(--accent-lapis)]"
                />
                <span className="text-sm">
                  <span className="block font-medium text-[var(--ink-primary)]">
                    PDF URL Extractor UI (Google Docs API)
                  </span>
                  <span className="block text-xs text-[var(--ink-muted)]">
                    Adds the PDF extractor card to <code>Index.html</code> and{' '}
                    <code>JavaScript.html</code> alongside{' '}
                    <code>extractTextFromPdfUrl(pdfUrl)</code>.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={options.includeGeminiLookup}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      includeGeminiLookup: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-[var(--paper-border)] accent-[var(--accent-lapis)]"
                />
                <span className="text-sm">
                  <span className="block font-medium text-[var(--ink-primary)]">
                    AI Lookup via Script Properties
                  </span>
                  <span className="block text-xs text-[var(--ink-muted)]">
                    Includes <code>lookupTermWithGemini()</code> reading{' '}
                    <code>GEMINI_API_KEY</code> from{' '}
                    <em>Script Properties</em> (no hardcoded key).
                  </span>
                </span>
              </label>

              <div className="border-t border-[var(--paper-border)] pt-3">
                <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--ink-muted)]">
                  Apps Script File Names
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-secondary)]">
                  Create <code>Index</code>, <code>css</code>, and{' '}
                  <code>JavaScript</code> as HTML files in Apps Script so{' '}
                  <code>&lt;?!= include(&apos;css&apos;); ?&gt;</code> and{' '}
                  <code>&lt;?!= include(&apos;JavaScript&apos;); ?&gt;</code>{' '}
                  resolve cleanly. Set Web App access under{' '}
                  <strong>Deploy &gt; New deployment &gt; Web app</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Download Individual Files */}
          <div className="rounded-lg border border-[var(--paper-border)] bg-[var(--paper-surface)]/75 p-5">
            <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--ink-muted)]">
              Download GAS Project Files
            </h3>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() =>
                  triggerTextDownload('Code.gs', codeGs, 'text/javascript')
                }
                className="flex min-h-[40px] w-full items-center justify-between rounded-md border border-[var(--paper-border)] bg-[var(--paper-card)] px-3.5 py-2 text-sm font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)]"
              >
                <span className="font-[family-name:var(--font-mono)] text-xs">
                  Code.gs
                </span>
                <Download className="h-3.5 w-3.5 text-[var(--accent-lapis)]" />
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerTextDownload('Index.html', indexHtml, 'text/html')
                }
                className="flex min-h-[40px] w-full items-center justify-between rounded-md border border-[var(--paper-border)] bg-[var(--paper-card)] px-3.5 py-2 text-sm font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)]"
              >
                <span className="font-[family-name:var(--font-mono)] text-xs">
                  Index.html
                </span>
                <Download className="h-3.5 w-3.5 text-[var(--accent-lapis)]" />
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerTextDownload(
                    'css.html',
                    cssHtml,
                    'text/html',
                  )
                }
                className="flex min-h-[40px] w-full items-center justify-between rounded-md border border-[var(--paper-border)] bg-[var(--paper-card)] px-3.5 py-2 text-sm font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)]"
              >
                <span className="font-[family-name:var(--font-mono)] text-xs">
                  css.html
                </span>
                <Download className="h-3.5 w-3.5 text-[var(--accent-lapis)]" />
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerTextDownload(
                    'JavaScript.html',
                    javaScriptHtml,
                    'text/html',
                  )
                }
                className="flex min-h-[40px] w-full items-center justify-between rounded-md border border-[var(--paper-border)] bg-[var(--paper-card)] px-3.5 py-2 text-sm font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)]"
              >
                <span className="font-[family-name:var(--font-mono)] text-xs">
                  JavaScript.html
                </span>
                <Download className="h-3.5 w-3.5 text-[var(--accent-lapis)]" />
              </button>
              <button
                type="button"
                onClick={onDownloadXlsx}
                disabled={xlsxBusy}
                className="flex min-h-[44px] w-full items-center justify-between rounded-md border border-[var(--accent-forest)]/40 bg-[var(--paper-card)] px-3.5 py-2 text-sm font-medium text-[var(--ink-primary)] hover:border-[var(--accent-forest)] disabled:opacity-60"
              >
                <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-forest)]">
                  {xlsxBusy
                    ? 'Generating .xlsx workbook...'
                    : 'it-works-bilingual-database.xlsx'}
                </span>
                {xlsxBusy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent-forest)]" />
                ) : (
                  <FileSpreadsheet className="h-3.5 w-3.5 text-[var(--accent-forest)]" />
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Right Tabbed Code Preview + Copy & Paste */}
        <section className="lg:col-span-8">
          <div className="overflow-hidden rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--paper-border)] bg-[var(--paper-surface)] px-4 py-2.5">
              <div className="flex max-w-full items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(
                  [
                    { id: 'code', label: 'Code.gs' },
                    { id: 'index', label: 'Index.html' },
                    { id: 'css', label: 'css.html' },
                    { id: 'javascript', label: 'JavaScript.html' },
                  ] as { id: ScriptFileTab; label: string }[]
                ).map((tab) => {
                  const isActive = activeFile === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveFile(tab.id);
                        setCopied(false);
                      }}
                      className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-[var(--accent-lapis)] font-semibold text-[#fbf9f5]'
                          : 'text-[var(--ink-secondary)] hover:bg-[var(--paper-bg)]'
                      }`}
                    >
                      <FileCode2 className="h-3.5 w-3.5 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded border border-[var(--paper-border)] bg-[var(--paper-card)] px-3.5 py-1.5 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)] whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[var(--accent-forest)]" />
                    <span className="text-[var(--accent-forest)]">
                      Copied {activeFilename} (Ready to Paste)
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy {activeFilename}</span>
                  </>
                )}
              </button>
            </div>

            <pre className="max-h-[640px] select-all overflow-auto bg-[#1b1917] p-5 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[#f4efe6]">
              <code>{activeContent}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
