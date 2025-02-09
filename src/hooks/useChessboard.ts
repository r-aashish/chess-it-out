import { useState, useCallback, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { Move } from '../types/chess';

/**
 * UseChessboardProps interface defines the props for the useChessboard hook.
 * It includes properties for the initial FEN, PGN, a function to handle move changes,
 * and an optional function to handle current move changes.
 */
interface UseChessboardProps {
  initialFen?: string;
  pgn?: string;
  onMovesChange: (moves: Move[]) => void;
  onCurrentMoveChange?: (currentMove: number) => void;
}

/**
 * UseChessboardReturn interface defines the return type for the useChessboard hook.
 * It includes properties for the chess game, FEN, valid moves, last move, last clicked piece,
 * board orientation, functions to handle square clicks and going to a specific move,
 * the current move number, move history length, and the move history.
 */
interface UseChessboardReturn {
  chess: Chess;
  fen: string;
  validMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  lastClickedPiece: Square | null;
  boardOrientation: 'white' | 'black';
  handleSquareClick: (square: Square) => void;
  setBoardOrientation: React.Dispatch<React.SetStateAction<'white' | 'black'>>;
  handleGoToMove: (moveNumber: number) => void;
  currentMove: number;
  moveHistoryLength: number;
  moves: Move[];
  moveHistory: string[];
}

/**
 * useChessboard hook manages the state and logic for a chessboard component.
 * It handles loading PGN, move validation, square clicks, and move history.
 */
export const useChessboard = ({ initialFen, pgn, onMovesChange, onCurrentMoveChange }: UseChessboardProps): UseChessboardReturn => {
  const [chess] = useState(() => {
    return new Chess();
  });
  const [fen, setFen] = useState(initialFen || chess.fen());
  const [currentMove, setCurrentMove] = useState(0);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [lastClickedPiece, setLastClickedPiece] = useState<Square | null>(null);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');

  useEffect(() => {
    if (pgn) {
      chess.loadPgn(pgn);
      const history = chess.history();
      setMoveHistory(history);

      const pairedMoves: Move[] = [];
      for (let i = 0; i < history.length; i += 2) {
        pairedMoves.push({
          moveNumber: Math.floor(i / 2) + 1,
          white: history[i],
          black: history[i + 1] || '',
        });
      }
      setMoves(pairedMoves);
      onMovesChange(pairedMoves);
      chess.reset();
      setFen(chess.fen());
      setCurrentMove(0);
      if (onCurrentMoveChange) {
        onCurrentMoveChange(0);
      }
    }
  }, [pgn, onMovesChange, onCurrentMoveChange]);

  const handleSquareClick = (square: Square) => {
    const piece = chess.get(square);

    if (piece && piece.color === chess.turn()) {
      const moves = chess.moves({ square, verbose: true });
      setValidMoves(moves.map(move => move.to as Square));
    } else {
      const move = validMoves.includes(square) && chess.move({
        from: lastClickedPiece as Square,
        to: square,
        promotion: 'q'
      });

      if (move) {
        setFen(chess.fen());
        setCurrentMove(currentMove + 1);
        if (onCurrentMoveChange) {
          onCurrentMoveChange(currentMove + 1);
        }
        setLastMove({ from: move.from as Square, to: move.to as Square });
      }

      setValidMoves([]);
    }

    setLastClickedPiece(piece ? square : null);
  };

  const handleGoToMove = useCallback((moveNumber: number) => {
    if (moveNumber < 0 || moveNumber > moveHistory.length ) return;

    chess.reset();
    for (let i = 0; i < moveNumber; i++) {
      chess.move(moveHistory[i]);
    }
    setFen(chess.fen());
    setCurrentMove(moveNumber);
     if (onCurrentMoveChange) {
        onCurrentMoveChange(moveNumber);
      }
    setValidMoves([]);

    if (moveNumber > 0) {
      const lastMoveIndex = moveNumber - 1;
      const position = new Chess();
      for (let i = 0; i < lastMoveIndex; i++) {
        position.move(moveHistory[i]);
      }
      const move = position.move(moveHistory[lastMoveIndex]);
      if (move) {
        setLastMove({ from: move.from as Square, to: move.to as Square });
      }
    } else {
      setLastMove(null);
    }
  }, [chess, moveHistory, onCurrentMoveChange]);

  return {
    chess,
    fen,
    validMoves,
    lastMove,
    lastClickedPiece,
    boardOrientation,
    setBoardOrientation,
    handleSquareClick,
    handleGoToMove,
    currentMove,
    moveHistoryLength: moveHistory.length,
    moves,
    moveHistory
  };
};
