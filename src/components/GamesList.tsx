import React, { useMemo, useState } from "react";
import { ChessGame } from "../types/chess";
import { Calendar, ChevronRight } from "./icons";
import whiteBishop from "/images/white-bishop.png";
import blackBishop from "/images/black-bishop.png";
import { formatDate } from "../utils/date";
import { GameFilterComponent, GameFilter } from "./GameFilter";

interface GamesListProps {
  games: ChessGame[];
  username: string;
  onGameSelect: (game: ChessGame) => void;
  isLoading: boolean;
}

type GameSort = 'recent' | 'oldest' | 'opponent-rating-desc' | 'opponent-rating-asc';

const LOSS_RESULTS = new Set(["checkmated", "resigned", "timeout", "lose", "abandoned"]);
const DRAW_RESULTS = new Set(["stalemate", "draw", "agreed", "repetition", "insufficient", "50move", "timevsinsufficient"]);

const getOutcome = (result: string): 'win' | 'loss' | 'draw' => {
  const normalized = result.toLowerCase();
  if (normalized === 'win') return 'win';
  if (LOSS_RESULTS.has(normalized)) return 'loss';
  if (DRAW_RESULTS.has(normalized)) return 'draw';
  return 'draw';
};

export const GamesList: React.FC<GamesListProps> = ({ games, username, onGameSelect, isLoading }) => {
  const [filterResult, setFilterResult] = useState<string>("");
  const [gameFilter, setGameFilter] = useState<GameFilter>({
    search: '',
    result: 'all',
    timeControl: 'all',
  });
  const [sortBy, setSortBy] = useState<GameSort>('recent');

  const getResultColor = (result: string): string => {
    const outcome = getOutcome(result);
    if (outcome === 'win') return "bg-emerald-500 text-white";
    if (outcome === 'loss') return "bg-rose-500 text-white";
    return "bg-zinc-500 text-white";
  };

  const getTimeControl = (timeClass: string): string => {
    const timeMap: { [key: string]: string } = {
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

      const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
      const opponentUsername = playerColor === "white" ? game.black.username : game.white.username;
      const playerData = playerColor === "white" ? game.white : game.black;
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
      const aPlayerColor = a.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
      const bPlayerColor = b.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
      const aOpponentRating = (aPlayerColor === "white" ? a.black.rating : a.white.rating) || 0;
      const bOpponentRating = (bPlayerColor === "white" ? b.black.rating : b.white.rating) || 0;

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
      const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
      const playerData = playerColor === "white" ? game.white : game.black;
      const opponentData = playerColor === "white" ? game.black : game.white;
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
      <div className="flex items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">No recent games found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-0">
      {/* Header with Filters */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          Recent Games
        </h2>
        
        {/* New Filter Component */}
        <GameFilterComponent onFilterChange={setGameFilter} />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing {sortedFilteredGames.length} / {games.length} games
            {sortedFilteredGames.length > 0 && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                Win rate {insights.winRate}% | W/L/D {insights.wins}/{insights.losses}/{insights.draws} | Avg opp. {insights.avgOpponentRating}
              </span>
            )}
          </div>

          <label className="text-sm text-gray-600 dark:text-gray-300">
            Sort by{" "}
            <select
              className="ml-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as GameSort)}
            >
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest</option>
              <option value="opponent-rating-desc">Toughest opponents</option>
              <option value="opponent-rating-asc">Easiest opponents</option>
            </select>
          </label>
        </div>
        
        {/* Legacy Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Wins", value: "win", base: "bg-emerald-100 text-emerald-700", active: "bg-emerald-600 text-white" },
            { label: "Losses", value: "loss", base: "bg-rose-100 text-rose-700", active: "bg-rose-600 text-white" },
            { label: "Draws", value: "draw", base: "bg-zinc-100 text-zinc-700", active: "bg-zinc-600 text-white" },
          ].map(({ label, value, base, active }) => (
            <button
              key={value}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                filterResult === value ? active : `${base} hover:${active}`
              }`}
              onClick={() => setFilterResult(filterResult === value ? "" : value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {sortedFilteredGames.map((game: ChessGame) => {
          const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
          const playerData = playerColor === "white" ? game.white : game.black;
          const opponentData = playerColor === "white" ? game.black : game.white;

          return (
            <button
              key={game.uuid || game.url}
              onClick={() => onGameSelect(game)}
              className="group bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-xl hover:scale-105 hover:ring-2 hover:ring-indigo-300 dark:hover:ring-indigo-500 active:scale-[0.98] border border-gray-100 dark:border-gray-800 text-left w-full"
            >
              {/* Game Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(game.end_time)}
                  </span>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getResultColor(playerData.result)}`}>
                  {playerData.result.toUpperCase()}
                </span>
              </div>

              {/* Player Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={playerColor === "white" ? whiteBishop : blackBishop}
                      alt={`${playerColor} bishop`}
                      className="w-8 h-8"
                    />
                    <span className="font-semibold text-gray-800 dark:text-gray-100 text-base">
                      {playerData.username}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={playerColor === "white" ? blackBishop : whiteBishop}
                      alt={`${playerColor === "white" ? "black" : "white"} bishop`}
                      className="w-8 h-8"
                    />
                    <span className="text-gray-600 dark:text-gray-400 text-base">
                      {opponentData.username}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {opponentData.rating}
                  </span>
                </div>
              </div>

              {/* Analysis Prompt */}
              <div className="mt-4 flex items-center justify-end gap-1 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200">
                <span className="text-sm font-medium sm:text-xs">View Analysis</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
