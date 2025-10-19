import React from 'react';
import { Chessboard } from 'react-chessboard';
import { ChessGame } from '../../types/chess';
import { useGamePosition } from '../../hooks/useGamePosition';
import { EngineEvaluation } from './EngineEvaluation';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ChessBoardProps interface defines the props for the ChessBoard component.
 * It includes properties for the chess game details, a function to close the analysis,
 * and the username of the current user.
 */
interface ChessBoardProps {
  game: ChessGame;
  onClose: () => void;
  username: string;
}

/**
 * ChessBoard component displays a chessboard with the game's moves and engine evaluation.
 * It allows the user to navigate through the moves and see the engine's analysis.
 */
export const ChessBoard: React.FC<ChessBoardProps> = ({ game, onClose, username }) => {
  const { position, goToNext, goToPrev } = useGamePosition(game.pgn);
  const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
  const orientation = playerColor === "white" ? "white" : "black";

  return (
    <div className="fixed inset-0 bg-gray-900">
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold">
            {game.white.username} ({game.white.rating}) vs {game.black.username} ({game.black.rating})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close Analysis"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-3">
          {/* Chessboard Section */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl">
              <Chessboard
                position={position}
                boardWidth={Math.min(window.innerWidth, 800)} // Responsive width
                areArrowsAllowed
                customBoardStyle={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                }}
                boardOrientation={orientation}
              />
              {/* Move Navigation Controls */}
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={goToPrev}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                  aria-label="Previous Move"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                  aria-label="Next Move"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Engine Evaluation Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Engine Evaluation</h3>
            <div className="overflow-auto">
              <EngineEvaluation position={position} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
