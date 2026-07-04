interface ToggleChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function ToggleChip({ label, active, onClick }: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium
        transition-all duration-200 focus-visible:outline-2 focus-visible:outline-amber-400
        ${
          active
            ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-300'
            : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600'
        }
      `}
    >
      {/* Checkmark indicator */}
      <span
        className={`
          flex h-4 w-4 items-center justify-center rounded-full text-xs transition-all duration-200
          ${
            active
              ? 'bg-amber-400 text-white dark:bg-amber-500'
              : 'bg-neutral-200 dark:bg-neutral-700'
          }
        `}
      >
        {active && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5L4 7L8 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}
