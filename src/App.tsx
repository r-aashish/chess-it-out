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

/**
 * App component is the main component of the application.
 * It handles the overall layout, routing, and data fetching.
 */
const App = () => {
  // State variables
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [stats, setStats] = useState<ChessStats | null>(null);
  const [games, setGames] = useState<ChessGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<ChessGame | null>(null);
  const [prevGames, setPrevGames] = useState<ChessGame[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleSearch function handles the search for a Chess.com username.
   * It fetches the player profile, stats, and games, and updates the state accordingly.
   * @param username - The username to search for.
   */
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-all duration-500 relative overflow-hidden">
          {/* Chessboard pattern overlay with pointer-events disabled */}
          <div
            className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[size:40px_40px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"
          />

          {/* Animated background elements with pointer-events disabled */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-15 dark:opacity-[0.03]">
            {/* Floating chess pieces */}
            <img
              src="/images/Pieces/wB.svg"
              className="absolute top-1/4 left-1/6 w-16 h-16 animate-float animation-delay-1000"
              alt="White Bishop"
            />
            <img
              src="/images/Pieces/bQ.svg"
              className="absolute top-1/3 right-1/5 w-16 h-16 animate-float animation-delay-3000"
              alt="Black Queen"
            />
            <img
              src="/images/Pieces/wN.svg"
              className="absolute bottom-1/4 left-1/4 w-16 h-16 animate-float animation-delay-2000"
              alt="White Knight"
            />

            {/* Gradient blobs */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl dark:bg-purple-900/30 animate-blob"></div>
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl dark:bg-pink-900/30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl dark:bg-blue-900/30 animate-blob animation-delay-4000"></div>
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
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center hover:scale-105 transition-transform duration-300">
                          {(() => {
                            const { isDark } = useTheme();
                            return (
                                <img
                                  src={isDark ? LogoDarkMode : LogoLightMode}
                                  alt="ChessItOut Logo"
                                  className="h-40 w-72"
                                />
                            );
                          })()}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg text-balance animate-typewriter">
                          Explore Chess.com profiles and analyze game histories.
                        </p>
                      </div>

                      <div className="max-w-3xl mx-auto mb-8">
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
                            isLoading={isLoading}
                          />
                        </div>
                      )}

                      {!profile && !error && !isLoading && (
                        <div className="text-center mt-16 space-y-2">
                          <p className="text-gray-500 text-sm mb-4"> Try these usernames </p>
                          <div className="flex justify-center gap-3">
                            {['Hikaru', 'GukeshDommaraju','TheVish'].map((name) => (
                              <a
                                key={name}
                                href={`https://www.chess.com/member/${name}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleSearch(name);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-gray-700 dark:text-gray-300 hover:scale-105"
                              >
                                {name}
                              </a>
                            ))}
                          </div>
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />

                          <p className="text-gray-500 text-sm mt-12 mb-4 text-center">Connect with me:</p>
                          <div id="initial-links" className="flex justify-center space-x-6 mt-6 animate-fadeIn">
                            <a
                              href="https://www.linkedin.com/in/aashishreddy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-full hover:scale-110 transition-all duration-300 hover:shadow-lg group"
                            >
                              <img src="/images/linkedin.png" alt="LinkedIn" className="h-8 w-8 rounded-full" />
                            </a>
                            <a
                              href="mailto:aashishreddy53@gmail.com"
                              className="p-2 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-full hover:scale-110 transition-all duration-300 hover:shadow-lg group"
                            >
                              <img src="/images/email.png" alt="Email" className="h-8 w-8 rounded-full" />                              
                            </a>
                            <a
                              href="https://github.com/r-aashish"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-full hover:scale-110 transition-all duration-300 hover:shadow-lg group"
                            >
                              <img src="/images/github.png" alt="GitHub" className="h-8 w-8 rounded-full" />                              
                            </a>
                            <a
                              href="https://aashish-resume.tiiny.site"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-full hover:scale-110 transition-all duration-300 hover:shadow-lg group"
                            >
                              <img src="/images/resume.png" alt="Resume" className="h-8 w-8 rounded-full" />
                              <span className="absolute -top-8 scale-0 rounded bg-gray-800 dark:bg-gray-200 p-2 text-xs text-white dark:text-gray-800 group-hover:scale-100 transition-all">
                                View Resume
                              </span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ErrorBoundary>
              }
            />
          </Routes>

          {/* Sidebar with links (remove "hidden" class if you want it visible) */}
          <div id="sidebar" className="fixed top-0 left-0 h-full w-16 py-4 z-50 flex flex-col items-center hidden">
            <a
              href="https://www.linkedin.com/in/aashishreddy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity duration-200 mb-4"
            >
              <img src="/images/linkedin.png" alt="LinkedIn" className="h-6 w-6 rounded-full" />
            </a>
            <a
              href="mailto:aashishreddy53@gmail.com"
              className="hover:opacity-75 transition-opacity duration-200 mb-4"
            >
              <img src="/images/email.png" alt="Email" className="h-6 w-6 rounded-full" />
            </a>
            <a
              href="https://github.com/r-aashish"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity duration-200 mb-4"
            >
              <img src="/images/github.png" alt="GitHub" className="h-6 w-6 rounded-full" />
            </a>
            <a
              href="https://aashish-resume.tiiny.site"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity duration-200"
            >
              <img src="/images/resume.png" alt="Resume" className="h-6 w-6 rounded-full" />
            </a>
          </div>

          <style>{`
            /* Keyframes for animations */
            @keyframes typewriter {
              from { width: 0 }
              to { width: 100% }
            }
            .animate-typewriter {
              animation: typewriter 3s steps(40) 1s both,
                         blinkTextCursor 500ms steps(40) infinite;
              overflow: hidden;
              white-space: nowrap;
            }
            @keyframes blinkTextCursor {
              from { border-right-color: transparent }
              to { border-right-color: inherit }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes float {
              0% { transform: translateY(0px) rotate(-2deg); }
              50% { transform: translateY(-20px) rotate(2deg); }
              100% { transform: translateY(0px) rotate(-2deg); }
            }
            @keyframes blob {
              0% { transform: scale(1) translate(0, 0); }
              33% { transform: scale(1.1) translate(20px, -20px); }
              66% { transform: scale(0.9) translate(-20px, 20px); }
              100% { transform: scale(1) translate(0, 0); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            /* Animation classes */
            .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
            .animate-float { animation: float 6s ease-in-out infinite; }
            .animate-blob { animation: blob 12s ease-in-out infinite both; }
          `}</style>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
