"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

const FilterSidebar = ({ onFiltersChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedSortBy, setSelectedSortBy] = useState("relevance");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    language: true,
    sortBy: true,
    genre: true,
  });

  const languages = useMemo(() => [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Tamil", label: "Tamil" },
    { value: "Telugu", label: "Telugu" },
    { value: "Malayalam", label: "Malayalam" },
    { value: "Kannada", label: "Kannada" },
    { value: "Bengali", label: "Bengali" },
    { value: "Marathi", label: "Marathi" },
    { value: "Gujarati", label: "Gujarati" },
    { value: "Punjabi", label: "Punjabi" },
  ], []);

  const sortOptions = useMemo(() => [
    { value: "relevance", label: "Relevance" },
    { value: "release_date_desc", label: "Release Date: New to Old" },
    { value: "release_date_asc", label: "Release Date: Old to New" },
    { value: "rating_desc", label: "Rating: High to Low" },
    { value: "rating_asc", label: "Rating: Low to High" },
    { value: "title_asc", label: "Title: A to Z" },
    { value: "title_desc", label: "Title: Z to A" },
  ], []);

  const genres = useMemo(() => [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama",
    "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance",
    "Science Fiction", "Thriller", "War", "Western"
  ], []);

  const selectedLanguageLabel = useMemo(() => {
    if (selectedLanguage.length === 0) return "All Languages";
    if (selectedLanguage.length > 2) {
      return `${selectedLanguage.length} languages selected`;
    }
    return languages
      .filter((l) => selectedLanguage.includes(l.value))
      .map((l) => l.label)
      .join(", ");
  }, [selectedLanguage, languages]);

  const selectedSortLabel = useMemo(
    () => sortOptions.find(s => s.value === selectedSortBy)?.label || "Relevance",
    [selectedSortBy, sortOptions]
  );

  // Memoize the filters object to prevent unnecessary re-renders
  const filters = useMemo(() => ({
    language: selectedLanguage,
    sortBy: selectedSortBy,
    genres: selectedGenres,
  }), [selectedLanguage, selectedSortBy, selectedGenres]);

  // Use useCallback to prevent unnecessary parent re-renders
  const handleFiltersChange = useCallback(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [onFiltersChange, filters]);

  useEffect(() => {
    handleFiltersChange();
  }, [handleFiltersChange]);

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleLanguageChange = useCallback((lang) => {
    setSelectedLanguage(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  }, []);

  const handleSortChange = useCallback((sortBy) => {
    setSelectedSortBy(sortBy);
  }, []);

  const handleGenreToggle = useCallback((genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedLanguage([]);
    setSelectedSortBy("relevance");
    setSelectedGenres([]);
  }, []);

  const removeLanguageFilter = useCallback(() => {
    setSelectedLanguage([]);
  }, []);

  const removeSortFilter = useCallback(() => {
    setSelectedSortBy("relevance");
  }, []);

  const hasActiveFilters = selectedLanguage.length > 0 || 
                          selectedSortBy !== "relevance" || 
                          selectedGenres.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-fit overflow-hidden sticky top-6">
      <div className="p-4 bg-sky-300">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <span role="img" aria-label="Search">🔍</span>
            <h2 className="text-lg font-bold">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Language Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("language")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
          aria-expanded={expandedSections.language}
          aria-controls="language-filter"
        >
          <div className="flex items-center space-x-2">
            <span role="img" aria-label="Language">🌐</span>
            <span className="font-medium text-gray-900">Language</span>
            {selectedLanguage.length > 0 && (
              <span className="bg-sky-300 text-white text-xs px-2 py-1 rounded-full">
                {selectedLanguage.length}
              </span>
            )}
          </div>
          <span className="text-gray-500 transition-transform duration-200" 
                style={{ transform: expandedSections.language ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </button>
        {expandedSections.language && (
          <div id="language-filter" className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
            {languages.map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors duration-150">
                <input
                  type="checkbox"
                  value={value}
                  checked={selectedLanguage.includes(value)}
                  onChange={() => handleLanguageChange(value)}
                  className="w-4 h-4 text-sky-300 focus:ring-sky-300 focus:ring-2 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 select-none">{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sort By Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("sortBy")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
          aria-expanded={expandedSections.sortBy}
          aria-controls="sort-filter"
        >
          <div className="flex items-center space-x-2">
            <span role="img" aria-label="Sort">🗂️</span>
            <span className="font-medium text-gray-900">Sort By</span>
          </div>
          <span className="text-gray-500 transition-transform duration-200" 
                style={{ transform: expandedSections.sortBy ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </button>
        {expandedSections.sortBy && (
          <div id="sort-filter" className="px-4 pb-4 space-y-2">
            {sortOptions.map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors duration-150">
                <input
                  type="radio"
                  name="sortBy"
                  value={value}
                  checked={selectedSortBy === value}
                  onChange={() => handleSortChange(value)}
                  className="w-4 h-4 text-sky-300 focus:ring-sky-300 focus:ring-2 border-gray-300"
                />
                <span className="text-sm text-gray-700 select-none">{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Genre Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("genre")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
          aria-expanded={expandedSections.genre}
          aria-controls="genre-filter"
        >
          <div className="flex items-center space-x-2">
            <span role="img" aria-label="Genre">🏷️</span>
            <span className="font-medium text-gray-900">Genre</span>
            {selectedGenres.length > 0 && (
              <span className="bg-sky-300 text-white text-xs px-2 py-1 rounded-full">
                {selectedGenres.length}
              </span>
            )}
          </div>
          <span className="text-gray-500 transition-transform duration-200" 
                style={{ transform: expandedSections.genre ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </button>
        {expandedSections.genre && (
          <div id="genre-filter" className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
            {genres.map((genre) => (
              <label key={genre} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors duration-150">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                  className="w-4 h-4 text-sky-300 focus:ring-sky-300 focus:ring-2 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 select-none">{genre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">Active Filters:</h3>
          <div className="space-y-1 text-sm">
            {selectedLanguage.length > 0 && (
              <div className="flex items-center justify-between px-2 py-1 rounded bg-blue-50 border border-blue-200">
                <span className="text-blue-800 truncate">Language: {selectedLanguageLabel}</span>
                <button 
                  onClick={removeLanguageFilter} 
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
                  title="Remove language filter"
                  aria-label="Remove language filter"
                >
                  ×
                </button>
              </div>
            )}
            {selectedSortBy !== "relevance" && (
              <div className="flex items-center justify-between px-2 py-1 rounded bg-blue-50 border border-blue-200">
                <span className="text-blue-800 truncate">Sort: {selectedSortLabel}</span>
                <button 
                  onClick={removeSortFilter} 
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
                  title="Remove sort filter"
                  aria-label="Remove sort filter"
                >
                  ×
                </button>
              </div>
            )}
            {selectedGenres.map((genre) => (
              <div key={genre} className="flex items-center justify-between px-2 py-1 rounded bg-blue-50 border border-blue-200">
                <span className="text-blue-800 truncate">{genre}</span>
                <button 
                  onClick={() => handleGenreToggle(genre)} 
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
                  title={`Remove ${genre} filter`}
                  aria-label={`Remove ${genre} filter`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;