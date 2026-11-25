import { X } from 'lucide-react';
import { useState } from 'react';
import type {
  DictionaryEntry,
  EntryCategory,
  PartOfSpeech,
} from '../types/dictionary';
import { formatCategoryEn, formatPosEn } from '../utils/lexiconHelpers';

interface AddEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: DictionaryEntry) => void;
}

const POS_OPTIONS: PartOfSpeech[] = [
  'Kata Nama',
  'Frasa',
  'Prinsip',
  'Kata Kerja',
  'Kata Sifat',
];

const CATEGORY_OPTIONS: EntryCategory[] = [
  'Frasa Teras',
  'Indeks Utama',
  'Langkah 1–12',
  'Tradisi 1–12',
];

export function AddEntryModal({ open, onClose, onSave }: AddEntryModalProps) {
  const [term, setTerm] = useState('');
  const [malayTerm, setMalayTerm] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech>('Frasa');
  const [category, setCategory] = useState<EntryCategory>('Frasa Teras');
  const [section, setSection] = useState('Personal Study Notes');
  const [bookPagesRaw, setBookPagesRaw] = useState('');
  const [definitionMs, setDefinitionMs] = useState('');
  const [definitionEn, setDefinitionEn] = useState('');
  const [usageNoteEn, setUsageNoteEn] = useState('');
  const [usageNoteMs, setUsageNoteMs] = useState('');
  const [quote, setQuote] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim() || !malayTerm.trim() || !definitionMs.trim()) {
      setError(
        'Please fill in the English Term, Bahasa Malaysia Equivalent, and Bahasa Malaysia Definition.',
      );
      return;
    }

    const bookPages = bookPagesRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newEntry: DictionaryEntry = {
      id: `custom-${term
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      term: term.trim(),
      malayTerm: malayTerm.trim(),
      partOfSpeech,
      category,
      section: section.trim() || 'Personal Study Notes',
      bookPages,
      pdfPages: [],
      definitionEn: definitionEn.trim() || definitionMs.trim(),
      definitionMs: definitionMs.trim(),
      usageNoteEn: usageNoteEn.trim(),
      usageNoteMs: usageNoteMs.trim() || usageNoteEn.trim(),
      excerpts: quote.trim()
        ? [
            {
              bookPage: bookPages[0] || '-',
              pdfPage: 1,
              section: section.trim() || 'Personal Study Notes',
              quote: quote.trim(),
            },
          ]
        : [],
      source: 'custom',
    };

    onSave(newEntry);
    setTerm('');
    setMalayTerm('');
    setBookPagesRaw('');
    setDefinitionMs('');
    setDefinitionEn('');
    setUsageNoteEn('');
    setUsageNoteMs('');
    setQuote('');
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1917]/45 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Add Custom Dictionary Term"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--paper-border)] pb-4">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              Personal Lexicon Entry
            </p>
            <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink-primary)]">
              Add New Term or Phrase
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--paper-border)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <p className="rounded border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm text-red-900">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">
                English Term / Phrase *
              </label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. Daily reprieve"
                className="mt-1 min-h-[42px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2 text-sm focus:border-[var(--accent-lapis)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">
                Bahasa Malaysia Equivalent *
              </label>
              <input
                type="text"
                value={malayTerm}
                onChange={(e) => setMalayTerm(e.target.value)}
                placeholder="e.g. Penangguhan Harian"
                className="mt-1 min-h-[42px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2 text-sm focus:border-[var(--accent-lapis)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">
                Part of Speech
              </label>
              <select
                value={partOfSpeech}
                onChange={(e) =>
                  setPartOfSpeech(e.target.value as PartOfSpeech)
                }
                className="mt-1 min-h-[42px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2 text-sm focus:border-[var(--accent-lapis)] focus:outline-none"
              >
                {POS_OPTIONS.map((pos) => (
                  <option key={pos} value={pos}>
                    {formatPosEn(pos)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EntryCategory)}
                className="mt-1 min-h-[42px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2 text-sm focus:border-[var(--accent-lapis)] focus:outline-none"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategoryEn(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">
                Book Pages (comma separated)
              </label>
              <input
                type="text"
                value={bookPagesRaw}
                onChange={(e) => setBookPagesRaw(e.target.value)}
                placeholder="e.g. 12, 48"
                className="mt-1 min-h-[42px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2 text-sm focus:border-[var(--accent-lapis)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink-secondary)]">
              Book Chapter / Section
            </label>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g. Step Eleven"
              className="mt-1 min-h-[42px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2 text-sm focus:border-[var(--accent-lapis)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink-secondary)]">
              Definisi Bahasa Malaysia *
            </label>
            <textarea
              rows={2}
              value={definitionMs}
              onChange={(e) => setDefinitionMs(e.target.value)}
              placeholder="Explain the meaning in Bahasa Malaysia..."
              className="mt-1 w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2 text-sm focus:border-[var(--accent-lapis)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink-secondary)]">
              English Definition (Optional)
            </label>
            <textarea
              rows={2}
              value={definitionEn}
              onChange={(e) => setDefinitionEn(e.target.value)}
              placeholder="Concise English definition..."
              className="mt-1 w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2 text-sm focus:border-[var(--accent-lapis)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">
                Context Note (English, Optional)
              </label>
              <input
                type="text"
                value={usageNoteEn}
                onChange={(e) => setUsageNoteEn(e.target.value)}
                placeholder="How this term is used in the chapter..."
                className="mt-1 min-h-[42px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2 text-sm focus:border-[var(--accent-lapis)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">
                Nota Konteks (Bahasa Malaysia, Optional)
              </label>
              <input
                type="text"
                value={usageNoteMs}
                onChange={(e) => setUsageNoteMs(e.target.value)}
                placeholder="Nota konteks dalam Bahasa Malaysia..."
                className="mt-1 min-h-[42px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2 text-sm focus:border-[var(--accent-lapis)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink-secondary)]">
              PDF Excerpt Quote (Optional)
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Verbatim sentence from the PDF..."
              className="mt-1 min-h-[42px] w-full rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-3 py-2 text-sm focus:border-[var(--accent-lapis)] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[var(--paper-border)] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] px-4 py-2 text-sm font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[40px] rounded-md border border-[var(--accent-lapis)] bg-[var(--accent-lapis)] px-5 py-2 text-sm font-semibold text-[#fbf9f5] hover:bg-[var(--accent-lapis-hover)]"
            >
              Save to Dictionary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
