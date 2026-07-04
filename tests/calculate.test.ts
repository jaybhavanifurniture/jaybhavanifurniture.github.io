import { describe, it, expect } from 'vitest';
import { calculateEstimate, humanizeLabel, formatCurrency } from '../src/lib/calculate';
import type { CalculatorInput, RateCard } from '../src/lib/types';
import rateCardData from '../src/data/rate-card.json';

const rateCard = rateCardData as unknown as RateCard;

describe('Calculator Logic', () => {
  it('humanizeLabel formats correctly', () => {
    expect(humanizeLabel('modular_kitchen')).toBe('Modular Kitchen');
    expect(humanizeLabel('base')).toBe('Base Design & Labour');
    expect(humanizeLabel('unknown_key')).toBe('Unknown Key');
  });

  it('formatCurrency formats Indian currency correctly', () => {
    expect(formatCurrency(850000)).toBe('₹8.5L');
    expect(formatCurrency(12500000)).toBe('₹1.25Cr');
    expect(formatCurrency(100000)).toBe('₹1L');
    expect(formatCurrency(50000)).toBe('₹50,000');
  });

  it('calculates estimate correctly for base case', () => {
    const input: CalculatorInput = {
      homeType: '2bhk',
      city: 'navsari', // multiplier 1.0
      areaSqft: 1000,
      package: 'standard', // 180 / sqft
      selectedRooms: ['modular_kitchen'], // 250,000
    };

    const output = calculateEstimate(input, rateCard);

    // Base cost = 1000 * 180 * 1.0 = 180,000
    expect(output.baseCost).toBe(180000);
    // Room addons = 250,000 * 1.0 = 250,000
    expect(output.roomAddOnsCost).toBe(250000);
    // Total mid = 180,000 + 250,000 = 430,000
    expect(output.totalMid).toBe(430000);
    
    // Spread = 12%
    expect(output.rangeLow).toBe(430000 * 0.88);
    expect(output.rangeHigh).toBe(430000 * 1.12);
  });

  it('applies city multiplier correctly', () => {
    const input: CalculatorInput = {
      homeType: '2bhk',
      city: 'surat', // multiplier 1.10
      areaSqft: 1000,
      package: 'standard', // 180 / sqft
      selectedRooms: ['modular_kitchen'], // 250,000
    };

    const output = calculateEstimate(input, rateCard);

    // Base cost = 1000 * 180 * 1.1 = 198,000
    expect(output.baseCost).toBe(198000);
    // Room addons = 250,000 * 1.1 = 275,000
    expect(output.roomAddOnsCost).toBe(275000);
  });

  it('handles empty selected rooms', () => {
    const input: CalculatorInput = {
      homeType: '1bhk',
      city: 'navsari',
      areaSqft: 500,
      package: 'economy', // 120 / sqft
      selectedRooms: [],
    };

    const output = calculateEstimate(input, rateCard);

    expect(output.baseCost).toBe(60000);
    expect(output.roomAddOnsCost).toBe(0);
    expect(output.totalMid).toBe(60000);
    expect(output.breakdown).toHaveLength(1); // Only base cost
  });
});
