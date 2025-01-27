// Moves.tsx
import React from 'react';
import { ChessGame, Move } from '../../types/chess';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Flip } from '../icons';

interface MoveListProps {
  moves: Move[];
  currentMove: number;
  handleGoToMove: (moveNumber: number) => void;
  boardOrientation: 'white' | 'black';
  setBoardOrientation: React.Dispatch<React.SetStateAction<'white' | 'black'>>;
  moveHistoryLength: number;
}

export const MoveList: React.FC<MoveListProps> = ({
  moves,
  currentMove,
  handleGoToMove,
  boardOrientation,
  setBoardOrientation,
  moveHistoryLength
}) => {
  return (
    <div className="flex flex-col gap-2" style={{ width: '450px' }}>
      <div className="h-9 bg-[#1b1b1b] rounded-sm flex items-center justify-center gap-1 shrink-0">
        <button
          onClick={() => handleGoToMove(0)}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded transition-colors"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleGoToMove(currentMove - 1)}
          disabled={currentMove === 0}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white')}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded transition-colors"
        >
          <Flip className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleGoToMove(currentMove + 1)}
          disabled={currentMove >= moveHistoryLength}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleGoToMove(moveHistoryLength)}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded transition-colors"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-[#1b1b1b] rounded-sm overflow-hidden h-[200px]">
        <div className="p-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1b1b1b]">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {moves && moves.map((move, index) => (
              <div key={index}>
                <div className="flex items-center text-[11px] whitespace-nowrap">
                  <span className="text-gray-500 font-mono mr-1">{move.moveNumber}.</span>
                  <span
                    className={`cursor-pointer px-1 rounded ${
                      currentMove === index * 2 + 1 
                        ? 'bg-[#3a3a3a] text-white' 
                        : 'text-white hover:bg-[#2b2b2b]'
                    }`}
                    onClick={() => handleGoToMove(index * 2 + 1)}
                  >
                    {move.white}
                  </span>
                  {move.black && (
                    <span
                      className={`cursor-pointer px-1 ml-1 rounded ${
                        currentMove === index * 2 + 2 
                          ? 'bg-[#3a3a3a] text-white' 
                          : 'text-white hover:bg-[#2b2b2b]'
                      }`}
                      onClick={() => handleGoToMove(index * 2 + 2)}
                    >
                      {move.black}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};