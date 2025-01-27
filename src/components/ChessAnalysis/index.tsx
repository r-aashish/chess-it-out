// index.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { ChessBoardDisplay } from './ChessBoardDisplay';
import { useChessEngine } from '../../hooks/useChessEngine';
import { EvaluationBar } from './EvaluationBar';
import { MoveList } from './MoveList';
import { useChessboard } from '../../hooks/useChessboard';
import { GameInfo } from './GameInfo';
import { Chess } from 'chess.js';
import { ChessGame, Move } from '../../types/chess';
import { X, ChevronLeft, Info } from '../icons';
import LlmFeedback from './LlmFeedback';
import EngineAnalysis from './EngineAnalysis';

interface ChessAnalysisProps {
  game: ChessGame;
  onClose: () => void;
  username?: string;
}

export const ChessAnalysis: React.FC<ChessAnalysisProps> = ({ game, onClose, username }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [chess] = useState(new Chess());
  const [feedback, setFeedback] = useState<string[]>([]);
  
  const boardWidth = 630;
  const captureArrows: [import("chess.js").Square, import("chess.js").Square][] = [];
  const isCheckmate = false;

  const handleMovesChange = useCallback((newMoves: Move[]) => {
    console.log('Moves updated:', newMoves);
  }, []);

  const {
    fen,
    validMoves,
    lastMove,
    lastClickedPiece,
    boardOrientation,
    handleSquareClick,
    handleGoToMove,
    setBoardOrientation,
    currentMove: chessboardCurrentMove,
    moveHistoryLength,
    moves,
    moveHistory
  } = useChessboard({
    initialFen: game.fen,
    pgn: game.pgn,
    onMovesChange: handleMovesChange,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        if (chessboardCurrentMove > 0) {
          handleGoToMove(chessboardCurrentMove - 1);
        }
      } else if (event.key === 'ArrowRight') {
        if (chessboardCurrentMove < moveHistoryLength) {
          handleGoToMove(chessboardCurrentMove + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [chessboardCurrentMove, handleGoToMove, moveHistoryLength]);

  const { evaluation, bestMove, bestMoveArrow } = useChessEngine(fen);

  return (
    <div className="fixed inset-0 bg-[#262421] flex flex-col h-screen overflow-hidden">
      <header className="bg-[#312e2b] text-white p-4 flex items-center justify-between border-b border-[#3d3d3d]">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="hover:bg-[#3d3d3d] p-2 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h2 className="font-bold text-xl flex items-center">
              Game Analysis
            </h2>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="hover:bg-[#3d3d3d] p-2 rounded-lg transition-colors"
        >
          {showInfo ? <X className="w-6 h-6 text-white" /> : <Info className="w-6 h-6 text-white" />}
        </button>
      </header>

      <div className="flex-1 flex p-6 gap-6 overflow-hidden justify-center items-center">
        <div className={`flex flex-col mr-6 ${boardOrientation === 'white' ? 'items-start' : 'items-end'}`}>
          <div className={`flex items-center ${boardOrientation === 'white' ? 'justify-start' : 'justify-end'} mb-2`}>
            <img src={boardOrientation === 'white' ? (game?.white?.avatar || "/images/white-cat.jpeg") : (game?.black?.avatar || "/images/black-cat.webp")} alt="white avatar" className="w-12 h-12 rounded-full mr-2" />
            <div className="text-white text-center">
              <p className="text-sm">{boardOrientation === 'white' ? game?.white?.username : game?.black?.username}</p>
              <p className="text-xs text-[#AAAAAA]">({boardOrientation === 'white' ? game?.white?.rating : game?.black?.rating})</p>
            </div>
          </div>
          <div className="flex gap-4">
            <EvaluationBar evaluation={evaluation} boardWidth={boardWidth} />
            <div className="relative">
              <ChessBoardDisplay
                fen={fen}
                width={boardWidth}
                handleSquareClick={handleSquareClick}
                captureArrows={captureArrows}
                bestMoveArrow={bestMoveArrow}
                validMoves={validMoves}
                lastMove={lastMove}
                isCheckmate={isCheckmate}
                boardOrientation={boardOrientation}
                chess={chess}
                lastClickedPiece={lastClickedPiece}
              />
            </div>
          </div>
          <div className={`flex items-center ${boardOrientation === 'white' ? 'justify-start' : 'justify-end'} mt-2`}>
            <img src={boardOrientation === 'white' ? (game?.black?.avatar || "/images/black-cat.webp") : (game?.white?.avatar || "/images/white-cat.jpeg")} alt="black avatar" className="w-12 h-12 rounded-full mr-2" />
             <div className="text-white text-center">
              <p className="text-sm">{boardOrientation === 'white' ? game?.black?.username : game?.white?.username}</p>
              <p className="text-xs text-[#AAAAAA]">({boardOrientation === 'white' ? game?.black?.rating : game?.white?.rating})</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 ml-6" style={{ width: '405px' }}>
          <MoveList
            moves={moves}
            currentMove={chessboardCurrentMove}
            handleGoToMove={handleGoToMove}
            boardOrientation={boardOrientation}
            setBoardOrientation={setBoardOrientation}
            moveHistoryLength={moveHistoryLength}
          />
          <EngineAnalysis 
            bestMove={bestMove}
            currentMove={chessboardCurrentMove}
            moves={moves}
          />
          <LlmFeedback
            game={game}
            currentMove={chessboardCurrentMove}
            setFeedback={setFeedback}
            username={username}
            pieceColor={boardOrientation === 'white' ? 'white' : 'black'}
          />
        </div>

        {showInfo && (
          <div className="w-80 ml-6 bg-[#312e2b] p-4 rounded-lg shadow-xl">
            <GameInfo
              game={game}
              onClose={() => setShowInfo(false)}
              moveHistory={moveHistory}
            />
          </div>
        )}
      </div>
    </div>
  );
};
