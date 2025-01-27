// LlmFeedback.tsx
import React, { useState, Dispatch, SetStateAction } from 'react';
import { LoadingCircle } from '../icons';
import { ChessGame } from '../../types/chess';
import { parse, ParseTree } from '@mliebelt/pgn-parser';

interface PgnMove {
  notation: {
    notation: string;
  };
}

interface LlmFeedbackProps {
  game: ChessGame;
  currentMove: number;
  setFeedback: Dispatch<SetStateAction<string[]>>;
  username?: string;
  pieceColor?: string;
}

const isParseTree = (parsed: any): parsed is ParseTree => {
  return parsed && Array.isArray(parsed.moves);
};

const LlmFeedback: React.FC<LlmFeedbackProps> = ({ game, currentMove, setFeedback, username, pieceColor }) => {
  const [localFeedback, setLocalFeedback] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const playerName = username || "User";
  const playerColor = pieceColor || "their";

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY environment variable is required');
  }

  const fetchLlmFeedback = async () => {
    setLoading(true);
    try {
      const parsedPgn = parse(game.pgn, { startRule: "game" });
      if (!isParseTree(parsedPgn)) throw new Error("Failed to parse PGN moves");
      
      const allMoves = parsedPgn.moves.map((move: PgnMove) => move.notation.notation);
      const batchSize = 20;
      const totalBatches = Math.ceil(allMoves.length / batchSize);
      
      let combinedFeedback: string[] = [];

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchStart = batchIndex * batchSize;
        const batchEnd = Math.min(batchStart + batchSize, allMoves.length);
        const currentBatch = allMoves.slice(batchStart, batchEnd);

        // Create a formatted string of moves with move numbers
        const formattedBatchMoves = currentBatch.map((move, index) => {
          const moveNumber = batchStart + index + 1;
          return `${moveNumber}. ${move}`;
        }).join(' ');

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
        - MUST use ${playerName}'s name sometimes when analyzing their moves
        - MUST mention specific squares (e4, f6, etc.) when relevant
        - MUST evaluate piece coordination and activity
        - MUST address potential threats or weaknesses
        - MUST include one concrete improvement suggestion every 3-4 half-moves
        - MUST note when moves impact center control
        - MUST mention potential future plans or ideas
        - DO NOT use move numbers or technical headers
        - DO NOT combine multiple move analysis
        focus only on the strategic and tactical implications

          Analyze these specific moves: ${formattedBatchMoves}

          Example feedback style:
          "Strong control over the light squares and excellent outpost potential. The position offers clear attacking chances on the kingside while maintaining solid center control." %%%
          "A flexible response that maintains tension in the center while preparing counterplay along the c-file. Consider targeting the isolated pawn structure that has emerged." %%%

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

        const data = await response.json();
        const feedbackText = data.candidates[0].content.parts[0].text;
        
        const batchFeedback = feedbackText.split('%%%')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);

        // Ensure batch integrity
        const validatedFeedback = batchFeedback.length > currentBatch.length 
          ? batchFeedback.slice(0, currentBatch.length)
          : [
              ...batchFeedback,
              ...Array(currentBatch.length - batchFeedback.length)
                .fill(`${playerName}, analyzing this move...`)
            ];

        combinedFeedback = [...combinedFeedback, ...validatedFeedback];
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Final safety check
      const finalFeedback = allMoves.map((_, i) => 
        combinedFeedback[i] || `${playerName}, insight pending for move ${i + 1}`
      );

      setLocalFeedback(finalFeedback);
      setFeedback(finalFeedback);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setLocalFeedback([`${playerName}, we'll focus on key moves. Try navigating through important positions!`]);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1b1b1b] rounded-sm overflow-hidden h-[200px]" style={{ width: '450px' }}>
      <div className="p-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1b1b1b]">
        {localFeedback.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            {!loading && (
              <button
                onClick={fetchLlmFeedback}
                className="text-gray-300 hover:text-white bg-[#2b2b2b] hover:bg-[#3a3a3a] px-4 py-2 rounded-sm text-sm transition-colors"
                disabled={loading}
              >
                Get AI Feedback
              </button>
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
            <p className="text-lg mb-2">Analysis complete, {playerName}!</p>
            <p className="text-sm opacity-75">Navigate moves to see feedback</p>
          </div>
        ) : (
          <div className="text-gray-300 text-base font-serif p-2 bg-[#2b2b2b] rounded-sm">
            {localFeedback[currentMove - 1]}
          </div>
        )}
      </div>
    </div>
  );
};

export default LlmFeedback;