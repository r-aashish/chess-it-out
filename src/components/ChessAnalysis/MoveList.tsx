import React from 'react';
import { Move } from '../../types/chess';
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
  moveHistoryLength,
}) => {
  return (
    <section className="analysis-card w-full max-w-[460px] p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Move List</p>
        <p className="text-xs text-slate-400">
          Move {currentMove} / {moveHistoryLength}
        </p>
      </div>

      <div className="mb-3 flex items-center justify-center gap-1 rounded-xl bg-slate-900/45 p-1">
        <button onClick={() => handleGoToMove(0)} className="analysis-control-btn rounded-lg p-2" type="button">
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleGoToMove(currentMove - 1)}
          disabled={currentMove === 0}
          className="analysis-control-btn rounded-lg p-2"
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white')}
          className="analysis-control-btn rounded-lg p-2"
          type="button"
        >
          <Flip className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleGoToMove(currentMove + 1)}
          disabled={currentMove >= moveHistoryLength}
          className="analysis-control-btn rounded-lg p-2"
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button onClick={() => handleGoToMove(moveHistoryLength)} className="analysis-control-btn rounded-lg p-2" type="button">
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>

      <div className="scrollbar-thin max-h-[250px] overflow-y-auto rounded-xl bg-slate-950/40 p-3">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[12px] move-list-mobile">
          {moves.map((move, index) => (
            <div key={`${move.moveNumber}-${move.white}-${move.black}`} className="whitespace-nowrap">
              <span className="mr-1 text-slate-500">{move.moveNumber}.</span>

                <button
                  type="button"
                  className={`rounded px-1.5 py-0.5 ${
                    currentMove === index * 2 + 1 ? 'bg-orange-400/20 text-orange-200' : 'text-slate-200 hover:bg-slate-700/40'
                  }`}
                  onClick={() => handleGoToMove(index * 2 + 1)}
                >
                {move.white}
              </button>

              {move.black ? (
                <button
                  type="button"
                  className={`ml-1 rounded px-1.5 py-0.5 ${
                    currentMove === index * 2 + 2 ? 'bg-orange-400/20 text-orange-200' : 'text-slate-200 hover:bg-slate-700/40'
                  }`}
                  onClick={() => handleGoToMove(index * 2 + 2)}
                >
                  {move.black}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
