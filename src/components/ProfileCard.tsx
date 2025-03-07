import React, { useState, useEffect } from "react";
import { PlayerProfile, ChessStats, ChessGame } from "../types/chess";
import { Chessboard } from 'react-chessboard';
import {
  Clock,
  User,
  Target,
  TrendingUp,
  CheckIcon,
  MapPinIcon,
  SparklesIcon,
  Scale,
  Info
} from "./icons";
import { formatDate, calculateWinLossRatio } from "../utils/date";
import { getPlayerStats } from "../services/chessApi";

/**
 * ProfileCardProps interface defines the props for the ProfileCard component.
 * It includes properties for the player profile and an optional username.
 */
interface ProfileCardProps {
  profile: PlayerProfile;
  username?: string; // Optional username prop
}

/**
 * ProfileCard component displays a player's profile information, including their avatar,
 * username, name, location, followers, highest rating, join date, and win/loss ratio.
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, username }) => {
  const [stats, setStats] = useState<ChessStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orientation = username && profile.username.toLowerCase() === username.toLowerCase() ? "white" : "black";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const fetchedStats = await getPlayerStats(profile.username);
        setStats(fetchedStats);
      } catch (err: any) {
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile.username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading player stats...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-red-600 dark:text-red-300 text-center">
        Error: {error}
      </div>
    );
  }

  const rapidWins = stats?.chess_rapid?.record?.win || 0;
  const rapidLosses = stats?.chess_rapid?.record?.loss || 0;
  const rapidWinLossRatio = calculateWinLossRatio(rapidWins, rapidLosses);
  const highestRating = stats?.chess_rapid?.best?.rating || 0;

  return (
    
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 max-w-4xl mx-auto w-full">
      {/* Subtle Heading */}
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
        Player Profile
      </h2>
      <div className="flex items-start space-x-6 mb-6 flex-col sm:flex-row">
        <div className="relative">
          {username && (
            <div className="w-24 h-24 flex flex-col items-center">
              <Chessboard
                position="start"
                boardWidth={96}
                areArrowsAllowed={false}
                customBoardStyle={{
                  borderRadius: '8px',
                }}
                boardOrientation={orientation}
              /> {/* boardOrientation is dynamically set based on username prop */}
              <div className="w-full text-center text-xs text-gray-500 dark:text-gray-400">
                {profile.username}
              </div>
            </div>
          )}
          {!username && (
            <div className="relative">
              <img
                src={profile.avatar}
                alt={`${profile.username}'s avatar`}
                className="w-24 h-24 rounded-xl border-4 border-white dark:border-gray-800 shadow-xl ring-4 ring-blue-100 dark:ring-blue-800/20"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.svg';
                }}
              />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="mb-3">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>{profile.name || profile.username}</span>
              {profile.country && (
                <img
                  src={`https://flagsapi.com/${profile.country.slice(-2)}/flat/32.png`}
                  alt={profile.country}
                  className="h-5 w-5 rounded-sm shadow-sm"
                />
              )}
              {profile.verified && (
                <span className="flex items-center px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300 rounded-full">
                  <CheckIcon className="w-4 h-4 mr-1" />
                  Verified
                </span>
              )}
            </h1>
            {profile.name && (
              <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                @{profile.username}
              </span>
            )}
            {profile.location && (
              <p className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                <MapPinIcon className="w-4 h-4 mr-1 text-red-500" />
                {profile.location}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {profile.followers.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Highest Rating</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {highestRating}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {formatDate(profile.joined)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Win/Loss Ratio</p>
                  <div className="relative">
                    <Info className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
                    <div className="absolute left-6 top-0 w-64 p-3 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      Win/Loss Ratio is calculated by dividing the number of wins by the number of losses. A ratio greater than 1 indicates more wins than losses.
                    </div>
                  </div>
                </div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {rapidWinLossRatio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
