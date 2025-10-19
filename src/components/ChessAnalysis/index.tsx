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
import { KeyboardShortcutsModal } from '../KeyboardShortcutsModal';
import { ExportGame } from '../ExportGame';
import { Keyboard } from 'lucide-react';

/**
 * ChessAnalysisProps interface defines the props for the ChessAnalysis component.
 * It includes properties for the chess game details, a function to close the analysis,
 * and the username of the current user.
 */
interface ChessAnalysisProps {
  game: ChessGame;
  onClose: () => void;
  username?: string;
}

/**
 * ChessAnalysis component is the main component for analyzing a chess game.
 * It displays the chessboard, move list, engine analysis, and game information.
 */
export const ChessAnalysis: React.FC<ChessAnalysisProps> = ({ game, onClose, username }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [chess] = useState(new Chess());
  const [boardWidth, setBoardWidth] = useState(630);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);

    useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBoardWidth(window.innerWidth - 40); // Adjust as needed
      } else {
        setBoardWidth(630);
      }
    };

    handleResize(); // Set initial width

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      } else if (event.key === 'f' || event.key === 'F') {
        setBoardOrientation(prev => prev === 'white' ? 'black' : 'white');
      } else if (event.key === 'Escape') {
        if (showKeyboardShortcuts) {
          setShowKeyboardShortcuts(false);
        } else if (showInfo) {
          setShowInfo(false);
        } else {
          onClose();
        }
      } else if (event.key === '?' && event.shiftKey) {
        setShowKeyboardShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [chessboardCurrentMove, handleGoToMove, moveHistoryLength, setBoardOrientation, showKeyboardShortcuts, showInfo, onClose]);

  const { evaluation, bestMove, bestMoveArrow } = useChessEngine(fen);

  return (
    <div className="fixed inset-0 bg-[#262421] flex flex-col h-screen overflow-hidden chess-analysis-container">
      <header className="bg-[#312e2b] text-white p-4 flex items-center justify-between border-b border-[#3d3d3d] mobile-header">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="hover:bg-[#3d3d3d] p-2 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h2 className="font-bold text-xl flex items-center mobile-header-text">
              Game Analysis
            </h2>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowKeyboardShortcuts(true)}
            className="hover:bg-[#3d3d3d] p-2 rounded-lg transition-colors"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="hover:bg-[#3d3d3d] p-2 rounded-lg transition-colors "
          >
            {showInfo ? <X className="w-6 h-6 text-white" /> : <Info className="w-6 h-6 text-white" />}
          </button>
        </div>
      </header>

      <div className="analysis-content flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-hidden justify-center items-center">
       {bestMove && <div className="text-left text-white text-sm mb-2 ml-6 mt-8">Engine Suggestion: {bestMove}</div>}
        <div
          className={`md:flex md:flex-col mr-6 ${
            boardOrientation === 'white' ? 'items-start' : 'items-end'
          } mobile-scale`}
        >
          <div
            className={`flex items-center ${
              boardOrientation === 'black' ? 'justify-start' : 'justify-end'
            } mb-2`}
          >
            <img
              src={
                boardOrientation === 'black'
                  ? game?.white?.avatar || '/images/white-cat.jpeg'
                  : game?.black?.avatar || '/images/black-cat.webp'
              }
              alt="opponent avatar"
              className="w-12 h-12 rounded-full mr-2 mobile-avatar"
            />
            <div className="text-white text-center">
              <p className="text-sm mobile-username">
                {boardOrientation === 'black' ? game?.white?.username : game?.black?.username}
              </p>
              <p className="text-xs text-[#AAAAAA] mobile-username">
                ({boardOrientation === 'black' ? game?.white?.rating : game?.black?.rating})
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <EvaluationBar evaluation={evaluation} boardWidth={boardWidth} />
            <div className="relative chessboard-wrapper">
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
          <div
            className={`flex items-center ${
              boardOrientation === 'black' ? 'justify-start' : 'justify-end'
            } mt-2`}
          >
            <img
              src={
                boardOrientation === 'black'
                  ? game?.black?.avatar || '/images/black-cat.webp'
                  : game?.white?.avatar || '/images/white-cat.jpeg'
              }
              alt="user avatar"
              className="w-12 h-12 rounded-full mr-2 mobile-avatar"
            />
            <div className="text-white text-center">
              <p className="text-sm mobile-username">
                {boardOrientation === 'black' ? game?.black?.username : game?.white?.username}
              </p>
              <p className="text-xs text-[#AAAAAA] mobile-username">
                ({boardOrientation === 'black' ? game?.white?.rating : game?.black?.rating})
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 ml-6 mobile-scale">
          <MoveList
            moves={moves}
            currentMove={chessboardCurrentMove}
            handleGoToMove={handleGoToMove}
            boardOrientation={boardOrientation}
            setBoardOrientation={setBoardOrientation}
            moveHistoryLength={moveHistoryLength}
          />
          <LlmFeedback
            game={game}
            currentMove={chessboardCurrentMove}
            username={username}
            pieceColor={boardOrientation === 'white' ? 'white' : 'black'}
            onFeedbackUpdate={setFeedback}
          />
          <ExportGame game={game} feedback={feedback} />
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

      <KeyboardShortcutsModal 
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
};
