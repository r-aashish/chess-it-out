import React from 'react';

interface EvaluationBarProps {
  evaluation: number | null;
  boardWidth: number;
  showLabel?: boolean;
  mateIn?: number | null;
  isEndgame?: boolean;
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({
  evaluation,
  boardWidth,
  showLabel = true,
  mateIn = null,
  isEndgame = false,
}) => {
  const normalizeEvaluation = (value: number | null): number => {
    if (value === null) return 50;
    if (mateIn !== null) return value > 0 ? 100 : 0;

    const scale = (x: number): number => {
      const base = 50;
      const absX = Math.abs(x);

      if (isEndgame) {
        if (absX <= 1) return base + x * 25;
        if (absX <= 2) return base + (x > 0 ? 1 : -1) * (25 + 15 * (absX - 1));
        return base + (x > 0 ? 1 : -1) * (40 + 8 * Math.log2(absX));
      }

      if (absX <= 1.5) return base + x * 15;
      if (absX <= 3) return base + (x > 0 ? 1 : -1) * (22.5 + 7.5 * (absX - 1.5));
      if (absX <= 6) return base + (x > 0 ? 1 : -1) * (33.75 + 6 * Math.log2(absX));
      return base + (x > 0 ? 1 : -1) * (42 + 6 * Math.log2(absX / 6));
    };

    return Math.max(2, Math.min(98, scale(value)));
  };

  const formatEvaluation = (value: number | null): string => {
    if (value === null) return '?';
    if (mateIn !== null) return `M${Math.abs(mateIn)}`;

    const absEval = Math.abs(value);
    let formattedEval = absEval < 0.1 ? '0.0' : absEval.toFixed(isEndgame && absEval < 1 ? 2 : 1);
    formattedEval = formattedEval.replace(/\.?0+$/, '');
    return value >= 0 ? `+${formattedEval}` : `-${formattedEval}`;
  };

  const height = normalizeEvaluation(evaluation);
  const textColor = height > 50 ? '#081018' : '#f8fafc';

  return (
    <div
      className="evaluation-bar relative overflow-hidden rounded-xl border border-slate-500/40 shadow-lg"
      style={{ width: '34px', height: boardWidth, background: 'rgba(15, 23, 42, 0.84)' }}
      aria-label="Evaluation Bar"
    >
      <div
        className="absolute bottom-0 w-full transition-all duration-500"
        style={{
          height: `${height}%`,
          background: mateIn !== null ? 'linear-gradient(to top, #10b981, #6ee7b7)' : 'linear-gradient(to top, #f8fafc, #dbeafe)',
        }}
      />

      <div
        className="absolute top-0 w-full transition-all duration-500"
        style={{
          height: `${100 - height}%`,
          background: mateIn !== null ? 'linear-gradient(to bottom, #f43f5e, #fb7185)' : 'linear-gradient(to bottom, #020617, #0f172a)',
        }}
      />

      {showLabel ? (
        <span
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-[10px] font-bold"
          style={{ color: textColor }}
        >
          {formatEvaluation(evaluation)}
        </span>
      ) : null}
    </div>
  );
};
