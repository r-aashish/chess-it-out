import React, { useEffect, useMemo, useState } from 'react';
import { LoadingCircle } from '../icons';
import { ChessGame } from '../../types/chess';
import { parse, ParseTree } from '@mliebelt/pgn-parser';
import { Chess } from 'chess.js';

interface PgnMove {
  notation: {
    notation: string;
  };
}

interface LlmFeedbackProps {
  game: ChessGame;
  currentMove: number;
  username?: string;
  pieceColor?: 'white' | 'black';
  onFeedbackUpdate?: (feedback: string[]) => void;
}

const CENTER_SQUARES = new Set(['d4', 'd5', 'e4', 'e5']);

const isParseTree = (parsed: unknown): parsed is ParseTree => {
  return parsed !== null && typeof parsed === 'object' && 'moves' in parsed && Array.isArray((parsed as ParseTree).moves);
};

const getFeedbackCacheKey = (game: ChessGame) => `chess-it-out-feedback:${game.uuid || game.url}`;

const createLocalFeedback = (pgn: string, playerName: string, playerColor: 'white' | 'black') => {
  try {
    const chess = new Chess();
    chess.loadPgn(pgn);
    const verboseMoves = chess.history({ verbose: true });
    const playerColorCode = playerColor === 'white' ? 'w' : 'b';

    return verboseMoves.map((move) => {
      const actor = move.color === playerColorCode ? playerName : 'Opponent';
      const points: string[] = [];

      if (CENTER_SQUARES.has(move.to)) {
        points.push(`improves control of ${move.to}`);
      }
      if (move.captured) {
        points.push(`wins material by capturing on ${move.to}`);
      }
      if (move.san.includes('+')) {
        points.push('forces king safety concerns with check');
      }
      if (move.promotion) {
        points.push(`promotes to ${move.promotion.toUpperCase()}`);
      }
      if (points.length === 0) {
        points.push('keeps the position balanced while developing pieces');
      }

      return `${actor} played ${move.san}, which ${points.join(' and ')}.`;
    });
  } catch {
    return [`${playerName}, local move insights are unavailable for this game.`];
  }
};

