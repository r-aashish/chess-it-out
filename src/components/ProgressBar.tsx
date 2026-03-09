import React from 'react';

interface ProgressBarProps {
  wins: number;
  losses: number;
  draws: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ wins, losses, draws }) => {
  const total = wins + losses + draws;
  const winPercent = (wins / total) * 100 || 0;
  const drawPercent = (draws / total) * 100 || 0;
  const lossPercent = (losses / total) * 100 || 0;

  return (
    <div className="space-y-2">
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-300/30 dark:bg-slate-700/50">
        <div className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-700" style={{ width: `${winPercent}%` }} />
        <div
          className="absolute inset-y-0 bg-amber-400 transition-all duration-700"
          style={{ width: `${drawPercent}%`, left: `${winPercent}%` }}
        />
        <div
          className="absolute inset-y-0 bg-rose-500 transition-all duration-700"
          style={{ width: `${lossPercent}%`, left: `${winPercent + drawPercent}%` }}
        />
      </div>

      <div className="grid gap-1 text-xs font-semibold text-[var(--text-muted)] sm:grid-cols-3">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {wins}W ({winPercent.toFixed(0)}%)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          {draws}D ({drawPercent.toFixed(0)}%)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          {losses}L ({lossPercent.toFixed(0)}%)
        </span>
      </div>
    </div>
  );
};
