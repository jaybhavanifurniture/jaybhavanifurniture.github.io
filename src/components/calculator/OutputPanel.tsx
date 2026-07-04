import { useRef, useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import type { CalculatorOutput, RateCard, RoomKey, CalculatorInput } from '../../lib/types';
import { formatCurrency } from '../../lib/calculate';
import { BreakdownBarChart } from './BreakdownBarChart';
import { LeadCaptureForm } from './LeadCaptureForm';
import { trackEvent } from '../../lib/analytics';

interface OutputPanelProps {
  output: CalculatorOutput;
  rateCard: RateCard;
  cityLabel: string;
  packageLabel: string;
  selectedRooms: RoomKey[];
  state: CalculatorInput;
}

/**
 * Animated number display — counts up/down smoothly
 */
function AnimatedCurrency({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => formatCurrency(Math.round(v)));
  const [displayValue, setDisplayValue] = useState(formatCurrency(0));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayValue(v));
    return unsubscribe;
  }, [display]);

  return <span>{displayValue}</span>;
}

export function OutputPanel({
  output,
  rateCard,
  cityLabel,
  packageLabel,
  selectedRooms,
  state,
}: OutputPanelProps) {
  const hasTrackedEstimate = useRef(false);

  // Track first non-zero estimate view
  useEffect(() => {
    if (output.totalMid > 0 && !hasTrackedEstimate.current) {
      hasTrackedEstimate.current = true;
      trackEvent('estimate_viewed');
    }
  }, [output.totalMid]);

  const contextSummary = `
- Home: ${state.homeType.toUpperCase()} (${state.areaSqft} sqft)
- City: ${cityLabel}
- Package: ${packageLabel}
- Rooms Selected: ${state.selectedRooms.length}
- Est. Range: ${formatCurrency(output.rangeLow)} - ${formatCurrency(output.rangeHigh)}
`.trim();

  return (
    <div className="space-y-6">
      {/* Headline estimate */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-neutral-200/60 bg-white/70 p-6 shadow-lg shadow-neutral-200/30 backdrop-blur-md dark:border-neutral-700/60 dark:bg-neutral-800/70 dark:shadow-neutral-900/30"
      >
        {/* Label */}
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Estimated Cost
        </p>

        {/* Big number range */}
        <div className="mt-2 flex items-baseline gap-2" aria-live="polite">
          <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
            <AnimatedCurrency value={output.rangeLow} />
          </span>
          <span className="text-lg text-neutral-400 dark:text-neutral-500">–</span>
          <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
            <AnimatedCurrency value={output.rangeHigh} />
          </span>
        </div>

        {/* Trust statement */}
        <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          <strong className="text-neutral-700 dark:text-neutral-300">Beta Version:</strong> Estimate based on typical{' '}
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {cityLabel}
          </span>{' '}
          rates for a{' '}
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {packageLabel}
          </span>{' '}
          finish. These numbers are approximate and could be wrong. A designer will confirm exact pricing after reviewing your space.
        </p>
      </motion.div>

      {/* Breakdown bar chart */}
      <BreakdownBarChart
        breakdown={output.breakdown}
        totalMid={output.totalMid}
      />

      {/* Exclusions */}
      <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Not included in estimate
        </p>
        <ul className="mt-2 space-y-1">
          {rateCard.exclusions.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-400"
            >
              <span className="mt-0.5 text-neutral-300 dark:text-neutral-600">×</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Lead capture */}
      <LeadCaptureForm contextSummary={contextSummary} />
    </div>
  );
}