const LlmFeedback: React.FC<LlmFeedbackProps> = ({ game, currentMove, username, pieceColor, onFeedbackUpdate }) => {
  const [localFeedback, setLocalFeedback] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const playerName = username || "User";
  const playerColor = pieceColor || "white";
  const hasApiKey = Boolean(apiKey);
  const cacheKey = useMemo(() => getFeedbackCacheKey(game), [game]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setLocalFeedback([]);
    if (typeof window === 'undefined') return;

    try {
      const cached = window.sessionStorage.getItem(cacheKey);
      if (!cached) return;
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        setLocalFeedback(parsed.filter((item) => typeof item === 'string'));
      }
    } catch {
      // Ignore bad cache and proceed.
    }
  }, [cacheKey]);

  const fetchLlmFeedback = async () => {
    setLoading(true);
    try {
      const fallbackFeedback = createLocalFeedback(game.pgn, playerName, playerColor);

      if (!hasApiKey) {
        setLocalFeedback(fallbackFeedback);
        onFeedbackUpdate?.(fallbackFeedback);
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(cacheKey, JSON.stringify(fallbackFeedback));
        }
        return;
      }

      const parsedPgn = parse(game.pgn, { startRule: "game" });
      if (!isParseTree(parsedPgn)) throw new Error("Failed to parse PGN moves");
      
      const allMoves = parsedPgn.moves.map((move: PgnMove) => move.notation.notation);
      const batchSize = 30;
      const totalBatches = Math.ceil(allMoves.length / batchSize);
      let combinedFeedback: string[] = [];

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchStart = batchIndex * batchSize;
        const batchEnd = Math.min(batchStart + batchSize, allMoves.length);
        const currentBatch = allMoves.slice(batchStart, batchEnd);
        const formattedBatchMoves = currentBatch
          .map((move, index) => `${batchStart + index + 1}. ${move}`)
          .join(' ');

        const prompt = `As a chess coach, analyze this game where ${playerName} plays ${playerColor} pieces, starting from move ${batchStart + 1}.

Required elements for EVERY half-move analysis:
1. Immediate tactical implications (piece activity, threats)
2. Strategic considerations (pawn structure, piece coordination)
3. Control of key squares
4. Development progress
5. King safety implications

Additional requirements:
- MUST end each half-move analysis with %%%
- MUST keep each analysis between 2-3 sentences
- MUST use ${playerName}'s name and their ${playerColor} pieces in analysis
- MUST mention specific squares (e4, f6, etc.) when relevant
- MUST include one concrete improvement suggestion every 3-4 half-moves
- DO NOT use move numbers or technical headers
- DO NOT combine multiple move analysis

Analyze these specific moves: ${formattedBatchMoves}

Start immediately with move ${batchStart + 1}'s analysis, maintaining this style throughout the batch.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Gemini request failed with ${response.status}`);
        }

        const data = await response.json();
        const feedbackText: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!feedbackText) {
          throw new Error('Gemini returned no feedback text');
        }
        
        const batchFeedback = feedbackText
          .split('%%%')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);

        const validatedFeedback = batchFeedback.length > currentBatch.length 
          ? batchFeedback.slice(0, currentBatch.length)
          : [
              ...batchFeedback,
              ...Array(currentBatch.length - batchFeedback.length)
                .fill(`${playerName}, insight pending for this move.`)
            ];

        combinedFeedback = [...combinedFeedback, ...validatedFeedback];
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const finalFeedback = allMoves.map((_, i) => 
        combinedFeedback[i] || `${playerName}, insight pending for move ${i + 1}`
      );

      setLocalFeedback(finalFeedback);
      onFeedbackUpdate?.(finalFeedback);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(cacheKey, JSON.stringify(finalFeedback));
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const fallbackFeedback = createLocalFeedback(game.pgn, playerName, playerColor);
      setLocalFeedback(fallbackFeedback);
      onFeedbackUpdate?.(fallbackFeedback);
    } finally {
      setLoading(false);
    }
  };

  const feedbackBoxHeight = isMobile ? '120px' : '200px';

  return (
    <div
      className={`bg-[#1b1b1b] rounded-sm overflow-hidden ${
        isMobile ? 'no-padding' : ''
      } mobile-scale`}
      style={{ height: feedbackBoxHeight }}
    >
      <div className="p-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1b1b1b]">
        {localFeedback.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 h-full">
            {!loading && (
              <>
                <button
                  onClick={fetchLlmFeedback}
                  className="text-gray-300 hover:text-white bg-[#2b2b2b] hover:bg-[#3a3a3a] px-4 py-2 rounded-sm text-sm transition-colors"
                  disabled={loading}
                >
                  {hasApiKey ? 'Get AI Feedback' : 'Generate Move Insights'}
                </button>
                {!hasApiKey && (
                  <p className="text-xs text-gray-500 text-center">
                    Add `VITE_GEMINI_API_KEY` to enable cloud AI commentary.
                  </p>
                )}
              </>
            )}
            {loading && (
              <div className="text-gray-300 text-center">
                <LoadingCircle className="animate-spin h-8 w-8 mb-2 mx-auto" />
                <p className="text-sm">Analyzing your game...</p>
              </div>
            )}
          </div>
        ) : currentMove === 0 ? (
          <div className="text-center text-gray-300 p-4">
            <p className="text-lg mb-2">Analysis ready, {playerName}.</p>
            <p className="text-sm opacity-75">Navigate moves to see feedback.</p>
          </div>
        ) : (
          <div className="text-gray-300 text-base font-serif p-2 bg-[#2b2b2b] rounded-sm">
            {localFeedback[currentMove - 1] || `${playerName}, insight pending for this move.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default LlmFeedback;
