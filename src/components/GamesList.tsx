import React, { useState } from "react";
import { ChessGame } from "../types/chess";
import { Calendar } from "./icons";
import whiteBishop from "/images/white-bishop.png";
import blackBishop from "/images/black-bishop.png";
import { formatDate } from "../utils/date";

interface GamesListProps {
  games: ChessGame[];
  username: string;
  onGameSelect: (game: ChessGame) => void;
  isLoading: boolean;
}

export const GamesList: React.FC<GamesListProps> = ({ games, username, onGameSelect }) => {
  const [filterResult, setFilterResult] = useState<string>("");

  const getResultColor = (result: string): string => {
    const colorMap: { [key: string]: string } = {
      win: "text-green-600 dark:text-green-400 font-semibold",
      checkmated: "text-red-600 dark:text-red-400 font-semibold",
      resigned: "text-red-600 dark:text-red-400 font-semibold",
      timeout: "text-red-600 dark:text-red-400 font-semibold",
      stalemate: "text-gray-600 dark:text-gray-400 font-semibold",
      draw: "text-gray-600 dark:text-gray-400 font-semibold",
      agreed: "text-gray-600 dark:text-gray-400 font-semibold",
      repetition: "text-gray-600 dark:text-gray-400 font-semibold",
      insufficient: "text-gray-600 dark:text-gray-400 font-semibold",
      "50move": "text-gray-600 dark:text-gray-400 font-semibold",
      timevsinsufficient: "text-gray-600 dark:text-gray-400 font-semibold",
    };
  
    return colorMap[result] || "text-gray-600 dark:text-gray-400 font-semibold";
  };

  const filteredGames = filterResult
    ? games.filter((game: ChessGame) => {
        if (game.initialFen) {
          return false;
        }
        const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
        const playerData = playerColor === "white" ? game.white : game.black;
        const result = playerData.result.toLowerCase();
        switch (filterResult) {
          case "win":
            return result === "win";
          case "loss":
            return ["checkmated", "resigned", "timeout"].includes(result);
          case "draw":
            return ["stalemate", "draw", "agreed", "repetition", "insufficient", "50move", "timevsinsufficient"].includes(result);
          default:
            return true;
        }
      })
    : games.filter((game: ChessGame) => !game.initialFen);

  if (games.length === 0) {
    return (
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-600 dark:text-gray-400">No recent games found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recent Games
        </h2>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-full transition-all ${
              filterResult === "win"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-600 hover:bg-green-500 hover:text-white"
            }`}
            onClick={() => setFilterResult(filterResult === "win" ? "" : "win")}
          >
            Win
          </button>
          <button
            className={`px-4 py-2 rounded-full transition-all ${
              filterResult === "loss"
                ? "bg-red-500 text-white"
                : "bg-red-100 text-red-600 hover:bg-red-500 hover:text-white"
            }`}
            onClick={() => setFilterResult(filterResult === "loss" ? "" : "loss")}
          >
            Loss
          </button>
          <button
            className={`px-4 py-2 rounded-full transition-all ${
              filterResult === "draw"
                ? "bg-gray-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-500 hover:text-white"
            }`}
            onClick={() => setFilterResult(filterResult === "draw" ? "" : "draw")}
          >
            Draw
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map((game: ChessGame, index: number) => {
          const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
          const playerData = playerColor === "white" ? game.white : game.black;
          const opponentData = playerColor === "white" ? game.black : game.white;

          return (
            <div
              key={index}
              onClick={() => onGameSelect(structuredClone(game))}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 cursor-pointer transform transition-all duration-200 hover:scale-102 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(game.end_time)}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getResultColor(playerData.result)}`}>
                  {playerData.result.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={playerColor === "white" ? whiteBishop : blackBishop}
                      alt={`${playerColor} piece`}
                      className="w-6 h-6"
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {playerData.username}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={playerColor === "white" ? blackBishop : whiteBishop}
                      alt={`${playerColor === "white" ? "black" : "white"} piece`}
                      className="w-6 h-6"
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      {opponentData.username}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {opponentData.rating}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};