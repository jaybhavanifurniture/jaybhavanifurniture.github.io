import type {
  CalculatorInput,
  Action,
  RateCard,
  HomeType,
  Package,
  RoomKey,
} from '../../lib/types';
import { SegmentedControl } from './ui/SegmentedControl';
import { Slider } from './ui/Slider';
import { ToggleChip } from './ui/ToggleChip';
import { PackageCard } from './ui/PackageCard';

interface InputPanelProps {
  state: CalculatorInput;
  dispatch: React.Dispatch<Action>;
  rateCard: RateCard;
}

export function InputPanel({ state, dispatch, rateCard }: InputPanelProps) {
  // Home type options
  const homeTypeOptions = (
    Object.entries(rateCard.homeTypeDefaults) as [HomeType, { label: string; avgAreaSqft: number }][]
  ).map(([key, entry]) => ({
    value: key,
    label: entry.label,
  }));

  // City options grouped by region
  const gujaratCities = Object.entries(rateCard.cityMultipliers)
    .filter(([, entry]) => entry.region === 'gujarat')
    .map(([key, entry]) => ({ value: key, label: entry.label }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const nationalCities = Object.entries(rateCard.cityMultipliers)
    .filter(([, entry]) => entry.region === 'national')
    .map(([key, entry]) => ({ value: key, label: entry.label }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const otherCities = Object.entries(rateCard.cityMultipliers)
    .filter(([, entry]) => entry.region === 'other')
    .map(([key, entry]) => ({ value: key, label: entry.label }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Room options
  const roomEntries = Object.entries(rateCard.roomAddOns) as [
    RoomKey,
    { label: string },
  ][];

  // Package options
  const packageEntries = Object.entries(rateCard.packages) as [
    Package,
    { label: string; description: string; icon: string },
  ][];

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Configure Your Home
        </h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Adjust the options below to get an instant estimate.
        </p>
      </div>

      {/* Home Type */}
      <SegmentedControl
        label="Home Type"
        options={homeTypeOptions}
        value={state.homeType}
        onChange={(val) =>
          dispatch({ type: 'SET_HOME_TYPE', payload: val as HomeType })
        }
      />

      {/* City */}
      <div className="space-y-2">
        <label
          htmlFor="city-select"
          className="text-sm font-medium text-neutral-600 dark:text-neutral-400"
        >
          City
        </label>
        <select
          id="city-select"
          value={state.city}
          onChange={(e) =>
            dispatch({ type: 'SET_CITY', payload: e.target.value })
          }
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-colors focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        >
          <optgroup label="Gujarat">
            {gujaratCities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="National">
            {nationalCities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </optgroup>
          {otherCities.length > 0 && (
            <optgroup label="Other">
              {otherCities.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Carpet Area */}
      <Slider
        label="Carpet Area"
        value={state.areaSqft}
        min={300}
        max={5000}
        step={50}
        unit="sqft"
        onChange={(val) => dispatch({ type: 'SET_AREA', payload: val })}
      />

      {/* Package Tier */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Package Tier
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {packageEntries.map(([key, entry]) => (
            <PackageCard
              key={key}
              packageKey={key}
              entry={entry}
              active={state.package === key}
              onClick={() =>
                dispatch({ type: 'SET_PACKAGE', payload: key })
              }
            />
          ))}
        </div>
      </div>

      {/* Room Scope */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Rooms & Scope
        </span>
        <div className="flex flex-wrap gap-2">
          {roomEntries.map(([key, room]) => (
            <ToggleChip
              key={key}
              label={room.label}
              active={state.selectedRooms.includes(key)}
              onClick={() =>
                dispatch({ type: 'TOGGLE_ROOM', payload: key })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
