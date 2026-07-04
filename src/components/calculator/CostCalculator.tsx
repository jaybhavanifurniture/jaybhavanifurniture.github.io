import { useReducer, useMemo, useEffect } from 'react';
import type {
  CalculatorInput,
  Action,
  RateCard,
  HomeType,
} from '../../lib/types';
import { calculateEstimate } from '../../lib/calculate';
import { trackEvent } from '../../lib/analytics';
import { InputPanel } from './InputPanel';
import { OutputPanel } from './OutputPanel';
import rateCardData from '../../data/rate-card.json';

const rateCard = rateCardData as unknown as RateCard;

// Initial state — 2BHK, Navsari, Standard, Kitchen pre-selected
const initialState: CalculatorInput = {
  homeType: '2bhk',
  city: 'navsari',
  areaSqft: rateCard.homeTypeDefaults['2bhk'].avgAreaSqft,
  package: 'standard',
  selectedRooms: ['modular_kitchen'],
};

function reducer(state: CalculatorInput, action: Action): CalculatorInput {
  switch (action.type) {
    case 'SET_HOME_TYPE': {
      const newType = action.payload as HomeType;
      const defaults = rateCard.homeTypeDefaults[newType];
      return {
        ...state,
        homeType: newType,
        areaSqft: defaults?.avgAreaSqft ?? state.areaSqft,
      };
    }
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'SET_AREA':
      return { ...state, areaSqft: action.payload };
    case 'SET_PACKAGE':
      return { ...state, package: action.payload };
    case 'TOGGLE_ROOM': {
      const room = action.payload;
      const rooms = state.selectedRooms.includes(room)
        ? state.selectedRooms.filter((r) => r !== room)
        : [...state.selectedRooms, room];
      return { ...state, selectedRooms: rooms };
    }
    default:
      return state;
  }
}

export default function CostCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Derived output — always recalculated from state, never stored separately
  const output = useMemo(
    () => calculateEstimate(state, rateCard),
    [state],
  );

  // Track calculator view on mount
  useEffect(() => {
    trackEvent('calculator_viewed');
  }, []);

  // City and package labels for the trust statement
  const cityLabel =
    rateCard.cityMultipliers[state.city]?.label ?? 'your city';
  const packageLabel =
    rateCard.packages[state.package]?.label ?? state.package;

  return (
    <div className="px-5 py-8 sm:px-10 sm:py-12 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[1fr,1fr] lg:gap-16 xl:grid-cols-[55fr,45fr]">
        {/* Left — Inputs */}
        <div className="order-1">
          <InputPanel
            state={state}
            dispatch={dispatch}
            rateCard={rateCard}
          />
        </div>

        {/* Right — Output (sticky on desktop) */}
        <div className="order-2 lg:sticky lg:top-24 lg:self-start">
          <OutputPanel
            output={output}
            rateCard={rateCard}
            cityLabel={cityLabel}
            packageLabel={packageLabel}
            selectedRooms={state.selectedRooms}
            state={state}
          />
        </div>
      </div>
    </div>
  );
}
