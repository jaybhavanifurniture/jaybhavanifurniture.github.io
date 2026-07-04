import { type ReactNode } from 'react';

interface Option<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div className="space-y-3">
      <span className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {label}
      </span>
      <div className="flex w-full rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800/80">
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                relative flex-1 flex justify-center items-center gap-1.5 rounded-lg px-2 sm:px-4 py-2.5 text-sm font-semibold
                transition-all duration-200 focus-visible:outline-2 focus-visible:outline-amber-400
                ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }
              `}
              aria-pressed={isActive}
            >
              {opt.icon}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
