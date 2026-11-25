import {
  BookOpen,
  Code2,
  Compass,
  Download,
  FileSpreadsheet,
  Loader2,
  LogOut,
  Menu,
  Plus,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ActiveTab } from '../types/dictionary';

interface TopBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onDownloadCsv: () => void;
  onDownloadXlsx: () => void;
  xlsxBusy?: boolean;
  onOpenAddModal: () => void;
  entryCount: number;
  userEmail: string | null;
  userDisplayName: string | null;
  isOwner: boolean;
  authLoading: boolean;
  authBusy: boolean;
  authError: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

const PRIMARY_NAV_ITEMS: { id: ActiveTab; label: string; hint: string }[] = [
  {
    id: 'dictionary',
    label: 'Dictionary',
    hint: 'Bilingual terms & Bahasa Malaysia definitions',
  },
  {
    id: 'steps',
    label: '12 Steps',
    hint: 'Step-by-step interactive study & verbatim quotes',
  },
  {
    id: 'traditions',
    label: '12 Traditions',
    hint: 'Tradition-by-tradition interactive study',
  },
  {
    id: 'search',
    label: 'Search',
    hint: 'Full-text search across all 167 PDF pages',
  },
];

const TOOL_ITEMS: {
  id: ActiveTab;
  label: string;
  hint: string;
  Icon: typeof Code2;
}[] = [
  {
    id: 'gas',
    label: 'GAS Script',
    hint: 'Ready-to-use Code.gs, Index.html, css.html & JavaScript.html',
    Icon: Code2,
  },
  {
    id: 'guide',
    label: 'Setup Guide',
    hint: 'Step-by-step Google Sheets & Web App deployment',
    Icon: Compass,
  },
];

function GoogleBadgeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function TopBar({
  activeTab,
  onTabChange,
  onDownloadCsv,
  onDownloadXlsx,
  xlsxBusy = false,
  onOpenAddModal,
  entryCount,
  userEmail,
  userDisplayName,
  isOwner,
  authLoading,
  authBusy,
  authError,
  onSignIn,
  onSignOut,
}: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleSelect = (tab: ActiveTab) => {
    if ((tab === 'gas' || tab === 'guide') && !isOwner) {
      return;
    }
    onTabChange(tab);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--paper-border)] bg-[var(--paper-bg)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('dictionary')}
          className="shrink-0 font-[family-name:var(--font-display)] text-2xl font-semibold leading-none tracking-tight text-[var(--ink-primary)] whitespace-nowrap transition-colors hover:text-[var(--accent-lapis)] sm:text-[26px]"
        >
          It Works Lexicon
        </button>

        {/* Zone 2: Primary 4 Study Links (Desktop lg+) */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative shrink-0 whitespace-nowrap py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--accent-lapis)]'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[17px] h-[2px] bg-[var(--accent-lapis)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Hamburger Menu */}
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onDownloadCsv}
            className="hidden shrink-0 items-center gap-2 rounded-md border border-[var(--accent-lapis)] bg-[var(--accent-lapis)] px-4 py-2 text-sm font-semibold text-[#fbf9f5] transition-colors hover:bg-[var(--accent-lapis-hover)] whitespace-nowrap sm:inline-flex"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border transition-colors ${
              menuOpen ||
              (isOwner && (activeTab === 'gas' || activeTab === 'guide'))
                ? 'border-[var(--accent-lapis)] bg-[var(--paper-surface)] text-[var(--accent-lapis)]'
                : 'border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)] hover:border-[var(--accent-lapis)]'
            }`}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Hamburger Menu Drawer */}
      {menuOpen && (
        <div className="border-t border-[var(--paper-border)] bg-[var(--paper-card)] shadow-lg">
          <nav
            aria-label="Hamburger menu"
            className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
          >
            <div className="mb-3 flex items-center justify-between border-b border-[var(--paper-border)] pb-2.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--ink-muted)] tabular-nums">
              <span>English &amp; Bahasa Malaysia Study Companion</span>
              <span>{entryCount.toLocaleString()} Entries</span>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Study Routes (shown on < lg; hidden on desktop since already in top bar) */}
              <div className="lg:hidden">
                <p className="mb-1.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--ink-muted)]">
                  Study Workspace
                </p>
                <div className="divide-y divide-[var(--paper-border)] border-t border-b border-[var(--paper-border)]">
                  {PRIMARY_NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className={`flex min-h-[48px] w-full items-center justify-between gap-4 px-2 py-2.5 text-left transition-colors ${
                          isActive
                            ? 'text-[var(--accent-lapis)]'
                            : 'text-[var(--ink-primary)] hover:text-[var(--accent-lapis)]'
                        }`}
                      >
                        <div>
                          <span className="block text-sm font-semibold">
                            {item.label}
                          </span>
                          <span className="block text-xs text-[var(--ink-muted)]">
                            {item.hint}
                          </span>
                        </div>
                        {isActive && (
                          <span className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-wider text-[var(--accent-lapis)]">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GAS Script & Setup Guide — Strictly Visible ONLY for Verified Owner */}
              {isOwner && (
                <div className="lg:col-span-2">
                  <p className="mb-1.5 flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--accent-forest)]">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    <span>Owner Tools · Google Apps Script &amp; Guide</span>
                  </p>
                  <div className="grid grid-cols-1 divide-y divide-[var(--paper-border)] border-t border-b border-[var(--paper-border)] lg:grid-cols-2 lg:gap-6 lg:divide-y-0">
                    {TOOL_ITEMS.map(({ id, label, hint, Icon }) => {
                      const isActive = activeTab === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleSelect(id)}
                          className={`flex min-h-[52px] w-full items-center justify-between gap-4 px-2 py-3 text-left transition-colors ${
                            isActive
                              ? 'text-[var(--accent-lapis)]'
                              : 'text-[var(--ink-primary)] hover:text-[var(--accent-lapis)]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-lapis)]" />
                            <div>
                              <span className="block text-sm font-semibold">
                                {label}
                              </span>
                              <span className="block text-xs text-[var(--ink-muted)]">
                                {hint}
                              </span>
                            </div>
                          </div>
                          {isActive && (
                            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-wider text-[var(--accent-lapis)]">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDownloadXlsx();
                      }}
                      disabled={xlsxBusy}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-[var(--accent-forest)] bg-[var(--accent-forest)] px-4 py-2 text-sm font-semibold text-[#fbf9f5] transition-colors hover:opacity-95 disabled:opacity-60"
                    >
                      {xlsxBusy ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4 shrink-0" />
                      )}
                      <span>
                        {xlsxBusy
                          ? 'Preparing XLSX Database...'
                          : `Download XLSX Database (${entryCount} entries)`}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Utility Actions & Google Account Authentication Footer */}
            <div className="mt-4 flex flex-col gap-3 border-t border-[var(--paper-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAddModal();
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-4 py-2 text-sm font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)]"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>Add Custom Term</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleSelect('dictionary');
                  }}
                  className="hidden min-h-[44px] items-center justify-center gap-2 rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-4 py-2 text-sm font-medium text-[var(--ink-secondary)] hover:border-[var(--accent-lapis)] hover:text-[var(--ink-primary)] lg:inline-flex"
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>Back to Dictionary</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDownloadCsv();
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-[var(--accent-lapis)] bg-[var(--accent-lapis)] px-4 py-2 text-sm font-semibold text-[#fbf9f5] sm:hidden"
                >
                  <Download className="h-4 w-4 shrink-0" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Account Sign-In / Sign-Out Block */}
              <div className="flex flex-col items-start gap-2 sm:items-end">
                {authLoading ? (
                  <span className="inline-flex min-h-[44px] items-center gap-2 font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Checking account...</span>
                  </span>
                ) : userEmail ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium text-[var(--ink-primary)]">
                        {userDisplayName || userEmail}
                      </p>
                      <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--ink-muted)]">
                        {isOwner
                          ? `Verified Owner · ${userEmail}`
                          : `${userEmail} · Study Access`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onSignOut}
                      disabled={authBusy}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3.5 py-2 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-lapis)] disabled:opacity-60"
                    >
                      <LogOut className="h-3.5 w-3.5 shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={onSignIn}
                    disabled={authBusy}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-md border border-[#747775]/45 bg-white px-4 py-2 text-sm font-medium text-[#1f1f1f] shadow-xs transition-colors hover:bg-[#f8f9fa] disabled:opacity-60"
                  >
                    {authBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#1f1f1f]" />
                    ) : (
                      <GoogleBadgeIcon />
                    )}
                    <span>Sign in with Google</span>
                  </button>
                )}

                {authError && (
                  <p className="text-xs text-red-800">{authError}</p>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
