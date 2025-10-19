import { useState, useEffect } from 'react';
import { Stockfish } from '../workers/stockfish';

/**
 * useEngine hook manages the Stockfish engine and provides analysis data.
 */
export const useEngine = () => {
  const [engine] = useState(() => new Stockfish());
  const [evaluation, setEvaluation] = useState<string>('0.0');
  const [bestLine, setBestLine] = useState<string>('');

  useEffect(() => {
    engine.onMessage((msg: string) => {
      if (msg.startsWith('info depth')) {
        // Parse evaluation and best line from engine output
        const evalMatch = msg.match(/score cp (-?\d+)/);
        const bestMoveMatch = msg.match(/pv (.+)/);
        
        if (evalMatch) {
          const evalCp = parseInt(evalMatch[1]) / 100;
          setEvaluation(evalCp.toFixed(1));
        }
        
        if (bestMoveMatch) {
          setBestLine(bestMoveMatch[1]);
        }
      }
    });

    return () => {
      engine.terminate();
    };
  }, [engine]);

  return {
    evaluation,
    isThinking: false,
    bestLine,
    analyzePosition: engine.analyzePosition.bind(engine),
  };
};
