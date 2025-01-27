import React from 'react';
import { Move } from '../../types/chess';

interface EngineAnalysisProps {
  evaluation?: number;
  bestMove?: string;
  currentMove: number;
  moves: Move[];
}

const EngineAnalysis: React.FC<EngineAnalysisProps> = ({ evaluation, bestMove, currentMove, moves }) => {
  
  return (
    <div className="bg-[#312e2b] p-4 rounded-lg shadow-xl text-white">
      <h3 className="font-bold text-lg mb-2">Engine Analysis</h3>
      {bestMove && <p className="text-base font-serif text-white mb-1">Suggested Move: {bestMove}</p>}
    </div>
  );
};

export default EngineAnalysis;
