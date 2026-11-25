/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { AddEntryModal } from './components/AddEntryModal';
import { BottomNav } from './components/BottomNav';
import { DictionaryView } from './components/DictionaryView';
import { FocusedStudyView } from './components/FocusedStudyView';
import { PageReaderDrawer } from './components/PageReaderDrawer';
import { PdfSearchView } from './components/PdfSearchView';
import { TopBar } from './components/TopBar';
import { FULL_LEXICON } from './data/lexiconAll';
import {
  signInWithGoogleAccount,
  signOutGoogleAccount,
  subscribeAuthChanges,
  verifyOwnerSessionWithServer,
} from './lib/auth';
import type { ActiveTab, DictionaryEntry } from './types/dictionary';
import { generateDictionaryCsv } from './utils/csvExport';

const LazyGasStudioView = lazy(() =>
  import('./components/GasStudioView').then((mod) => ({
    default: mod.GasStudioView,
  })),
);

const LazyGuideView = lazy(() =>
  import('./components/GuideView').then((mod) => ({
    default: mod.GuideView,
  })),
);

const CUSTOM_ENTRIES_STORAGE_KEY = 'leksikon_custom_entries_v1';

function readStoredEntries(): DictionaryEntry[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ENTRIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dictionary');
  const [customEntries, setCustomEntries] = useState<DictionaryEntry[]>(
    readStoredEntries,
  );
  const [selectedId, setSelectedId] = useState<string>(
    FULL_LEXICON[0]?.id ?? 'acceptance',
  );
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [readerState, setReaderState] = useState<{
    pdfPage: number | null;
    highlightQuery?: string;
  }>({ pdfPage: null });

  // Google Sign-In & Owner Verification State
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [xlsxBusy, setXlsxBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const unsubscribe = subscribeAuthChanges(async (user) => {
      if (!active) return;
      setAuthUser(user);
      if (!user) {
        setIsOwner(false);
        setAuthLoading(false);
        return;
      }

      setAuthLoading(true);
      const verification = await verifyOwnerSessionWithServer(user);
      if (!active) return;
      setIsOwner(verification.isOwner);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Route guard: never allow non-owners or signed-out users on restricted views
  useEffect(() => {
    if (!isOwner && (activeTab === 'gas' || activeTab === 'guide')) {
      setActiveTab('dictionary');
    }
  }, [isOwner, activeTab]);

  const entries = useMemo(() => {
    const map = new Map<string, DictionaryEntry>();
    FULL_LEXICON.forEach((entry) => map.set(entry.id, entry));
    customEntries.forEach((entry) => map.set(entry.id, entry));
    return Array.from(map.values());
  }, [customEntries]);

  const existingIds = useMemo(
    () => new Set(entries.map((entry) => entry.id)),
    [entries],
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        CUSTOM_ENTRIES_STORAGE_KEY,
        JSON.stringify(customEntries),
      );
    } catch {
      // Ignore quota errors
    }
  }, [customEntries]);

  const handleSignIn = async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      const user = await signInWithGoogleAccount();
      const verification = await verifyOwnerSessionWithServer(user);
      setIsOwner(verification.isOwner);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Google Sign-In failed.';
      if (!message.includes('popup-closed-by-user')) {
        setAuthError('Unable to complete Google Sign-In. Please try again.');
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signOutGoogleAccount();
      setIsOwner(false);
      if (activeTab === 'gas' || activeTab === 'guide') {
        setActiveTab('dictionary');
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSaveEntry = (entry: DictionaryEntry) => {
    setCustomEntries((prev) => {
      const filtered = prev.filter((item) => item.id !== entry.id);
      return [entry, ...filtered];
    });
    setSelectedId(entry.id);
  };

  const handleDeleteCustomEntry = (id: string) => {
    setCustomEntries((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) {
      setSelectedId(FULL_LEXICON[0]?.id ?? 'acceptance');
    }
  };

  const handleDownloadCsv = () => {
    const csv = generateDictionaryCsv(entries);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'it-works-bilingual-dictionary.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadXlsx = async () => {
    if (!isOwner || xlsxBusy) return;
    setXlsxBusy(true);
    try {
      const { downloadDictionaryXlsx } = await import('./utils/xlsxExport');
      await downloadDictionaryXlsx(entries);
    } finally {
      setXlsxBusy(false);
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    if ((tab === 'gas' || tab === 'guide') && !isOwner) {
      setActiveTab('dictionary');
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper-bg)] text-[var(--ink-primary)]">
      <TopBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onDownloadCsv={handleDownloadCsv}
        onDownloadXlsx={handleDownloadXlsx}
        xlsxBusy={xlsxBusy}
        onOpenAddModal={() => setAddModalOpen(true)}
        entryCount={entries.length}
        userEmail={authUser?.email ?? null}
        userDisplayName={authUser?.displayName ?? null}
        isOwner={isOwner}
        authLoading={authLoading}
        authBusy={authBusy}
        authError={authError}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <div className="flex-1">
        {activeTab === 'dictionary' && (
          <DictionaryView
            entries={entries}
            selectedId={selectedId}
            onSelectEntry={setSelectedId}
            onOpenAddModal={() => setAddModalOpen(true)}
            onOpenPdfPage={(pdfPage, highlightQuery) =>
              setReaderState({ pdfPage, highlightQuery })
            }
            onDeleteCustomEntry={handleDeleteCustomEntry}
          />
        )}

        {(activeTab === 'steps' || activeTab === 'traditions') && (
          <FocusedStudyView
            track={activeTab}
            entries={entries}
            onSaveAiEntry={handleSaveEntry}
            onOpenPdfPage={(pdfPage, highlightQuery) =>
              setReaderState({ pdfPage, highlightQuery })
            }
          />
        )}

        {activeTab === 'search' && (
          <PdfSearchView
            onOpenPdfPage={(pdfPage, highlightQuery) =>
              setReaderState({ pdfPage, highlightQuery })
            }
            onSaveAiEntry={handleSaveEntry}
            existingIds={existingIds}
          />
        )}

        {isOwner && activeTab === 'gas' && (
          <Suspense
            fallback={
              <div className="mx-auto max-w-7xl px-4 py-12 text-sm text-[var(--ink-muted)] sm:px-6 lg:px-8">
                Loading GAS Script Studio...
              </div>
            }
          >
            <LazyGasStudioView
              entries={entries}
              onDownloadCsv={handleDownloadCsv}
              onDownloadXlsx={handleDownloadXlsx}
              xlsxBusy={xlsxBusy}
              isOwner={isOwner}
              ownerEmail={authUser?.email ?? null}
            />
          </Suspense>
        )}

        {isOwner && activeTab === 'guide' && (
          <Suspense
            fallback={
              <div className="mx-auto max-w-4xl px-4 py-12 text-sm text-[var(--ink-muted)] sm:px-6 lg:px-8">
                Loading Setup Guide...
              </div>
            }
          >
            <LazyGuideView
              onDownloadCsv={handleDownloadCsv}
              onNavigateTab={handleTabChange}
              isOwner={isOwner}
              ownerEmail={authUser?.email ?? null}
            />
          </Suspense>
        )}
      </div>

      <footer className="mt-auto border-t border-[var(--paper-border)] bg-[var(--paper-surface)]/55 py-5 pb-24 lg:pb-5">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 font-[family-name:var(--font-mono)] text-[11px] text-[var(--ink-muted)] sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <span>
            It Works Lexicon · English &amp; Bahasa Malaysia Study Dictionary
            (167 PDF Pages)
          </span>
          <span>
            {isOwner
              ? 'Owner Tools Enabled · GAS Script, Setup Guide & XLSX Database'
              : 'It Works: How and Why · Public Bilingual Study Reference'}
          </span>
        </div>
      </footer>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      <PageReaderDrawer
        pdfPage={readerState.pdfPage}
        highlightQuery={readerState.highlightQuery}
        onClose={() => setReaderState({ pdfPage: null })}
        onChangePage={(nextPage) =>
          setReaderState((prev) => ({ ...prev, pdfPage: nextPage }))
        }
      />

      <AddEntryModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveEntry}
      />
    </div>
  );
}
