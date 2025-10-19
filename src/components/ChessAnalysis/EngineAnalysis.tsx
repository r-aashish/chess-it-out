import React from 'react';

/**
 * EngineAnalysisProps interface defines the props for the EngineAnalysis component.
 * It includes properties for the engine's evaluation, best move suggestion,
 * the current move number, and the list of moves in the game.
 */
interface EngineAnalysisProps {
  bestMove?: string;
}

/**
 * EngineAnalysis component displays the engine's analysis of the current game position.
 * It shows the engine's evaluation and the suggested best move.
 */
const EngineAnalysis: React.FC<EngineAnalysisProps> = ({ bestMove }) => {
  
  return (
    <div className="bg-[#312e2b] p-4 rounded-lg shadow-xl text-white">
      <h3 className="font-bold text-lg mb-2">Engine Analysis</h3>
      {bestMove && <p className="text-base font-serif text-white mb-1">Suggested Move: {bestMove}</p>}
    </div>
  );
};

export default EngineAnalysis;
