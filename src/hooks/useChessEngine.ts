import { useState, useEffect, useCallback, useRef } from 'react';
import { Square } from 'chess.js';

/**
 * EngineAnalysis interface defines the structure for chess engine analysis data.
 * It includes the evaluation score, best move, principal variation, and best move arrow.
 */
interface EngineAnalysis {
  evaluation: number;      // Current position evaluation in pawns
  bestMove: string;        // Best move found by the engine
  pv: string;             // Principal variation
  bestMoveArrow: [Square, Square][];
}

/**
 * Custom hook for chess engine integration
 * Manages Stockfish engine state and analysis
 * 
 * @param fen - Current position in FEN notation
 * @returns Engine analysis data and control functions
 */
export const useChessEngine = (fen: string): EngineAnalysis => {
  //console.log('FEN:', fen);
  // Engine state
  const [evaluation, setEvaluation] = useState<number>(0);
  const [depth, setDepth] = useState<number>(0);
  const [bestMove, setBestMove] = useState<string>('');
  const [bestMoveArrow, setBestMoveArrow] = useState<[Square, Square][]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const engineRef = useRef<Worker | null>(null);
  const [pv, setPv] = useState<string>('');

  // Initialize engine
  useEffect(() => {
    const initEngine = async () => {
      try {
        // Create Stockfish Web Worker
        const worker = new Worker('/stockfish.js');
        engineRef.current = worker;

        // Handle engine messages
        worker.onmessage = (e: any) => {
          const message = e.data;
          //console.log('Engine Message:', message);

          // Engine ready confirmation
          if (message === 'readyok') {
            setIsEngineReady(true);
            return;
          }

          // Best move found
          if (message.startsWith('bestmove')) {
            const move = message.split(' ')[1];
            setBestMove(move);
            setIsAnalyzing(false);
            return;
          }

          // Analysis info
          if (message.includes('info depth')) {
            // Parse depth
            const depthMatch = message.match(/depth (\\d+)/);
            if (depthMatch) {
              setDepth(parseInt(depthMatch[1]));
            }

            // Parse score
            const scoreMatch = message.match(/score cp (?:-?\d+)/);
            const mateMatch = message.match(/score mate (-?\\d+)/);
            
            if (scoreMatch && scoreMatch.length > 0) {
              // Convert centipawns to pawns
              const score = parseInt(scoreMatch[0].split(' ')[2]) / 100;
              //console.log('Evaluation:', score);
              setEvaluation(score);
            } else if (mateMatch) {
              // Handle mate scores
              const mateIn = parseInt(mateMatch[1]);
              setEvaluation(mateIn > 0 ? Infinity : -Infinity);
            }

            // Parse PV
            const pvMatch = message.match(/pv (.+)/);
            if (pvMatch) {
              setPv(pvMatch[1]);
            }
          }
        };

        // Configure engine for optimal performance
        worker.postMessage('uci');
        worker.postMessage('setoption name MultiPV value 1');
        worker.postMessage('setoption name Threads value 1');
        worker.postMessage('setoption name Hash value 16');
        worker.postMessage('setoption name Skill Level value 10');
        worker.postMessage('setoption name Move Overhead value 10');
        worker.postMessage('setoption name Minimum Thinking Time value 20');
        worker.postMessage('setoption name Slow Mover value 80');
        worker.postMessage('isready');

      } catch (error) {
        console.error('Failed to initialize chess engine:', error);
      }
    };

    initEngine();

    // Cleanup
    return () => {
      if (engineRef.current) {
        engineRef.current.terminate();
        engineRef.current = null;
      }
    };
  }, []);

  // Analyze position
  const analyzePosition = useCallback((position: string) => {
    if (!engineRef.current || !isEngineReady) return;

    setIsAnalyzing(true);
    engineRef.current.postMessage('stop');
    engineRef.current.postMessage(`position fen ${position}`);
    engineRef.current.postMessage('go movetime 500 depth 15');
  }, [isEngineReady]);

  // Stop analysis
  const stopAnalysis = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.postMessage('stop');
    setIsAnalyzing(false);
  }, []);

    // Update bestMoveArrow when bestMove changes
    useEffect(() => {
      if (bestMove) {
        const from = bestMove.slice(0, 2) as Square;
        const to = bestMove.slice(2, 4) as Square;
        setBestMoveArrow([[from, to]]);
      } else {
        setBestMoveArrow([]);
      }
    }, [bestMove]);

  // Update analysis when FEN changes
  useEffect(() => {
    if (fen) {
      analyzePosition(fen);
    }
    return () => stopAnalysis();
  }, [fen, analyzePosition, stopAnalysis]);

  return {
    evaluation,
    bestMove,
    pv,
    bestMoveArrow
  };
};
