import React, { useState } from "react";
import { ChessGame } from "../types/chess";
import { Calendar} from "./icons";
import whiteBishop from "/images/white-bishop.png"; // Import white bishop icon
import blackBishop from "/images/black-bishop.png"; // Import black bishop icon
import { formatDate } from "../utils/date";

/**
 * GamesListProps interface defines the props for the GamesList component.
 * It includes properties for the list of chess games, the username of the current user,
 * a function to handle game selection, and a boolean indicating whether the data is loading.
 */
interface GamesListProps {
  games: ChessGame[];
  username: string;
  onGameSelect: (game: ChessGame) => void;
  isLoading: boolean;
}

/**
 * GamesList component displays a list of recent chess games for a given user.
 * It allows the user to filter the games by result (win, loss, draw) and select a game to view.
 */
export const GamesList: React.FC<GamesListProps> = ({ games, username, onGameSelect }) => {
  const [filterResult, setFilterResult] = useState<string>("");

  /**
   * getResultColor function returns a CSS class name based on the game result.
   * The class name is used to color the result text.
   */
  const getResultColor = (result: string): string => {
    const colorMap: { [key: string]: string } = {
      win: "text-green-600 dark:text-green-400",
      checkmated: "text-red-600 dark:text-red-400",
      resigned: "text-red-600 dark:text-red-400",
      timeout: "text-red-600 dark:text-red-400",
      stalemate: "text-gray-600 dark:text-gray-400",
      draw: "text-gray-600 dark:text-gray-400",
      agreed: "text-gray-600 dark:text-gray-400",
      repetition: "text-gray-600 dark:text-gray-400",
      insufficient: "text-gray-600 dark:text-gray-400",
      "50move": "text-gray-600 dark:text-gray-400",
      timevsinsufficient: "text-gray-600 dark:text-gray-400",
    };
  
    return colorMap[result] || "text-gray-600 dark:text-gray-400";
  };

  const filteredGames = filterResult
    ? games.filter((game: ChessGame) => {
        if (game.initialFen) {
          return false; // Exclude Chess960 games
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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recent Games
        </h2>
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded bg-green-500 text-white ${
              filterResult === "win" ? "opacity-50" : ""
            }`}
            onClick={() => setFilterResult("win")}
          >
            Win
          </button>
          <button
            className={`px-4 py-2 rounded bg-red-500 text-white ${
              filterResult === "loss" ? "opacity-50" : ""
            }`}
            onClick={() => setFilterResult("loss")}
          >
            Loss
          </button>
          <button
            className={`px-4 py-2 rounded bg-gray-500 text-white ${
              filterResult === "draw" ? "opacity-50" : ""
            }`}
            onClick={() => setFilterResult("draw")}
          >
            Draw
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white"
            onClick={() => setFilterResult("")}
          >
            All
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map((game: ChessGame, index: number) => {
          const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
          const playerData = playerColor === "white" ? game.white : game.black;
          const opponentData = playerColor === "white" ? game.black : game.white;

          return (
            <div
              key={index}
              onClick={() => onGameSelect(structuredClone(game))}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              {/* Date */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {formatDate(game.end_time)}
                  </span>
                </div>
              </div>

              {/* Player and Result */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={playerColor === "white" ? whiteBishop : blackBishop} // Use chess piece icon
                      alt={`${playerColor} piece`}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {playerData.username}
                    </span>
                  </div>
                  <div
                    className={`flex items-center space-x-1 font-medium ${getResultColor(playerData.result)}`}
                  >
                    <span>{playerData.result.toUpperCase()}</span>
                  </div>
                </div>

                {/* Opponent and Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={playerColor === "white" ? blackBishop : whiteBishop} // Use chess piece icon
                      alt={`${playerColor === "white" ? "black" : "white"} piece`}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {opponentData.username}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    Rating: {opponentData.rating}
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
