import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';

// Import your custom piece images
import wP from '/images/pieces/wP.svg';
import bP from '/images/pieces/bP.svg';
import wN from '/images/pieces/wN.svg';
import bN from '/images/pieces/bN.svg';
import wB from '/images/pieces/wB.svg';
import bB from '/images/Pieces/bB.svg';
import wR from '/images/pieces/wR.svg';
import bR from '/images/pieces/bR.svg';
import wQ from '/images/pieces/wQ.svg';
import bQ from '/images/pieces/bQ.svg';
import wK from '/images/pieces/wK.svg';
import bK from '/images/pieces/bK.svg';

interface ChessboardDisplayProps {
  fen: string;
  width: number;
  handleSquareClick: (square: Square) => void;
  boardOrientation: 'white' | 'black';
  lastMove: { from: Square; to: Square } | null;
  validMoves: Square[];
  bestMoveArrow: [Square, Square][];
  captureArrows: [Square, Square][];
  isCheckmate: boolean;
  chess: Chess;
  lastClickedPiece: Square | null;
}

const boardTheme = {
  dark: { backgroundColor: '#7a9e5a' },
  light: { backgroundColor: '#ebecd3' },
};

// Define custom pieces
const customPieces = () => {
  return {
    wP: ({ squareWidth }: { squareWidth: number }) => (
      <img src={wP} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="White Pawn" />
    ),
    bP: ({ squareWidth }: { squareWidth: number }) => (
      <img src={bP} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="Black Pawn" />
    ),
    wN: ({ squareWidth }: { squareWidth: number }) => (
      <img src={wN} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="White Knight" />
    ),
    bN: ({ squareWidth }: { squareWidth: number }) => (
      <img src={bN} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="Black Knight" />
    ),
    wB: ({ squareWidth }: { squareWidth: number }) => (
      <img src={wB} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="White Bishop" />
    ),
    bB: ({ squareWidth }: { squareWidth: number }) => (
      <img src={bB} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="Black Bishop" />
    ),
    wR: ({ squareWidth }: { squareWidth: number }) => (
      <img src={wR} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="White Rook" />
    ),
    bR: ({ squareWidth }: { squareWidth: number }) => (
      <img src={bR} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="Black Rook" />
    ),
    wQ: ({ squareWidth }: { squareWidth: number }) => (
      <img src={wQ} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="White Queen" />
    ),
    bQ: ({ squareWidth }: { squareWidth: number }) => (
      <img src={bQ} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="Black Queen" />
    ),
    wK: ({ squareWidth }: { squareWidth: number }) => (
      <img src={wK} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="White King" />
    ),
    bK: ({ squareWidth }: { squareWidth: number }) => (
      <img src={bK} style={{ width: squareWidth, height: squareWidth, transition: 'transform 0.15s ease-in-out' }} alt="Black King" />
    ),
  };
};

export const ChessBoardDisplay: React.FC<ChessboardDisplayProps> = ({
  fen,
  width,
  handleSquareClick,
  boardOrientation,
  lastMove,
  validMoves,
  bestMoveArrow,
  captureArrows,
  isCheckmate,
  chess,
  lastClickedPiece,
}) => {
  return (
    <div className="relative" style={{ width: width, height: width }}>
      <Chessboard
        position={fen}
        boardWidth={width}
        onPieceDrop={() => false}
        onSquareClick={handleSquareClick}
        boardOrientation={boardOrientation}
        customDarkSquareStyle={boardTheme.dark}
        customLightSquareStyle={boardTheme.light}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
        customArrows={[...bestMoveArrow, ...captureArrows]}
        customArrowColor="rgba(46, 204, 113, 0.9)"
        customPieces={customPieces()}
        customSquareStyles={{
          ...(lastMove ? {
            [lastMove.from]: { backgroundColor: 'rgba(255, 170, 0, 0.4)' },
            [lastMove.to]: { backgroundColor: 'rgba(255, 170, 0, 0.4)' }
          } : {}),
          ...(lastClickedPiece ? {
            [lastClickedPiece]: { backgroundColor: 'rgba(255, 215, 0, 0.5)' }
          } : {}),
          ...(validMoves.reduce((styles, square) => ({
            ...styles,
            [square]: {
              background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.50) 20%, transparent 10%)',
              boxSizing: 'border-box'
            }
          }), {})),
          ...(isCheckmate && chess.turn() === 'w' ? {
            [chess.board().flat().findIndex(p => p?.type === 'k' && p.color === 'w')]: {
              animation: 'pulse 1s infinite'
            }
          } : {}),
          ...(isCheckmate && chess.turn() === 'b' ? {
            [chess.board().flat().findIndex(p => p?.type === 'k' && p.color === 'b')]: {
              animation: 'pulse 1s infinite'
            }
          } : {})
        }}
      />
    </div>
  );
};
