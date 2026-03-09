import React, { useMemo, useState } from 'react';
import { ChessGame } from '../types/chess';
import { Calendar, ChevronRight } from './icons';
import { Swords, Clock3 } from 'lucide-react';
import whiteBishop from '/images/white-bishop.png';
import blackBishop from '/images/black-bishop.png';
import { formatDate } from '../utils/date';
import { GameFilterComponent, GameFilter } from './GameFilter';

interface GamesListProps {
  games: ChessGame[];
  username: string;
  onGameSelect: (game: ChessGame) => void;
  isLoading: boolean;
}

type GameSort = 'recent' | 'oldest' | 'opponent-rating-desc' | 'opponent-rating-asc';

const LOSS_RESULTS = new Set(['checkmated', 'resigned', 'timeout', 'lose', 'abandoned']);
const DRAW_RESULTS = new Set(['stalemate', 'draw', 'agreed', 'repetition', 'insufficient', '50move', 'timevsinsufficient']);

const getOutcome = (result: string): 'win' | 'loss' | 'draw' => {
  const normalized = result.toLowerCase();
  if (normalized === 'win') return 'win';
  if (LOSS_RESULTS.has(normalized)) return 'loss';
  if (DRAW_RESULTS.has(normalized)) return 'draw';
  return 'draw';
};

const getOutcomeBadge = (outcome: 'win' | 'loss' | 'draw') => {
  if (outcome === 'win') return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300';
  if (outcome === 'loss') return 'bg-rose-500/20 text-rose-600 dark:text-rose-300';
  return 'bg-amber-400/20 text-amber-700 dark:text-amber-300';
};

