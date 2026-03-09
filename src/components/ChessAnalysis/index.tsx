import React, { useState, useCallback, useEffect } from 'react';
import { ChessBoardDisplay } from './ChessBoardDisplay';
import { useChessEngine } from '../../hooks/useChessEngine';
import { EvaluationBar } from './EvaluationBar';
import { MoveList } from './MoveList';
import { useChessboard } from '../../hooks/useChessboard';
import { GameInfo } from './GameInfo';
import { ChessGame, Move } from '../../types/chess';
import { X, ChevronLeft, Info } from '../icons';
import LlmFeedback from './LlmFeedback';
import { KeyboardShortcutsModal } from '../KeyboardShortcutsModal';
import { ExportGame } from '../ExportGame';
import { Keyboard, Sparkle } from 'lucide-react';

interface ChessAnalysisProps {
  game: ChessGame;
  onClose: () => void;
  username?: string;
}

export const ChessAnalysis: React.FC<ChessAnalysisProps> = ({ game, onClose, username }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [boardWidth, setBoardWidth] = useState(630);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);

  const normalizedUsername = username?.toLowerCase();
  const playerColor: 'white' | 'black' =
    normalizedUsername && game.black.username.toLowerCase() === normalizedUsername ? 'black' : 'white';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBoardWidth(Math.max(280, window.innerWidth - 38));
      } else if (window.innerWidth < 1200) {
        setBoardWidth(520);
      } else {
        setBoardWidth(630);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const captureArrows: [import('chess.js').Square, import('chess.js').Square][] = [];
  const isCheckmate = false;

  const handleMovesChange = useCallback((newMoves: Move[]) => {
    if (!newMoves.length) setFeedback([]);
  }, []);

  const {
    chess,
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
    moveHistory,
  } = useChessboard({
    initialFen: game.fen,
    pgn: game.pgn,
    initialOrientation: playerColor,
    onMovesChange: handleMovesChange,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && chessboardCurrentMove > 0) {
        handleGoToMove(chessboardCurrentMove - 1);
      } else if (event.key === 'ArrowRight' && chessboardCurrentMove < moveHistoryLength) {
        handleGoToMove(chessboardCurrentMove + 1);
      } else if (event.key === 'f' || event.key === 'F') {
        setBoardOrientation((previous) => (previous === 'white' ? 'black' : 'white'));
      } else if (event.key === 'Escape') {
        if (showKeyboardShortcuts) setShowKeyboardShortcuts(false);
        else if (showInfo) setShowInfo(false);
        else onClose();
      } else if (event.key === '?' && event.shiftKey) {
        setShowKeyboardShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    chessboardCurrentMove,
    handleGoToMove,
    moveHistoryLength,
    onClose,
    setBoardOrientation,
    showInfo,
    showKeyboardShortcuts,
  ]);

  const { evaluation, bestMove, bestMoveArrow, mateIn } = useChessEngine(fen);

  return (
    <div className="analysis-shell fixed inset-0 z-50 flex h-screen flex-col overflow-hidden">
      <header className="analysis-header mobile-header flex items-center justify-between px-4 py-3 text-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="analysis-control-btn rounded-xl p-2" type="button">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="mobile-header-text text-lg font-bold">Game Analysis</h2>
            <p className="text-xs text-slate-400">{game.white.username} vs {game.black.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyboardShortcuts(true)}
            className="analysis-control-btn rounded-xl p-2"
            title="Keyboard Shortcuts"
            type="button"
          >
            <Keyboard className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowInfo((previous) => !previous)}
            className="analysis-control-btn rounded-xl p-2"
            title="Game info"
            type="button"
          >
            {showInfo ? <X className="h-5 w-5" /> : <Info className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="analysis-content flex flex-1 items-center justify-center gap-5 overflow-hidden p-6">
        <div className="analysis-board-column flex flex-col" style={{ alignItems: boardOrientation === 'white' ? 'flex-start' : 'flex-end' }}>
          {bestMove ? (
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-400/18 px-3 py-1 text-xs font-semibold text-orange-200">
              <Sparkle className="h-3.5 w-3.5" />
              Engine suggestion: {bestMove}
            </p>
          ) : null}

          <div
            className={`mb-2 flex items-center gap-2 ${boardOrientation === 'black' ? 'self-start' : 'self-end'}`}
          >
            <img
              src={boardOrientation === 'black' ? game.white.avatar || '/images/white-cat.jpeg' : game.black.avatar || '/images/black-cat.webp'}
              alt="opponent avatar"
              className="mobile-avatar h-10 w-10 rounded-full border border-slate-500/50 object-cover"
            />
            <div className="text-right text-slate-100">
              <p className="mobile-username text-xs font-semibold">
                {boardOrientation === 'black' ? game.white.username : game.black.username}
              </p>
              <p className="mobile-username text-[11px] text-slate-400">
                ({boardOrientation === 'black' ? game.white.rating : game.black.rating})
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <EvaluationBar evaluation={evaluation} boardWidth={boardWidth} mateIn={mateIn} />
            <div className="chessboard-wrapper rounded-xl border border-slate-600/40 bg-slate-950/40 p-2 shadow-2xl">
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

          <div className={`mt-2 flex items-center gap-2 ${boardOrientation === 'black' ? 'self-start' : 'self-end'}`}>
            <img
              src={boardOrientation === 'black' ? game.black.avatar || '/images/black-cat.webp' : game.white.avatar || '/images/white-cat.jpeg'}
              alt="player avatar"
              className="mobile-avatar h-10 w-10 rounded-full border border-slate-500/50 object-cover"
            />
            <div className="text-right text-slate-100">
              <p className="mobile-username text-xs font-semibold">
                {boardOrientation === 'black' ? game.black.username : game.white.username}
              </p>
              <p className="mobile-username text-[11px] text-slate-400">
                ({boardOrientation === 'black' ? game.black.rating : game.white.rating})
              </p>
            </div>
          </div>
        </div>

        <div className="analysis-side-column flex w-full max-w-[460px] flex-col gap-4">
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
            pieceColor={playerColor}
            onFeedbackUpdate={setFeedback}
          />

          <ExportGame game={game} feedback={feedback} />
        </div>

        {showInfo ? (
          <div className="analysis-info-panel w-80">
            <GameInfo game={game} onClose={() => setShowInfo(false)} moveHistory={moveHistory} />
          </div>
        ) : null}
      </div>

      <KeyboardShortcutsModal isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} />
    </div>
  );
};
