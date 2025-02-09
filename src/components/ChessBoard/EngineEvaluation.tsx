import React from 'react';
import { useEngine } from '../../hooks/useEngine';

/**
 * EngineEvaluationProps interface defines the props for the EngineEvaluation component.
 * It includes properties for the FEN position of the board.
 */
interface EngineEvaluationProps {
  position: string;
}

/**
 * EngineEvaluation component displays the engine's analysis of the current board position.
 * It shows the engine's evaluation score and the best line of play.
 */
export const EngineEvaluation: React.FC<EngineEvaluationProps> = ({ position }) => {
  const { evaluation, isThinking, bestLine } = useEngine();

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Engine Analysis</h3>
      
      {isThinking ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Analyzing...</span>
        </div>
      ) : (
        <>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-mono font-bold text-center">
              {evaluation}
            </div>
            <div className="text-sm text-gray-500 text-center mt-1">
              Evaluation
            </div>
          </div>
          
          {bestLine && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Best line</div>
              <div className="font-mono text-sm">{bestLine}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
