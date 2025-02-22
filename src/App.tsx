import Logo from '../images/Logo.png';
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getPlayerProfile, getPlayerStats, getPlayerGames } from "./services/chessApi";
import { SearchForm } from "./components/SearchForm";
import { ProfileCard } from "./components/ProfileCard";
import { StatsCard } from "./components/StatsCard";
import { GamesList } from "./components/GamesList";
import { ChessAnalysis } from "./components/ChessAnalysis";
import { ErrorMessage } from "./components/ErrorMessage";
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
      <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-all duration-500 relative overflow-hidden">
        {/* Chessboard pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[size:40px_40px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />

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
                  <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen flex flex-col items-center">
                    {/* Hero Section */}
                    <div className="flex flex-col items-center justify-center flex-grow mb-8">
                      <div className="text-center space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center hover:scale-105 transition-transform duration-300">
                          <img
                            src={Logo}
                            alt="Chess Suspect Logo"
                            className="h-24 w-auto"
                          />
                        </h1>
                        <p className="text-white dark:text-gray-200 text-lg md:text-xl font-medium animate-typewriter drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                          AI-powered chess analysis to improve your game.
                        </p>
                      </div>

                      <div className="w-full max-w-3xl mt-12">
                        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
                        {error && <ErrorMessage message={error} />}
                      </div>

                      {profile && stats && (
                        <div className="space-y-8 animate-slideUp w-full">
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
                        <div className="text-center mt-16 space-y-6">
                          <div className="space-y-4">
                            <p className="text-gray-200 text-lg font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                            No account? Try these:
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                              {['Hikaru', 'GukeshDommaraju', 'TheVish'].map((name) => (
                                <button
                                  key={name}
                                  onClick={() => handleSearch(name)}
                                  className="px-4 py-2 bg-gray-900/80 rounded-md text-gray-300 
                                    hover:text-white border border-gray-700 
                                    hover:border-gray-500 shadow-[0_0_10px_rgba(0,0,0,0.2)]
                                    hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                                    transition-all duration-200 hover:scale-105
                                    text-sm backdrop-blur-sm"
                                >
                                  {name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Section */}
                    <footer className="w-full py-8">
                      <p className="text-gray-500 text-sm mb-4 text-center">
                        Connect with me:
                      </p>
                      <div className="flex justify-center space-x-6 animate-fadeIn">
                        {[
                          { href: "https://www.linkedin.com/in/aashishreddy", img: "/images/linkedin.png", alt: "LinkedIn" },
                          { href: "mailto:aashishreddy53@gmail.com", img: "/images/email.png", alt: "Email" },
                          { href: "https://github.com/r-aashish", img: "/images/github.png", alt: "GitHub" },
                          { href: "https://aashish-resume.tiiny.site", img: "/images/resume.png", alt: "Resume" }
                        ].map((link) => (
                          <a
                            key={link.alt}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm 
                              rounded-full hover:scale-110 transition-all duration-300 
                              hover:shadow-lg group"
                          >
                            <img 
                              src={link.img} 
                              alt={link.alt} 
                              className="h-8 w-8 rounded-full" 
                            />
                            {link.alt === "Resume" && (
                              <span className="absolute -top-8 scale-0 rounded bg-gray-800 
                                dark:bg-gray-200 p-2 text-xs text-white dark:text-gray-800 
                                group-hover:scale-100 transition-all"
                              >
                                View Resume
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    </footer>
                  </div>
                )}
              </ErrorBoundary>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;