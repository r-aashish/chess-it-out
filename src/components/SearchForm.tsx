import React, { useState } from "react";

interface SearchFormProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(username.trim().toLowerCase());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto px-4">
      <div className="relative group">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-500 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300" />

        <div className="relative flex items-center">
          {/* Input field */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your Chess.com username"
            className="w-full py-2 px-4 text-base bg-black text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 transition-all duration-200 placeholder:text-gray-400"
            disabled={isLoading}
          />

          {/* Search button with size matching input */}
          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="absolute right-2 flex items-center justify-center w-8 h-8 bg-gray-700 text-white rounded-full border border-white/30 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-4 border-t-4 border-t-gray-300 border-gray-700 animate-spin rounded-full" />
            ) : (
              <span className="text-lg">↵</span> // Arrow for a minimalist look
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
