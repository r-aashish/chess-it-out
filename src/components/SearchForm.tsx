import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface SearchFormProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedUsername) {
      setError('Enter a Chess.com username');
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    setError('');
    onSearch(trimmedUsername);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="ui-panel-subtle flex items-center gap-2 rounded-2xl p-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <Search className="h-5 w-5" />
        </div>

        <input
          type="text"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            if (error) setError('');
          }}
          placeholder="Search Chess.com username"
          className={`ui-input min-w-0 flex-1 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[var(--text-muted)] ${
            error ? 'border-rose-500/70' : ''
          }`}
          disabled={isLoading}
          aria-label="Chess.com username"
          aria-invalid={Boolean(error)}
        />

        <button
          type="submit"
          disabled={!username.trim() || isLoading}
          className="ui-btn-primary inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Search"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Analyze</span>
        </button>
      </div>

      {error ? <p className="px-1 text-sm font-medium text-rose-500">{error}</p> : null}
    </form>
  );
};
