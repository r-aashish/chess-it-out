import React, { useState } from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { ChessGame } from '../types/chess';

interface ExportGameProps {
  game: ChessGame;
  feedback?: string[];
}

/**
 * ExportGame component allows users to export game data in various formats.
 * Supports exporting PGN and game analysis.
 */
export const ExportGame: React.FC<ExportGameProps> = ({ game, feedback = [] }) => {
  const [copied, setCopied] = useState(false);

  const downloadPGN = () => {
    const blob = new Blob([game.pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${game.white.username}_vs_${game.black.username}_${new Date(game.end_time * 1000).toISOString().split('T')[0]}.pgn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAnalysis = () => {
    let analysisText = `Game Analysis: ${game.white.username} vs ${game.black.username}\n`;
    analysisText += `Date: ${new Date(game.end_time * 1000).toLocaleDateString()}\n`;
    analysisText += `Time Control: ${game.time_class}\n`;
    analysisText += `Result: ${game.white.result} (White) - ${game.black.result} (Black)\n\n`;
    analysisText += `PGN:\n${game.pgn}\n\n`;
    
    if (feedback.length > 0) {
      analysisText += `AI Analysis:\n`;
      feedback.forEach((fb, index) => {
        analysisText += `Move ${index + 1}: ${fb}\n\n`;
      });
    }

    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${game.white.username}_vs_${game.black.username}_${new Date(game.end_time * 1000).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyPGN = async () => {
    try {
      await navigator.clipboard.writeText(game.pgn);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy PGN:', err);
    }
  };

  return (
    <div className="bg-[#1b1b1b] rounded-sm p-4 space-y-3">
      <h3 className="text-white font-semibold text-lg mb-3">Export Game</h3>
      
      <div className="space-y-2">
        <button
          onClick={downloadPGN}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#2b2b2b] hover:bg-[#3a3a3a] text-gray-300 hover:text-white rounded-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download PGN</span>
        </button>

        <button
          onClick={copyPGN}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#2b2b2b] hover:bg-[#3a3a3a] text-gray-300 hover:text-white rounded-sm transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Copy PGN</span>
            </>
          )}
        </button>

        {feedback.length > 0 && (
          <button
            onClick={downloadAnalysis}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Analysis</span>
          </button>
        )}
      </div>
      
      <p className="text-xs text-gray-400 mt-2">
        Export game data for offline analysis or sharing
      </p>
    </div>
  );
};
