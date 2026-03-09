import React from 'react';
import { PlayerProfile, ChessStats } from '../types/chess';
import {
  Clock,
  User,
  Target,
  CheckIcon,
  MapPinIcon,
  Scale,
  Info,
} from './icons';
import { formatDate, calculateWinLossRatio } from '../utils/date';

interface ProfileCardProps {
  profile: PlayerProfile;
  stats?: ChessStats | null;
}

const StatTile: React.FC<{ icon: React.ReactNode; label: string; value: string; note?: string }> = ({
  icon,
  label,
  value,
  note,
}) => (
  <div className="ui-panel-subtle rounded-2xl p-4">
    <div className="mb-2 flex items-center gap-2 text-[var(--text-muted)]">
      {icon}
      <span className="text-xs font-semibold uppercase tracking-[0.14em]">{label}</span>
    </div>
    <p className="text-xl font-bold text-[var(--text)]">{value}</p>
    {note ? <p className="mt-1 text-xs text-[var(--text-muted)]">{note}</p> : null}
  </div>
);

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, stats }) => {
  const rapidWins = stats?.chess_rapid?.record?.win || 0;
  const rapidLosses = stats?.chess_rapid?.record?.loss || 0;
  const rapidWinLossRatio = calculateWinLossRatio(rapidWins, rapidLosses);

  const highestRating = Math.max(
    stats?.chess_rapid?.best?.rating || 0,
    stats?.chess_blitz?.best?.rating || 0,
    stats?.chess_bullet?.best?.rating || 0,
  );

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=0f172a&color=f8fafc&size=160`;

  return (
    <section className="ui-panel rounded-[28px] p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar || fallbackAvatar}
            alt={`${profile.username}'s avatar`}
            className="h-20 w-20 rounded-2xl border border-[var(--card-border)] object-cover shadow-lg"
            onError={(event) => {
              event.currentTarget.src = fallbackAvatar;
            }}
          />

          <div className="space-y-1">
            <h2 className="ui-heading text-2xl font-bold md:text-3xl">{profile.name || profile.username}</h2>
            <p className="ui-muted text-sm font-medium">@{profile.username}</p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {profile.country ? (
                <span className="ui-badge inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold">
                  <img
                    src={`https://flagsapi.com/${profile.country.slice(-2)}/flat/32.png`}
                    alt={profile.country}
                    className="h-4 w-4 rounded-sm"
                  />
                  {profile.country}
                </span>
              ) : null}

              {profile.verified ? (
                <span className="ui-badge inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  <CheckIcon className="h-4 w-4" />
                  Verified
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {profile.location ? (
          <div className="ui-panel-subtle inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-muted)]">
            <MapPinIcon className="h-4 w-4" />
            {profile.location}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={<User className="h-4 w-4" />}
          label="Followers"
          value={profile.followers.toLocaleString()}
        />

        <StatTile
          icon={<Target className="h-4 w-4" />}
          label="Peak Rating"
          value={highestRating.toLocaleString()}
        />

        <StatTile
          icon={<Clock className="h-4 w-4" />}
          label="Joined"
          value={formatDate(profile.joined)}
        />

        <StatTile
          icon={<Scale className="h-4 w-4" />}
          label="Rapid W/L"
          value={rapidWinLossRatio}
          note="Wins divided by losses in rapid games"
        />
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-xs text-[var(--text-muted)]">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Highest rating is the best among rapid, blitz, and bullet for this account snapshot.
      </div>
    </section>
  );
};
