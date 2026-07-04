// Shared TypeScript types for the cost calculator

export type HomeType = '1bhk' | '2bhk' | '3bhk' | '4bhk_villa';
export type Package = 'economy' | 'standard' | 'premium';

export type RoomKey =
  | 'modular_kitchen'
  | 'wardrobes'
  | 'false_ceiling'
  | 'living_room'
  | 'tv_unit'
  | 'lighting';

export interface CalculatorInput {
  homeType: HomeType;
  city: string;
  areaSqft: number;
  package: Package;
  selectedRooms: RoomKey[];
}

export interface CostBreakdownItem {
  key: string;
  label: string;
  amount: number;
  color: string;
}

export interface CalculatorOutput {
  baseCost: number;
  roomAddOnsCost: number;
  totalMid: number;
  rangeLow: number;
  rangeHigh: number;
  breakdown: CostBreakdownItem[];
}

export interface CityEntry {
  label: string;
  multiplier: number;
  region: 'gujarat' | 'national' | 'other';
}

export interface RoomAddOn {
  label: string;
  icon: string;
  economy: number;
  standard: number;
  premium: number;
}

export interface HomeTypeEntry {
  label: string;
  avgAreaSqft: number;
}

export interface PackageEntry {
  label: string;
  description: string;
  icon: string;
}

export interface RateCard {
  baseRatePerSqft: Record<Package, number>;
  homeTypeDefaults: Record<HomeType, HomeTypeEntry>;
  cityMultipliers: Record<string, CityEntry>;
  roomAddOns: Record<RoomKey, RoomAddOn>;
  estimateRangeSpread: number;
  exclusions: string[];
  packages: Record<Package, PackageEntry>;
}

// Reducer action types
export type Action =
  | { type: 'SET_HOME_TYPE'; payload: HomeType }
  | { type: 'SET_CITY'; payload: string }
  | { type: 'SET_AREA'; payload: number }
  | { type: 'SET_PACKAGE'; payload: Package }
  | { type: 'TOGGLE_ROOM'; payload: RoomKey };
