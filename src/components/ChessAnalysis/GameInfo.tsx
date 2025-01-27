import React from 'react';
import { ChessGame } from '../../types/chess';
import { X, Clock, Trophy, Calendar } from '../icons';
import { format } from 'date-fns';

interface GameInfoProps {
  game: ChessGame;
  onClose: () => void;
  moveHistory: string[];
}

// Reusable component for game detail rows
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

export const GameInfo: React.FC<GameInfoProps> = ({ game, onClose, moveHistory }) => {
  // Format the game end time safely
  const playedOn = game.end_time
    ? format(new Date(game.end_time * 1000), 'MMMM dd, yyyy')
    : 'Unknown Date';

  const numberOfMoves = moveHistory?.length || 'Unknown';

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
      value: () => game.opening || 'Unknown',
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
        </div>
      </div>
    </div>
  );
};
