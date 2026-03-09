import Logo from '../images/Logo.png';
import LinkedInLogo from '../images/Linkedin.png';
import EmailLogo from '../images/Email.png';
import GithubLogo from '../images/Github.png';
import ResumeLogo from '../images/Resume.png';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sparkles, Wand2 } from 'lucide-react';
import { getPlayerProfile, getPlayerStats, getPlayerGames } from './services/chessApi';
import { SearchForm } from './components/SearchForm';
import { ProfileCard } from './components/ProfileCard';
import { StatsCard } from './components/StatsCard';
import { GamesList } from './components/GamesList';
import { ChessAnalysis } from './components/ChessAnalysis';
import { ErrorMessage } from './components/ErrorMessage';
import ErrorBoundary from './components/ErrorBoundary';
import { PlayerProfile, ChessStats, ChessGame } from './types/chess';
import { ThemeToggle } from './components/ThemeToggle';

const RECENT_SEARCHES_KEY = 'chess-it-out-recent-searches';
const MAX_RECENT_SEARCHES = 6;

const App = () => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [stats, setStats] = useState<ChessStats | null>(null);
  const [games, setGames] = useState<ChessGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<ChessGame | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem(RECENT_SEARCHES_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((name) => typeof name === 'string').slice(0, MAX_RECENT_SEARCHES);
    } catch {
      return [];
    }
  });

  const handleSearch = async (username: string) => {
    const normalizedUsername = username.trim().toLowerCase();
    if (!normalizedUsername) return;

    setIsLoading(true);
    setError('');
    setProfile(null);
    setStats(null);
    setGames([]);
    setSelectedGame(null);

    try {
      const [profileData, statsData, gamesData] = await Promise.all([
        getPlayerProfile(normalizedUsername),
        getPlayerStats(normalizedUsername),
        getPlayerGames(normalizedUsername),
      ]);

      setProfile(profileData);
      setStats(statsData);
      setGames(gamesData);

      setRecentSearches((previous) => {
        const deduped = [
          profileData.username,
          ...previous.filter((name) => name.toLowerCase() !== profileData.username.toLowerCase()),
        ].slice(0, MAX_RECENT_SEARCHES);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(deduped));
        }

        return deduped;
      });
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : 'Could not fetch this profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const featuredAccounts = ['Hikaru', 'MagnusCarlsen', 'TheVish'];

  const socialLinks = [
    { href: 'https://www.linkedin.com/in/aashishreddy', img: LinkedInLogo, alt: 'LinkedIn' },
    { href: 'mailto:aashishreddy53@gmail.com', img: EmailLogo, alt: 'Email' },
    { href: 'https://github.com/r-aashish', img: GithubLogo, alt: 'GitHub' },
    { href: 'https://aashish-resume.tiiny.site', img: ResumeLogo, alt: 'Resume' },
  ];

  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="app-gradient-mesh" />

        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                {selectedGame ? (
                  <ChessAnalysis game={selectedGame} onClose={() => setSelectedGame(null)} username={profile?.username} />
                ) : (
                  <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
                    <header className="ui-panel flex items-center justify-between rounded-2xl px-4 py-3 md:px-6">
                      <div className="flex items-center gap-3">
                        <img src={Logo} alt="ChessItOut" className="h-11 w-auto" />
                        <div>
                          <p className="ui-heading text-base font-bold md:text-lg">ChessItOut</p>
                          <p className="ui-muted text-xs md:text-sm">A post-game detective board for online chess</p>
                        </div>
                      </div>
                      <ThemeToggle />
                    </header>

                    <section className="ui-panel relative overflow-hidden rounded-[32px] p-6 md:p-10">
                      <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-amber-500/20 blur-3xl" />
                      <div className="absolute -bottom-10 left-1/2 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl" />

                      <div className="relative grid gap-7 lg:grid-cols-[1.45fr_0.9fr]">
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <p className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                              <Sparkles className="h-3.5 w-3.5" />
                              Read the clues in your games
                            </p>
                            <h1 className="ui-heading max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
                              Every game leaves fingerprints.
                              <br />
                              This board shows where the plan cracked.
                            </h1>
                            <p className="ui-muted max-w-2xl text-sm md:text-base">
                              Enter a Chess.com handle, review recent battles, and walk through critical moments with engine-backed context.
                            </p>
                          </div>

                          <div className="max-w-3xl">
                            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
                            {error ? <ErrorMessage message={error} /> : null}
                          </div>

                          <div className="space-y-3">
                            {recentSearches.length > 0 ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Recent</span>
                                {recentSearches.map((name) => (
                                  <button
                                    key={name}
                                    onClick={() => handleSearch(name)}
                                    className="ui-chip px-3 py-1 text-xs font-semibold"
                                    type="button"
                                  >
                                    {name}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRecentSearches([]);
                                    if (typeof window !== 'undefined') {
                                      window.localStorage.removeItem(RECENT_SEARCHES_KEY);
                                    }
                                  }}
                                  className="ui-link text-xs font-semibold"
                                >
                                  Clear
                                </button>
                              </div>
                            ) : null}

                            {!profile && !error && !isLoading ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Try</span>
                                {featuredAccounts.map((name) => (
                                  <button
                                    key={name}
                                    onClick={() => handleSearch(name)}
                                    className="ui-chip px-3 py-1 text-xs font-semibold"
                                    type="button"
                                  >
                                    {name}
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <aside className="ui-panel-subtle flex flex-col justify-between rounded-3xl p-5">
                          <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">What you get</p>
                            <ul className="space-y-2 text-sm leading-relaxed text-[var(--text)]">
                              <li>Game-by-game trend scan.</li>
                              <li>Fast opponent and time-control filters.</li>
                              <li>Interactive board with engine guidance.</li>
                            </ul>
                          </div>

                          <div className="rounded-2xl bg-[var(--accent-soft)] p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Workflow</p>
                            <p className="mt-1 text-sm text-[var(--text)]">Search profile → pick game → inspect moves → export PGN + notes.</p>
                          </div>
                        </aside>
                      </div>

                    </section>

                    {profile && stats ? (
                      <section className="space-y-5">
                        <div className="ui-panel-subtle flex items-center justify-between rounded-2xl px-4 py-3">
                          <p className="ui-heading text-sm font-semibold md:text-base">Loaded profile: {profile.username}</p>
                          <span className="ui-badge inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold">
                            <Wand2 className="h-3.5 w-3.5" />
                            Ready for move breakdown
                          </span>
                        </div>

                        <ProfileCard profile={profile} stats={stats} />
                        <StatsCard stats={stats} />
                        <GamesList
                          games={games}
                          username={profile.username}
                          onGameSelect={setSelectedGame}
                          isLoading={isLoading}
                        />
                      </section>
                    ) : null}

                    <footer className="ui-panel mt-auto flex flex-col gap-3 rounded-2xl px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                      <p className="ui-muted text-sm">Built by Aashish. Connect:</p>
                      <div className="flex flex-wrap gap-3">
                        {socialLinks.map((link) => (
                          <a
                            key={link.alt}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ui-btn-secondary inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold"
                          >
                            <img src={link.img} alt={link.alt} className="h-5 w-5 rounded-full" />
                            {link.alt}
                          </a>
                        ))}
                      </div>
                    </footer>
                  </main>
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
