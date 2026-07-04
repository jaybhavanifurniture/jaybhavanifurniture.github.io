import { useCallback, useId } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
}: SliderProps) {
  const id = useId();

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = Number(e.target.value);
      if (!isNaN(num) && num >= min && num <= max) {
        onChange(num);
      }
    },
    [onChange, min, max],
  );

  // Calculate fill percentage for the slider track
  const fillPercent = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium text-neutral-600 dark:text-neutral-400"
        >
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handleInputChange}
            className="w-20 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-right text-sm font-semibold text-neutral-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            aria-label={`${label} value`}
          />
          {unit && (
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-500">
              {unit}
            </span>
          )}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        className="slider-range w-full cursor-pointer"
        style={{ '--fill': `${fillPercent}%` } as React.CSSProperties}
      />
      <div className="flex justify-between text-xs text-neutral-400 dark:text-neutral-600">
        <span>
          {min.toLocaleString('en-IN')} {unit}
        </span>
        <span>
          {max.toLocaleString('en-IN')} {unit}
        </span>
      </div>
    </div>
  );
}
