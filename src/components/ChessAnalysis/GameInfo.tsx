import React, { useMemo } from 'react';
import { ChessGame } from '../../types/chess';
import { X, Clock, Trophy, Calendar } from '../icons';
import { format } from 'date-fns';
import { detectOpening, getOpeningDescription } from '../../utils/openings';
import { BookOpen } from 'lucide-react';

/**
 * GameInfoProps interface defines the props for the GameInfo component.
 * It includes properties for the chess game details, a function to close the game info panel,
 * and the move history of the game.
 */
interface GameInfoProps {
  game: ChessGame;
  onClose: () => void;
  moveHistory: string[];
}

/**
 * GameDetailRow component is a reusable component for displaying game detail rows.
 * It takes an icon, label, and value as props and renders them in a consistent format.
 */
const GameDetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
      {icon}
      <span>{label}</span>
    </div>
    <p className="font-medium text-white">{value}</p>
  </div>
);

/**
 * GameInfo component displays detailed information about a chess game.
 * It includes the game's time control, game type, played date, player usernames,
 * result, opening, and number of moves.
 */
export const GameInfo: React.FC<GameInfoProps> = ({ game, onClose, moveHistory }) => {
  // Format the game end time safely
  const playedOn = game.end_time
    ? format(new Date(game.end_time * 1000), 'MMMM dd, yyyy')
    : 'Unknown Date';

  const numberOfMoves = moveHistory?.length || 'Unknown';

  // Detect opening
  const opening = useMemo(() => {
    return detectOpening(game.pgn);
  }, [game.pgn]);

  // Define game details
  const details = [
    {
      icon: <Clock className="w-4 h-4" />,
      label: 'Time Control',
      value: () => game.time_control || 'Unknown',
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      label: 'Game Type',
      value: () => `${game.time_class || 'Unknown'} ${game.rated ? 'Rated' : 'Unrated'}`,
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Played On',
      value: () => playedOn,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path fillRule="evenodd" d="..." clipRule="evenodd" />
        </svg>
      ),
      label: 'White',
      value: () => game.white?.username || 'Unknown',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path fillRule="evenodd" d="..." clipRule="evenodd" />
        </svg>
      ),
      label: 'Black',
      value: () => game.black?.username || 'Unknown',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="..." />
        </svg>
      ),
      label: 'Result',
      value: () => game.result || 'Unknown',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path fillRule="evenodd" d="..." clipRule="evenodd" />
        </svg>
      ),
      label: 'Opening',
      value: () => opening ? `${opening.name} (${opening.eco})` : game.opening || 'Unknown',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="..." strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      label: 'Number of Moves',
      value: () => numberOfMoves.toString(),
    },
  ];

  return (
    <div className="absolute inset-y-0 right-0 w-80 border-l border-[#403D39] p-4">
      <div className="game-info-container bg-[#272522]">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Game Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#403D39] transition-colors"
            aria-label="Close game details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Details */}
        <div className="space-y-6">
          {details.map((detail, index) => (
            <GameDetailRow
              key={index}
              icon={detail.icon}
              label={detail.label}
              value={detail.value()}
            />
          ))}
          
          {/* Opening Description */}
          {opening && (
            <div className="mt-4 p-3 bg-[#1b1b1b] rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                <BookOpen className="w-4 h-4" />
                <span>About this opening</span>
              </div>
              <p className="text-sm text-gray-300">{getOpeningDescription(opening.name)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
