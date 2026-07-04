import type { ReactNode } from 'react';
import type { Package, PackageEntry } from '../../../lib/types';

interface PackageCardProps {
  packageKey: Package;
  entry: PackageEntry;
  active: boolean;
  onClick: () => void;
}

const PACKAGE_ICONS: Record<string, ReactNode> = {
  leaf: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21c.5 -4.5 2.5 -8 7 -10" />
      <path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9 0 1 0 3 2 5h3z" />
    </svg>
  ),
  star: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
    </svg>
  ),
  diamond: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 5h12l3 5l-9 11l-9-11z" />
      <path d="M10 5l-2 5l4 6.5l4-6.5l-2-5" />
      <path d="M3 10h18" />
    </svg>
  ),
};

export function PackageCard({
  packageKey,
  entry,
  active,
  onClick,
}: PackageCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        group relative flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center
        transition-all duration-200 focus-visible:outline-2 focus-visible:outline-amber-400
        ${
          active
            ? 'border-amber-400 bg-amber-50/50 shadow-md shadow-amber-100/50 dark:border-amber-500/60 dark:bg-amber-500/5 dark:shadow-amber-900/20'
            : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-neutral-600'
        }
      `}
    >
      {/* Active indicator dot */}
      {active && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm dark:bg-amber-500">
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5L4 7L8 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}

      {/* Icon */}
      <span
        className={`
          transition-colors duration-200
          ${
            active
              ? 'text-amber-500 dark:text-amber-400'
              : 'text-neutral-400 group-hover:text-neutral-500 dark:text-neutral-500'
          }
        `}
      >
        {PACKAGE_ICONS[entry.icon] || PACKAGE_ICONS.star}
      </span>

      {/* Label */}
      <span
        className={`
          text-base font-bold transition-colors duration-200
          ${
            active
              ? 'text-neutral-900 dark:text-neutral-100'
              : 'text-neutral-700 dark:text-neutral-300'
          }
        `}
      >
        {entry.label}
      </span>

      {/* Description */}
      <span className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        {entry.description}
      </span>
    </button>
  );
}
