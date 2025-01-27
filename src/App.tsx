import LogoLightMode from '../images/Logo-LightMode.png';
import LogoDarkMode from '../images/Logo-DarkMode.png';
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getPlayerProfile, getPlayerStats, getPlayerGames } from "./services/chessApi";
import { SearchForm } from "./components/SearchForm";
import { ProfileCard } from "./components/ProfileCard";
import { StatsCard } from "./components/StatsCard";
import { GamesList } from "./components/GamesList";
import { ChessAnalysis } from "./components/ChessAnalysis";
import { ErrorMessage } from "./components/ErrorMessage";
import { ThemeProvider, useTheme } from "./components/ThemeToggle";
import ErrorBoundary from "./components/ErrorBoundary";
import { PlayerProfile, ChessStats, ChessGame } from "./types/chess";

const App = () => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [stats, setStats] = useState<ChessStats | null>(null);
  const [games, setGames] = useState<ChessGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<ChessGame | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    setError("");
    setProfile(null);
    setStats(null);
    setGames([]);
    setSelectedGame(null);

    try {
      const [profileData, statsData, gamesData] = await Promise.all([
        getPlayerProfile(username),
        getPlayerStats(username),
        getPlayerGames(username),
      ]);
      setProfile(profileData);
      setStats(statsData);
      setGames(gamesData);
    } catch (err) {
      setError("Could not find player. Please check the username and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="fixed top-4 right-4 z-50">
        </div>

          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  {selectedGame ? (
                    <ChessAnalysis
                      game={selectedGame}
                      onClose={() => setSelectedGame(null)}
                      username={profile?.username}
                    />
                  ) : (
                    <div className="container mx-auto px-4 py-8 max-w-7xl">
                      <div className="text-center mb-10 space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center">
                          {(() => {
                            const { isDark } = useTheme();
                            return (
                                <img
                                  src={isDark ? LogoDarkMode : LogoLightMode}
                                  alt="ChessItOut Logo"
                                  className="h-35 w-60"
                                />
                            );
                          })()}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-prose mx-auto text-balance">
                          Analyze Chess.com profiles, explore game histories, and dive into detailed game analysis.
                        </p>
                      </div>

                      <div className="max-w-2xl mx-auto mb-12">
                        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
                        {error && <ErrorMessage message={error} />}
                      </div>

                      {profile && stats && (
                        <div className="space-y-8 animate-slideUp">
                          <ProfileCard profile={profile} />
                          <StatsCard stats={stats} />
                          <GamesList
                            games={games}
                            username={profile.username}
                            onGameSelect={setSelectedGame}
                          />
                        </div>
                      )}

                      {!profile && !error && !isLoading && (
                        <div className="text-center mt-16 space-y-2 animate-fadeIn">
                          <p className="text-gray-500 text-sm mb-4">Popular Players:</p>
                          <div className="flex justify-center gap-3">
                            {['MagnusCarlsen', 'GukeshDommaraju','TheVish'].map((name) => (
                              <button
                                key={name}
                                onClick={() => handleSearch(name)}
                                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-gray-700 dark:text-gray-300"
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ErrorBoundary>
              }
            />
          </Routes>

          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
          `}</style>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
