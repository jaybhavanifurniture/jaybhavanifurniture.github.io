// Pure calculation functions — no side effects, no UI imports
// Unit-testable independently of the React components

import type {
  CalculatorInput,
  CalculatorOutput,
  CostBreakdownItem,
  RateCard,
} from './types';

/**
 * Consistent color map for breakdown segments.
 * Each room/category always gets the same color.
 */
const SEGMENT_COLORS: Record<string, string> = {
  base: '#C8842A',           // amber-400 — Base Design & Labour
  modular_kitchen: '#8B6F4E', // wood-500 — Kitchen
  wardrobes: '#5C3D2E',      // wood-600 — Wardrobes
  false_ceiling: '#A06B1E',  // amber-500 — False Ceiling
  living_room: '#B09268',    // wood-400 — Living Room
  tv_unit: '#7A5118',        // amber-600 — TV Unit
  lighting: '#E8A94D',       // amber-300 — Lighting
};

/**
 * Convert a snake_case key into a human-readable label.
 * Falls back to capitalizing each word if no override exists.
 */
export function humanizeLabel(key: string): string {
  const overrides: Record<string, string> = {
    base: 'Base Design & Labour',
    modular_kitchen: 'Modular Kitchen',
    wardrobes: 'Wardrobes',
    false_ceiling: 'False Ceiling',
    living_room: 'Living Room',
    tv_unit: 'TV Unit',
    lighting: 'Lighting',
  };

  if (overrides[key]) return overrides[key];

  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format a number as Indian currency with lakh/crore abbreviations.
 * Examples: 850000 → "₹8.5L", 12500000 → "₹1.25Cr"
 */
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    // Crore
    const crore = amount / 10000000;
    return `₹${crore.toFixed(crore % 1 === 0 ? 0 : 2)}Cr`;
  }
  if (amount >= 100000) {
    // Lakh
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(lakh % 1 === 0 ? 0 : 1)}L`;
  }
  if (amount >= 1000) {
    // Thousands — use Indian number formatting
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `₹${amount}`;
}

/**
 * Format a number in full Indian rupee notation (no abbreviation).
 * Example: 850000 → "₹8,50,000"
 */
export function formatCurrencyFull(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/**
 * Core calculation function. Pure — no side effects.
 * Every number displayed in the UI must trace back to this function's output.
 */
export function calculateEstimate(
  input: CalculatorInput,
  rateCard: RateCard,
): CalculatorOutput {
  const cityEntry = rateCard.cityMultipliers[input.city] ?? rateCard.cityMultipliers.other;
  const cityMultiplier = cityEntry.multiplier;
  const baseRate = rateCard.baseRatePerSqft[input.package];

  // Base cost = area × rate per sqft × city multiplier
  const baseCost = Math.round(input.areaSqft * baseRate * cityMultiplier);

  // Room add-ons
  const roomBreakdown: CostBreakdownItem[] = input.selectedRooms.map((roomKey) => {
    const roomData = rateCard.roomAddOns[roomKey];
    const roomCost = Math.round(roomData[input.package] * cityMultiplier);
    return {
      key: roomKey,
      label: roomData.label || humanizeLabel(roomKey),
      amount: roomCost,
      color: SEGMENT_COLORS[roomKey] || '#78716C',
    };
  });

  const roomAddOnsCost = roomBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const totalMid = baseCost + roomAddOnsCost;

  const spread = rateCard.estimateRangeSpread;

  return {
    baseCost,
    roomAddOnsCost,
    totalMid,
    rangeLow: totalMid * (1 - spread),
    rangeHigh: totalMid * (1 + spread),
    breakdown: [
      {
        key: 'base',
        label: 'Base Design & Labour',
        amount: baseCost,
        color: SEGMENT_COLORS.base,
      },
      ...roomBreakdown,
    ],
  };
}
