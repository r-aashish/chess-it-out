import React, { useState } from "react";
import { ChessGame } from "../types/chess";
import { Calendar, ChevronRight } from "./icons";
import whiteBishop from "/images/white-bishop.png";
import blackBishop from "/images/black-bishop.png";
import { formatDate } from "../utils/date";

interface GamesListProps {
  games: ChessGame[];
  username: string;
  onGameSelect: (game: ChessGame) => void;
  isLoading: boolean;
}

export const GamesList: React.FC<GamesListProps> = ({ games, username, onGameSelect, isLoading }) => {
  const [filterResult, setFilterResult] = useState<string>("");

  const getResultColor = (result: string): string => {
    const colorMap: { [key: string]: string } = {
      win: "bg-emerald-500 text-white",
      checkmated: "bg-rose-500 text-white",
      resigned: "bg-rose-500 text-white",
      timeout: "bg-rose-500 text-white",
      stalemate: "bg-zinc-500 text-white",
      draw: "bg-zinc-500 text-white",
      agreed: "bg-zinc-500 text-white",
      repetition: "bg-zinc-500 text-white",
      insufficient: "bg-zinc-500 text-white",
      "50move": "bg-zinc-500 text-white",
      timevsinsufficient: "bg-zinc-500 text-white",
    };
    return colorMap[result] || "bg-zinc-500 text-white";
  };

  const filteredGames = filterResult
    ? games.filter((game: ChessGame) => {
        if (game.initialFen) return false;
        const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
        const playerData = playerColor === "white" ? game.white : game.black;
        const result = playerData.result.toLowerCase();
        switch (filterResult) {
          case "win": return result === "win";
          case "loss": return ["checkmated", "resigned", "timeout"].includes(result);
          case "draw": return ["stalemate", "draw", "agreed", "repetition", "insufficient", "50move", "timevsinsufficient"].includes(result);
          default: return true;
        }
      })
    : games.filter((game: ChessGame) => !game.initialFen);

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
        {filteredGames.map((game: ChessGame, index: number) => {
          const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
          const playerData = playerColor === "white" ? game.white : game.black;
          const opponentData = playerColor === "white" ? game.black : game.white;

          return (
            <button
              key={index}
              onClick={() => onGameSelect(structuredClone(game))}
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