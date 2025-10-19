import React from "react";
import { ChessStats } from "../types/chess";
import { Target, TrendingUp, Scale } from "./icons";
import { ProgressBar } from "./ProgressBar";

/**
 * StatsCardProps interface defines the props for the StatsCard component.
 * It includes an optional property for the chess stats.
 */
interface StatsCardProps {
  stats?: ChessStats;
}

/**
 * StatLabelProps interface defines the props for the StatLabel component.
 * It includes properties for the icon, label, value, and trend.
 */
interface StatLabelProps {
  icon: JSX.Element;
  label: string;
  value: number;
  trend?: number;
}

/**
 * StatLabel component displays a single statistic with an icon, label, value, and trend.
 */
const StatLabel: React.FC<StatLabelProps> = ({ icon, label, value, trend }) => (
  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/50 to-white/20 dark:from-gray-800/50 dark:to-gray-900/20 rounded-lg backdrop-blur-sm">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</span>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(value)}</span>
          {trend && (
            <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

/**
 * StatsCard component displays a card with the player's chess stats, including rapid, blitz, and bullet ratings.
 */
export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const gameTypes: (keyof ChessStats)[] = ["chess_rapid", "chess_blitz", "chess_bullet"];

  const formatGameTypeStats = (gameType: keyof ChessStats) => {
    const data = stats?.[gameType];
    if (!data || typeof data === "number") return null;

    const { last, best, record } = data as {
      last: { rating: number; date: number; rd: number };
      best: { rating: number; date: number; game: string };
      record: { win: number; loss: number; draw: number };
    };

    return {
      title: gameType.replace("chess_", "").toUpperCase(),
      stats: {
        current: last.rating,
        best: best.rating,
        record,
        trend: last.rating - ((data as { previous?: { rating: number } }).previous?.rating || last.rating),
      },
    };
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-4 space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 ">
          Game Stats & Ratings
      </h2>
    </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {gameTypes.map((type) => {
          const data = formatGameTypeStats(type);
          if (!data) return null;

          const { win, loss, draw } = data.stats.record;
          const totalGames = win + loss + draw;

          return (
            <div 
              key={type}
              className="relative group bg-gradient-to-br from-gray-50/50 to-white/30 dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-4 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl border border-white/10 dark:border-gray-700/50" />
              
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {data.title}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full">
                    {totalGames} Games
                  </span>
                </div>

                <div className="space-y-2">
                  <StatLabel
                    icon=<Target className="text-blue-500" />
                    label="Current Rating"
                    value={data.stats.current}
                    trend={data.stats.trend}
                  />

                  <StatLabel
                    icon=<TrendingUp className="text-green-500" />
                    label="Peak Rating"
                    value={data.stats.best}
                  />

                  <div className="p-2 bg-white/50 dark:bg-gray-900/30 rounded-xl shadow-inner">
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Win Distribution
                        </span>
                        <Scale className="w-4 h-4 text-purple-500" />
                      </div>
                      <ProgressBar wins={win} losses={loss} draws={draw} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
