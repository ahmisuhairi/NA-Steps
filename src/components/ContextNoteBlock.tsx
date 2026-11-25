import type { DictionaryEntry } from '../types/dictionary';
import { getUsageNoteEn } from '../utils/lexiconHelpers';

interface ContextNoteBlockProps {
  entry: DictionaryEntry;
  compact?: boolean;
}

export function ContextNoteBlock({ entry, compact = false }: ContextNoteBlockProps) {
  const noteEn = getUsageNoteEn(entry);
  if (!noteEn) return null;

  return (
    <section
      className={`rounded-md border border-[var(--paper-border)] bg-[var(--paper-surface)]/55 ${
        compact ? 'p-3.5' : 'p-4 sm:p-5'
      }`}
    >
      <h3 className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-wider text-[var(--ink-muted)]">
        Context Note in Book
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-primary)]">
        {noteEn}
      </p>
    </section>
  );
}
