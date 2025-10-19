import React from 'react';

/**
 * EvaluationBarProps interface defines the props for the EvaluationBar component.
 * It includes properties for the engine's evaluation, board width,
 * whether to show the evaluation label, mate-in number, and whether it's an endgame.
 */
interface EvaluationBarProps {
  evaluation: number | null;
  boardWidth: number;
  showLabel?: boolean;
  mateIn?: number | null;
  isEndgame?: boolean;
}

/**
 * EvaluationBar component displays a visual representation of the engine's evaluation.
 * It uses a gradient bar to indicate the evaluation score, with white representing
 * a positive evaluation for white and black representing a positive evaluation for black.
 */
export const EvaluationBar: React.FC<EvaluationBarProps> = ({
  evaluation,
  boardWidth,
  showLabel = true,
  mateIn = null,
  isEndgame = false,
}) => {
  // Normalize evaluation with context-aware scaling
  const normalizeEvaluation = (eval_: number | null): number => {
    if (eval_ === null) return 50;
    if (mateIn !== null) return eval_ > 0 ? 100 : 0;

    // Enhanced scaling function with endgame consideration
    const scale = (x: number): number => {
      const BASE = 50;
      const absX = Math.abs(x);

      if (isEndgame) {
        // Endgame scaling: More dramatic for smaller advantages
        if (absX <= 1) return BASE + x * 25;
        if (absX <= 2) return BASE + (x > 0 ? 1 : -1) * (25 + 15 * (absX - 1));
        return BASE + (x > 0 ? 1 : -1) * (40 + 8 * Math.log2(absX));
      } else {
        // Middlegame scaling: More gradual
        if (absX <= 1.5) return BASE + x * 15;
        if (absX <= 3) return BASE + (x > 0 ? 1 : -1) * (22.5 + 7.5 * (absX - 1.5));
        if (absX <= 6) return BASE + (x > 0 ? 1 : -1) * (33.75 + 6 * Math.log2(absX));
        return BASE + (x > 0 ? 1 : -1) * (42 + 6 * Math.log2(absX / 6));
      }
    };

    return Math.max(2, Math.min(98, scale(eval_)));
  };

  // Enhanced evaluation formatting with phase consideration
  const formatEvaluation = (eval_: number | null): string => {
    if (eval_ === null) return '?';
    if (mateIn !== null) return `M${Math.abs(mateIn)}`;

    const absEval = Math.abs(eval_);
    let formattedEval: string;

    if (absEval < 0.1) {
      formattedEval = '0.0';
    } else if (isEndgame && absEval < 1) {
      formattedEval = absEval.toFixed(2);
    } else if (absEval < 2) {
      formattedEval = absEval.toFixed(1);
    } else {
      formattedEval = absEval.toFixed(1);
    }

    formattedEval = formattedEval.replace(/\.?0+$/, '');
    return eval_ >= 0 ? `+${formattedEval}` : `-${formattedEval}`;
  };

  const height = React.useMemo(() => {
    return normalizeEvaluation(evaluation);
  }, [evaluation, normalizeEvaluation]);

  const textColor = height > 50 ? '#000' : '#fff';
  const textShadow = height > 50
    ? '0px 0px 3px rgba(255, 255, 255, 0.7)'
    : '0px 0px 3px rgba(0, 0, 0, 0.7)';

  return (
    <div
      className="evaluation-bar relative overflow-hidden rounded-lg shadow-md"
      style={{
        width: '35px',
        height: boardWidth,
        background: 'linear-gradient(to bottom, #333, #555)',
      }}
      aria-label="Evaluation Bar"
    >
      <div
        className="absolute w-full transition-all duration-500 ease-out"
        style={{
          height: `${height}%`,
          bottom: 0,
          background: mateIn !== null
            ? 'linear-gradient(to top, #4CAF50, #81C784)'
            : 'linear-gradient(to top, #fff, #ccc)',
        }}
      />
      <div
        className="absolute w-full transition-all duration-500 ease-out"
        style={{
          height: `${100 - height}%`,
          top: 0,
          background: mateIn !== null
            ? 'linear-gradient(to bottom, #F44336, #E57373)'
            : 'linear-gradient(to bottom, #000, #222)',
        }}
      />
      {showLabel && (
        <span
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center font-mono text-xs font-bold z-10"
          style={{
            color: textColor,
            textShadow: textShadow,
            padding: '0 2px',
          }}
        >
          {formatEvaluation(evaluation)}
        </span>
      )}
    </div>
  );
};
