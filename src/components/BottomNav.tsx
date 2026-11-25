import { BookOpen, Compass, ListOrdered, Search } from 'lucide-react';
import type { ActiveTab } from '../types/dictionary';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const BOTTOM_TABS: {
  id: ActiveTab;
  label: string;
  Icon: typeof BookOpen;
}[] = [
  { id: 'dictionary', label: 'Dictionary', Icon: BookOpen },
  { id: 'steps', label: '12 Steps', Icon: ListOrdered },
  { id: 'traditions', label: '12 Traditions', Icon: Compass },
  { id: 'search', label: 'Search', Icon: Search },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      aria-label="Bottom tab navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--paper-border)] bg-[var(--paper-card)]/95 backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid h-[58px] max-w-2xl grid-cols-4 items-stretch px-1 pb-[env(safe-area-inset-bottom)]">
        {BOTTOM_TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 px-1 transition-colors duration-150 ${
                isActive
                  ? 'text-[var(--accent-lapis)]'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
              }`}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-4 top-0 h-[2px] rounded-b bg-[var(--accent-lapis)]"
                />
              )}
              <Icon
                className="h-5 w-5 shrink-0"
                strokeWidth={isActive ? 2.15 : 1.7}
              />
              <span
                className={`whitespace-nowrap text-[10px] leading-none tracking-tight ${
                  isActive ? 'font-semibold' : 'font-medium'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
