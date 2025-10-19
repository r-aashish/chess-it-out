import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';

/**
 * useGamePosition hook manages the game position and navigation.
 * @param pgn - The PGN string of the chess game.
 * @returns An object containing the current position, current move, and functions to navigate the game.
 */
export const useGamePosition = (pgn: string) => {
  const [game] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [currentMove, setCurrentMove] = useState(0);
  const [moves, setMoves] = useState<string[]>([]);

  useEffect(() => {
    game.loadPgn(pgn);
    const history = game.history();
    setMoves(history);
    game.reset();
    setPosition(game.fen());
  }, [pgn, game]);

  const goToMove = (moveIndex: number) => {
    game.reset();
    for (let i = 0; i <= moveIndex; i++) {
      game.move(moves[i]);
    }
    setPosition(game.fen());
    setCurrentMove(moveIndex);
  };

  const goToNext = () => {
    if (currentMove < moves.length - 1) {
      goToMove(currentMove + 1);
    }
  };

  const goToPrev = () => {
    if (currentMove > 0) {
      goToMove(currentMove - 1);
    }
  };

  return {
    position,
    currentMove,
    goToMove,
    goToNext,
    goToPrev,
  };
};
