import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface GameFilterProps {
  onFilterChange: (filter: GameFilter) => void;
}

export interface GameFilter {
  search: string;
  result: 'all' | 'win' | 'loss' | 'draw';
  timeControl: 'all' | 'bullet' | 'blitz' | 'rapid' | 'daily';
}

export const GameFilterComponent: React.FC<GameFilterProps> = ({ onFilterChange }) => {
  const [filter, setFilter] = useState<GameFilter>({
    search: '',
    result: 'all',
    timeControl: 'all',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (updates: Partial<GameFilter>) => {
    const newFilter = { ...filter, ...updates };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="space-y-3">
      <div className="ui-panel-subtle flex items-center gap-2 rounded-2xl p-2">
        <Search className="ml-2 h-4 w-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search opponent"
          value={filter.search}
          onChange={(event) => handleChange({ search: event.target.value })}
          className="ui-input flex-1 rounded-xl px-3 py-2 text-sm"
        />

        <button
          type="button"
          onClick={() => setShowAdvanced((previous) => !previous)}
          className="ui-btn-secondary inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {showAdvanced ? 'Less' : 'Filters'}
        </button>
      </div>

      {showAdvanced ? (
        <div className="ui-panel-subtle grid gap-3 rounded-2xl p-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Result</span>
            <select
              value={filter.result}
              onChange={(event) => handleChange({ result: event.target.value as GameFilter['result'] })}
              className="ui-input w-full rounded-xl px-3 py-2 text-sm"
            >
              <option value="all">All results</option>
              <option value="win">Wins</option>
              <option value="loss">Losses</option>
              <option value="draw">Draws</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Time control</span>
            <select
              value={filter.timeControl}
              onChange={(event) => handleChange({ timeControl: event.target.value as GameFilter['timeControl'] })}
              className="ui-input w-full rounded-xl px-3 py-2 text-sm"
            >
              <option value="all">All time controls</option>
              <option value="bullet">Bullet</option>
              <option value="blitz">Blitz</option>
              <option value="rapid">Rapid</option>
              <option value="daily">Daily</option>
            </select>
          </label>
        </div>
      ) : null}
    </div>
  );
};