export const GamesList: React.FC<GamesListProps> = ({ games, username, onGameSelect, isLoading }) => {
  const [filterResult, setFilterResult] = useState<string>('');
  const [gameFilter, setGameFilter] = useState<GameFilter>({
    search: '',
    result: 'all',
    timeControl: 'all',
  });
  const [sortBy, setSortBy] = useState<GameSort>('recent');

  const getTimeControl = (timeClass: string): string => {
    const timeMap: Record<string, string> = {
      bullet: 'bullet',
      blitz: 'blitz',
      rapid: 'rapid',
      daily: 'daily',
    };
    return timeMap[timeClass.toLowerCase()] || timeClass;
  };

  const filteredGames = useMemo(() => {
    return games.filter((game: ChessGame) => {
      if (game.initialFen) return false;

      const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? 'white' : 'black';
      const opponentUsername = playerColor === 'white' ? game.black.username : game.white.username;
      const playerData = playerColor === 'white' ? game.white : game.black;
      const outcome = getOutcome(playerData.result);

      if (gameFilter.search && !opponentUsername.toLowerCase().includes(gameFilter.search.toLowerCase())) {
        return false;
      }

      if (gameFilter.result !== 'all' && outcome !== gameFilter.result) {
        return false;
      }

      if (filterResult && outcome !== filterResult) {
        return false;
      }

      if (gameFilter.timeControl !== 'all') {
        const gameTimeControl = getTimeControl(game.time_class);
        if (gameTimeControl !== gameFilter.timeControl) return false;
      }

      return true;
    });
  }, [games, username, gameFilter, filterResult]);

  const sortedFilteredGames = useMemo(() => {
    return [...filteredGames].sort((a, b) => {
      const aPlayerColor = a.white.username.toLowerCase() === username.toLowerCase() ? 'white' : 'black';
      const bPlayerColor = b.white.username.toLowerCase() === username.toLowerCase() ? 'white' : 'black';
      const aOpponentRating = (aPlayerColor === 'white' ? a.black.rating : a.white.rating) || 0;
      const bOpponentRating = (bPlayerColor === 'white' ? b.black.rating : b.white.rating) || 0;

      switch (sortBy) {
        case 'oldest':
          return a.end_time - b.end_time;
        case 'opponent-rating-desc':
          return bOpponentRating - aOpponentRating;
        case 'opponent-rating-asc':
          return aOpponentRating - bOpponentRating;
        case 'recent':
        default:
          return b.end_time - a.end_time;
      }
    });
  }, [filteredGames, sortBy, username]);

  const insights = useMemo(() => {
    if (sortedFilteredGames.length === 0) {
      return {
        winRate: 0,
        avgOpponentRating: 0,
        wins: 0,
        losses: 0,
        draws: 0,
      };
    }

    let wins = 0;
    let losses = 0;
    let draws = 0;
    let opponentRatingSum = 0;

    for (const game of sortedFilteredGames) {
      const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? 'white' : 'black';
      const playerData = playerColor === 'white' ? game.white : game.black;
      const opponentData = playerColor === 'white' ? game.black : game.white;
      const outcome = getOutcome(playerData.result);

      if (outcome === 'win') wins += 1;
      if (outcome === 'loss') losses += 1;
      if (outcome === 'draw') draws += 1;

      opponentRatingSum += opponentData.rating || 0;
    }

    return {
      winRate: Math.round((wins / sortedFilteredGames.length) * 100),
      avgOpponentRating: Math.round(opponentRatingSum / sortedFilteredGames.length),
      wins,
      losses,
      draws,
    };
  }, [sortedFilteredGames, username]);

  if (games.length === 0 && !isLoading) {
    return (
      <section className="ui-panel rounded-[28px] p-10 text-center">
        <h3 className="ui-heading text-xl font-bold">No recent games found</h3>
        <p className="ui-muted mt-2 text-sm">Try another account or check if the profile has public games.</p>
      </section>
    );
  }

  return (
    <section className="ui-panel rounded-[28px] p-6 md:p-8">
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="ui-heading text-xl font-bold md:text-2xl">Recent Games</h3>
            <p className="ui-muted text-sm">Pick a game to open move-by-move engine analysis.</p>
          </div>

          <label className="text-sm font-semibold text-[var(--text-muted)]">
            Sort
            <select
              className="ui-input ml-2 rounded-xl px-3 py-2 text-sm"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as GameSort)}
            >
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest</option>
              <option value="opponent-rating-desc">Highest-rated opponents</option>
              <option value="opponent-rating-asc">Lowest-rated opponents</option>
            </select>
          </label>
        </div>

        <GameFilterComponent onFilterChange={setGameFilter} />

        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Wins', value: 'win' },
            { label: 'Losses', value: 'loss' },
            { label: 'Draws', value: 'draw' },
          ].map(({ label, value }) => (
            <button
              key={value}
              type="button"
              className={`ui-chip px-3 py-1 text-xs font-semibold ${filterResult === value ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : ''}`}
              onClick={() => setFilterResult(filterResult === value ? '' : value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 rounded-2xl bg-[var(--accent-soft)] p-3 text-sm md:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Shown</p>
            <p className="font-bold text-[var(--text)]">{sortedFilteredGames.length} / {games.length}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Win rate</p>
            <p className="font-bold text-[var(--text)]">{insights.winRate}%</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">W / L / D</p>
            <p className="font-bold text-[var(--text)]">{insights.wins} / {insights.losses} / {insights.draws}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Avg Opponent</p>
            <p className="font-bold text-[var(--text)]">{insights.avgOpponentRating || '-'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedFilteredGames.map((game: ChessGame) => {
          const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? 'white' : 'black';
          const playerData = playerColor === 'white' ? game.white : game.black;
          const opponentData = playerColor === 'white' ? game.black : game.white;
          const outcome = getOutcome(playerData.result);

          return (
            <button
              key={game.uuid || game.url}
              onClick={() => onGameSelect(game)}
              className="ui-panel-subtle group flex h-full flex-col gap-4 rounded-2xl p-4 text-left transition-transform duration-200 hover:-translate-y-1"
              type="button"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Calendar className="h-4 w-4" />
                    {formatDate(game.end_time)}
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Clock3 className="h-4 w-4" />
                    {game.time_class}
                  </div>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getOutcomeBadge(outcome)}`}>
                  {outcome}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={playerColor === 'white' ? whiteBishop : blackBishop} alt={`${playerColor} bishop`} className="h-7 w-7" />
                    <span className="font-semibold text-[var(--text)]">{playerData.username}</span>
                  </div>
                  <span className="ui-badge px-2 py-1 text-xs font-semibold">{playerData.rating}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={playerColor === 'white' ? blackBishop : whiteBishop}
                      alt={`${playerColor === 'white' ? 'black' : 'white'} bishop`}
                      className="h-7 w-7"
                    />
                    <span className="text-sm text-[var(--text-muted)]">{opponentData.username}</span>
                  </div>
                  <span className="ui-badge px-2 py-1 text-xs font-semibold">{opponentData.rating}</span>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between text-sm font-semibold text-[var(--accent)]">
                <span className="inline-flex items-center gap-2">
                  <Swords className="h-4 w-4" />
                  Open analysis
                </span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
