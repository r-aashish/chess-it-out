import axios, { AxiosError } from 'axios';
import { PlayerProfile, ChessStats, ChessGame } from '../types/chess';

const BASE_URL = 'https://api.chess.com/pub';

/**
 * handleApiError function handles API errors and throws a user-friendly error message.
 * @param error - The error object.
 */
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a few minutes.');
    }
    if (axiosError.response?.status === 404) {
      throw new Error('Player not found. Please check the username.');
    }
  }
  throw new Error('An unexpected error occurred. Please try again.');
};

/**
 * getPlayerProfile function retrieves a player's profile from the Chess.com API.
 * @param username - The username of the player.
 * @returns A promise that resolves to the player's profile.
 */
export const getPlayerProfile = async (username: string): Promise<PlayerProfile> => {
  try {
    const response = await axios.get(`${BASE_URL}/player/${username}`);
    const countryCode = response.data.country.split('/').pop();
    return {
      ...response.data,
      country: countryCode
    };
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
  try {
    const response = await axios.get(`${BASE_URL}/player/${username}/stats`);
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
  try {
    const response = await axios.get(`${BASE_URL}/player/${username}/games/archives`);
    const archives = response.data.archives;
    if (!archives || archives.length === 0) {
      return [];
    }

    // Get the last 2 months of archives to ensure we have enough games
    const latestArchives = archives.slice(-2);
    const gamesPromises = latestArchives.map((archive: string) => axios.get(archive));
    const gamesResponses = await Promise.all(gamesPromises);
    
    // Combine all games and sort by date
    const allGames = gamesResponses
      .flatMap(response => response.data.games)
      .sort((a: ChessGame, b: ChessGame) => b.end_time - a.end_time)
      .slice(0, 25); // Limit to 25 most recent games

    return allGames;
  } catch (error) {
    throw handleApiError(error);
  }
};
