import { motion } from 'framer-motion';
import type { CostBreakdownItem } from '../../lib/types';
import { formatCurrencyFull } from '../../lib/calculate';
import { useState } from 'react';

interface BreakdownBarChartProps {
  breakdown: CostBreakdownItem[];
  totalMid: number;
}

export function BreakdownBarChart({
  breakdown,
  totalMid,
}: BreakdownBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (totalMid === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
        Cost Breakdown
      </h3>

      {/* Stacked bar */}
      <div className="relative flex h-10 w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
        {breakdown.map((item, i) => {
          const widthPercent = (item.amount / totalMid) * 100;
          if (widthPercent < 0.5) return null;

          return (
            <motion.div
              key={item.key}
              initial={{ width: 0 }}
              animate={{ width: `${widthPercent}%` }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: i * 0.05 }}
              className="relative h-full cursor-pointer transition-opacity duration-150"
              style={{ backgroundColor: item.color }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              tabIndex={0}
              role="img"
              aria-label={`${item.label}: ${formatCurrencyFull(item.amount)}`}
            >
              {/* Tooltip */}
              {hoveredIndex === i && (
                <div className="absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900">
                  {item.label}: {formatCurrencyFull(item.amount)}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {breakdown.map((item) => (
          <div key={item.key} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              {item.label}
            </span>
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {formatCurrencyFull(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
