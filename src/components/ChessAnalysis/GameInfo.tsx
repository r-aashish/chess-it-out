import React, { useMemo } from 'react';
import { ChessGame } from '../../types/chess';
import { X, Clock, Trophy, Calendar } from '../icons';
import { format } from 'date-fns';
import { detectOpening, getOpeningDescription } from '../../utils/openings';
import { BookOpen, Circle, Hash, FlagTriangleLeft, FlagTriangleRight, Swords } from 'lucide-react';

interface GameInfoProps {
  game: ChessGame;
  onClose: () => void;
  moveHistory: string[];
}

const GameDetailRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="analysis-card p-3">
    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-sm font-medium text-slate-100">{value}</p>
  </div>
);

export const GameInfo: React.FC<GameInfoProps> = ({ game, onClose, moveHistory }) => {
  const playedOn = game.end_time ? format(new Date(game.end_time * 1000), 'MMMM dd, yyyy') : 'Unknown Date';
  const numberOfMoves = moveHistory?.length || 'Unknown';

  const opening = useMemo(() => detectOpening(game.pgn), [game.pgn]);

  const resultSummary = useMemo(() => {
    if (game.white.result === 'win') return `${game.white.username} won (1-0)`;
    if (game.black.result === 'win') return `${game.black.username} won (0-1)`;
    return `Draw (${game.white.result} / ${game.black.result})`;
  }, [game.white.result, game.white.username, game.black.result, game.black.username]);

  const details = [
    { icon: <Clock className="h-4 w-4" />, label: 'Time control', value: game.time_control || 'Unknown' },
    {
      icon: <Trophy className="h-4 w-4" />,
      label: 'Game type',
      value: `${game.time_class || 'Unknown'} ${game.rated ? 'Rated' : 'Unrated'}`,
    },
    { icon: <Calendar className="h-4 w-4" />, label: 'Played on', value: playedOn },
    {
      icon: <FlagTriangleLeft className="h-4 w-4" />,
      label: 'White',
      value: `${game.white?.username || 'Unknown'} (${game.white?.rating || '?'})`,
    },
    {
      icon: <FlagTriangleRight className="h-4 w-4" />,
      label: 'Black',
      value: `${game.black?.username || 'Unknown'} (${game.black?.rating || '?'})`,
    },
    { icon: <Swords className="h-4 w-4" />, label: 'Result', value: resultSummary },
    { icon: <Circle className="h-4 w-4" />, label: 'Opening', value: opening ? `${opening.name} (${opening.eco})` : game.opening || 'Unknown' },
    { icon: <Hash className="h-4 w-4" />, label: 'Half moves', value: numberOfMoves.toString() },
  ];

  return (
    <section className="h-full w-full rounded-2xl border border-slate-700/60 bg-slate-950/45 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-100">Game Info</h3>
        <button
          onClick={onClose}
          className="analysis-control-btn rounded-lg p-2"
          aria-label="Close game details"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        {details.map((detail) => (
          <GameDetailRow key={detail.label} icon={detail.icon} label={detail.label} value={detail.value} />
        ))}

        {opening ? (
          <div className="analysis-card p-3">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              <BookOpen className="h-4 w-4" />
              About this opening
            </div>
            <p className="text-sm text-slate-200">{getOpeningDescription(opening.name)}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
};
