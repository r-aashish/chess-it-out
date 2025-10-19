import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface GameFilterProps {
  onFilterChange: (filter: GameFilter) => void;
}

export interface GameFilter {
  search: string;
  result: 'all' | 'win' | 'loss' | 'draw';
  timeControl: 'all' | 'bullet' | 'blitz' | 'rapid' | 'daily';
}

/**
 * GameFilter component allows users to filter games by search term, result, and time control.
 */
export const GameFilterComponent: React.FC<GameFilterProps> = ({ onFilterChange }) => {
  const [filter, setFilter] = useState<GameFilter>({
    search: '',
    result: 'all',
    timeControl: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (updates: Partial<GameFilter>) => {
    const newFilter = { ...filter, ...updates };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by opponent name..."
          value={filter.search}
          onChange={(e) => handleChange({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </span>
      </button>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {/* Result Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Result
            </label>
            <select
              value={filter.result}
              onChange={(e) => handleChange({ result: e.target.value as GameFilter['result'] })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Results</option>
              <option value="win">Wins</option>
              <option value="loss">Losses</option>
              <option value="draw">Draws</option>
            </select>
          </div>

          {/* Time Control Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Control
            </label>
            <select
              value={filter.timeControl}
              onChange={(e) => handleChange({ timeControl: e.target.value as GameFilter['timeControl'] })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Time Controls</option>
              <option value="bullet">Bullet (1-2 min)</option>
              <option value="blitz">Blitz (3-5 min)</option>
              <option value="rapid">Rapid (10+ min)</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
