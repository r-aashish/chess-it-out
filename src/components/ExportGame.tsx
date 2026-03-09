import React, { useState } from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { ChessGame } from '../types/chess';

interface ExportGameProps {
  game: ChessGame;
  feedback?: string[];
}

export const ExportGame: React.FC<ExportGameProps> = ({ game, feedback = [] }) => {
  const [copied, setCopied] = useState(false);

  const downloadPGN = () => {
    const blob = new Blob([game.pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${game.white.username}_vs_${game.black.username}_${new Date(game.end_time * 1000).toISOString().split('T')[0]}.pgn`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const downloadAnalysis = () => {
    let analysisText = `Game Analysis: ${game.white.username} vs ${game.black.username}\n`;
    analysisText += `Date: ${new Date(game.end_time * 1000).toLocaleDateString()}\n`;
    analysisText += `Time Control: ${game.time_class}\n`;
    analysisText += `Result: ${game.white.result} (White) - ${game.black.result} (Black)\n\n`;
    analysisText += `PGN:\n${game.pgn}\n\n`;

    if (feedback.length > 0) {
      analysisText += 'AI Analysis:\n';
      feedback.forEach((entry, index) => {
        analysisText += `Move ${index + 1}: ${entry}\n\n`;
      });
    }

    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `analysis_${game.white.username}_vs_${game.black.username}_${new Date(game.end_time * 1000).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const copyPGN = async () => {
    try {
      await navigator.clipboard.writeText(game.pgn);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy PGN:', error);
    }
  };

  return (
    <section className="analysis-card w-full max-w-[460px] p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Export</p>
        <p className="text-xs text-slate-400">PGN + notes</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={downloadPGN}
          className="analysis-control-btn flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
          type="button"
        >
          <Download className="h-4 w-4" />
          Download PGN
        </button>

        <button
          onClick={copyPGN}
          className="analysis-control-btn flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
          type="button"
        >
          {copied ? <CheckCircle className="h-4 w-4 text-emerald-300" /> : <FileText className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy PGN'}
        </button>

        {feedback.length > 0 ? (
          <button
            onClick={downloadAnalysis}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-95"
            type="button"
          >
            Download Analysis
          </button>
        ) : null}
      </div>
    </section>
  );
};
