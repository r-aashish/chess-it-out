import React from "react";

/**
 * ProgressBarProps interface defines the props for the ProgressBar component.
 * It includes properties for the number of wins, losses, and draws.
 */
interface ProgressBarProps {
  wins: number;
  losses: number;
  draws: number;
}

/**
 * ProgressBar component displays a progress bar visualizing the win, loss, and draw percentages.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ wins, losses, draws }) => {
  const total = wins + losses + draws;
  const winPercent = (wins / total) * 100 || 0;
  const drawPercent = (draws / total) * 100 || 0;
  const lossPercent = (losses / total) * 100 || 0;

  return (
    <div className="w-full space-y-2">
      <div className="relative w-full h-3 rounded-full overflow-hidden bg-gray-200/50 dark:bg-gray-800 shadow-inner">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
        
        {/* Win segment */}
        <div
          style={{ width: `${winPercent}%` }}
          className="absolute inset-y-0 left-0 h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out delay-150"
          title={`Wins: ${winPercent.toFixed(1)}%`}
        >
          <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 mix-blend-overlay" />
        </div>

        {/* Draw segment */}
        <div
          style={{ width: `${drawPercent}%`, left: `${winPercent}%` }}
          className="absolute inset-y-0 h-full bg-gradient-to-r gray transition-all duration-1000 ease-out delay-300"
          title={`Draws: ${drawPercent.toFixed(1)}%`}
        >
          <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 mix-blend-overlay" />
        </div>

        {/* Loss segment */}
        <div
          style={{ width: `${lossPercent}%`, left: `${winPercent + drawPercent}%` }}
          className="absolute inset-y-0 h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 ease-out delay-500"
          title={`Losses: ${lossPercent.toFixed(1)}%`}
        >
          <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 mix-blend-overlay" />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between items-center px-1 text-xs font-medium">
        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span>{wins} Wins ({winPercent.toFixed(1)}%)</span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-500" />
          <span>{draws} Draws ({drawPercent.toFixed(1)}%)</span>
        </div>
        
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
          <span>{losses} Losses ({lossPercent.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
};
