import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Sun, Moon } from './icons';

/**
 * ThemeContextProps interface defines the props for the ThemeContext.
 * It includes properties for the isDark state and the toggleTheme function.
 */
interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

/**
 * ThemeProvider component provides the theme context to its children.
 * It manages the isDark state and the toggleTheme function.
 */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Initialize theme after component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme 
      ? savedTheme === 'dark'
      : systemDark;
    
    setIsDark(initialTheme);
    setHasMounted(true);
  }, []);

  // Update theme and localStorage
  useEffect(() => {
    if (!hasMounted) return;

    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark, hasMounted]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  if (!hasMounted) return null;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        <div className="relative w-5 h-5">
          <Sun
            className={`w-5 h-5 text-amber-500 absolute transition-all duration-300 ${
              isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
            }`}
          />
          <Moon
            className={`w-5 h-5 text-blue-500 absolute transition-all duration-300 ${
              isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
            }`}
          />
        </div>
      </button>
    </ThemeContext.Provider>
  );
};

/**
 * useTheme hook is a custom hook that provides access to the theme context.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
