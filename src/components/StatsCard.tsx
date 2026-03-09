import React from 'react';
import { ChessStats } from '../types/chess';
import { Target, TrendingUp, Scale } from './icons';
import { ProgressBar } from './ProgressBar';

interface StatsCardProps {
  stats?: ChessStats;
}

interface StatLabelProps {
  icon: JSX.Element;
  label: string;
  value: number;
  trend?: number;
}

const StatLabel: React.FC<StatLabelProps> = ({ icon, label, value, trend }) => (
  <div className="ui-panel-subtle rounded-xl p-3">
    <div className="mb-2 flex items-center gap-2 text-[var(--text-muted)]">
      {React.cloneElement(icon, { className: 'h-4 w-4' })}
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-[var(--text)]">{Math.round(value)}</span>
      {typeof trend === 'number' && trend !== 0 ? (
        <span className={`text-xs font-semibold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend > 0 ? '+' : '-'}
          {Math.abs(trend)}
        </span>
      ) : null}
    </div>
  </div>
);

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const gameTypes: (keyof ChessStats)[] = ['chess_rapid', 'chess_blitz', 'chess_bullet'];

  const formatGameTypeStats = (gameType: keyof ChessStats) => {
    const data = stats?.[gameType];
    if (!data || typeof data === 'number') return null;

    const { last, best, record } = data as {
      last: { rating: number; date: number; rd: number };
      best: { rating: number; date: number; game: string };
      record: { win: number; loss: number; draw: number };
    };

    return {
      title: gameType.replace('chess_', '').toUpperCase(),
      stats: {
        current: last.rating,
        best: best.rating,
        record,
        trend: last.rating - ((data as { previous?: { rating: number } }).previous?.rating || last.rating),
      },
    };
  };

  const available = gameTypes
    .map((type) => ({ type, info: formatGameTypeStats(type) }))
    .filter((entry) => Boolean(entry.info));

  if (available.length === 0) {
    return (
      <section className="ui-panel rounded-[28px] p-6">
        <h3 className="ui-heading text-xl font-bold">Rating Snapshot</h3>
        <p className="ui-muted mt-2 text-sm">No rapid, blitz, or bullet stats are available for this account.</p>
      </section>
    );
  }

  return (
    <section className="ui-panel rounded-[28px] p-6 md:p-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h3 className="ui-heading text-xl font-bold md:text-2xl">Rating Snapshot</h3>
          <p className="ui-muted text-sm">Performance breakdown across the main online time controls.</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {available.map(({ type, info }) => {
          if (!info) return null;
          const { win, loss, draw } = info.stats.record;
          const totalGames = win + loss + draw;

          return (
            <article key={type} className="ui-panel-subtle rounded-2xl p-4">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="ui-heading text-lg font-bold">{info.title}</h4>
                <span className="ui-badge px-2 py-1 text-xs font-semibold">{totalGames} games</span>
              </div>

              <div className="space-y-3">
                <StatLabel
                  icon={<Target className="text-[var(--accent)]" />}
                  label="Current"
                  value={info.stats.current}
                  trend={info.stats.trend}
                />

                <StatLabel icon={<TrendingUp className="text-emerald-500" />} label="Peak" value={info.stats.best} />

                <div className="ui-panel-subtle rounded-xl p-3">
                  <div className="mb-2 flex items-center justify-between text-[var(--text-muted)]">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em]">W/L/D Split</span>
                    <Scale className="h-4 w-4" />
                  </div>
                  <ProgressBar wins={win} losses={loss} draws={draw} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
