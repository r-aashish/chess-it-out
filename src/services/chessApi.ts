import axios, { AxiosError } from 'axios';
import { PlayerProfile, ChessStats, ChessGame } from '../types/chess';

const BASE_URL = 'https://api.chess.com/pub';
const CACHE_PREFIX = 'chess-it-out-cache';
const PROFILE_CACHE_MS = 1000 * 60 * 10; // 10 minutes
const STATS_CACHE_MS = 1000 * 60 * 10; // 10 minutes
const GAMES_CACHE_MS = 1000 * 60 * 3; // 3 minutes
const MAX_GAMES = 25;
const MAX_ARCHIVES_TO_CHECK = 12;
const REQUEST_TIMEOUT_MS = 12_000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const api = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
  },
});

const getCacheKey = (resource: string, username: string) =>
  `${CACHE_PREFIX}:${resource}:${username.toLowerCase()}`;

const readCache = <T>(key: string, maxAgeMs: number): T | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - parsed.timestamp > maxAgeMs) {
      window.sessionStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;

  try {
    const payload: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    window.sessionStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors and continue without cache.
  }
};

/**
 * handleApiError function handles API errors and throws a user-friendly error message.
 * @param error - The error object.
 */
const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.code === 'ECONNABORTED') {
      return new Error('Request timed out. Please try again.');
    }
    if (!axiosError.response) {
      return new Error('Unable to reach Chess.com right now. Please try again.');
    }
    if (axiosError.response?.status === 429) {
      return new Error('Rate limit exceeded. Please try again in a few minutes.');
    }
    if (axiosError.response?.status === 404) {
      return new Error('Player not found. Please check the username.');
    }
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      return new Error('Chess.com is temporarily unavailable. Please try again shortly.');
    }
  }
  return new Error('An unexpected error occurred. Please try again.');
};

/**
 * getPlayerProfile function retrieves a player's profile from the Chess.com API.
 * @param username - The username of the player.
 * @returns A promise that resolves to the player's profile.
 */
export const getPlayerProfile = async (username: string): Promise<PlayerProfile> => {
  const cacheKey = getCacheKey('profile', username);
  const cached = readCache<PlayerProfile>(cacheKey, PROFILE_CACHE_MS);
  if (cached) {
    return cached;
  }

  try {
    const response = await api.get(`${BASE_URL}/player/${username}`);
    const countryCode = typeof response.data.country === 'string'
      ? response.data.country.split('/').pop()
      : undefined;
    const profile = {
      ...response.data,
      country: countryCode
    };

    writeCache(cacheKey, profile);
    return profile;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * getPlayerStats function retrieves a player's stats from the Chess.com API.
 * @param username - The username of the player.
 * @returns A promise that resolves to the player's stats.
 */
export const getPlayerStats = async (username: string): Promise<ChessStats> => {
  const cacheKey = getCacheKey('stats', username);
  const cached = readCache<ChessStats>(cacheKey, STATS_CACHE_MS);
  if (cached) {
    return cached;
  }

  try {
    const response = await api.get(`${BASE_URL}/player/${username}/stats`);
    writeCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * getPlayerGames function retrieves a player's recent games from the Chess.com API.
 * @param username - The username of the player.
 * @returns A promise that resolves to an array of the player's recent games.
 */
export const getPlayerGames = async (username: string): Promise<ChessGame[]> => {
  const cacheKey = getCacheKey('games', username);
  const cached = readCache<ChessGame[]>(cacheKey, GAMES_CACHE_MS);
  if (cached) {
    return cached;
  }

  try {
    const response = await api.get(`${BASE_URL}/player/${username}/games/archives`);
    const archives = response.data.archives as string[] | undefined;
    if (!archives || archives.length === 0) {
      return [];
    }

    const latestArchives = [...archives]
      .reverse()
      .slice(0, MAX_ARCHIVES_TO_CHECK);

    const allGames: ChessGame[] = [];
    for (const archive of latestArchives) {
      const gamesResponse = await api.get(archive);
      const monthGames = (gamesResponse.data.games || []) as ChessGame[];
      allGames.push(...monthGames);

      if (allGames.length >= MAX_GAMES) {
        break;
      }
    }

    const deduped = Array.from(
      new Map(allGames.map((game) => [game.uuid || game.url, game])).values()
    );

    const latestGames = deduped
      .sort((a, b) => b.end_time - a.end_time)
      .slice(0, MAX_GAMES);

    writeCache(cacheKey, latestGames);
    return latestGames;
  } catch (error) {
    throw handleApiError(error);
  }
};
