import React, { useState } from "react";
import { Search, Loader } from "./icons";

interface SearchFormProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) onSearch(username.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto px-4">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
        
        <div className="relative flex items-center">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Search Chess.com username"
            className="w-full pl-12 pr-20 py-3 text-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-70"
            disabled={isLoading}
          />

          <Search className="absolute left-4 w-5 h-5 text-gray-500 dark:text-gray-400" />

          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="absolute right-1 flex items-center space-x-1 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Search</span>
                <span className="text-blue-200">↵</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
