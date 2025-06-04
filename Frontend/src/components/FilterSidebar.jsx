"use client";

import React, { useState, useEffect, useMemo } from "react";

const FilterSidebar = ({ onFiltersChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedSortBy, setSelectedSortBy] = useState("relevance");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    language: true,
    sortBy: true,
    genre: true,
  });

  const languages = [
    { value: "all", label: "All Languages" },
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "ta", label: "Tamil" },
    { value: "te", label: "Telugu" },
    { value: "ml", label: "Malayalam" },
    { value: "kn", label: "Kannada" },
    { value: "bn", label: "Bengali" },
    { value: "mr", label: "Marathi" },
    { value: "gu", label: "Gujarati" },
    { value: "pa", label: "Punjabi" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "release_date_desc", label: "Release Date: New to Old" },
    { value: "release_date_asc", label: "Release Date: Old to New" },
    { value: "rating_desc", label: "Rating: High to Low" },
    { value: "rating_asc", label: "Rating: Low to High" },
    { value: "title_asc", label: "Title: A to Z" },
    { value: "title_desc", label: "Title: Z to A" },
  ];

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama",
    "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance",
    "Science Fiction", "Thriller", "War", "Western"
  ];

  const selectedLanguageLabel = useMemo(
    () => languages.find(l => l.value === selectedLanguage)?.label,
    [selectedLanguage]
  );

  const selectedSortLabel = useMemo(
    () => sortOptions.find(s => s.value === selectedSortBy)?.label,
    [selectedSortBy]
  );

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        language: selectedLanguage,
        sortBy: selectedSortBy,
        genres: selectedGenres,
      });
    }
  }, [selectedLanguage, selectedSortBy, selectedGenres]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLanguageChange = (language) => setSelectedLanguage(language);

  const handleSortChange = (sortBy) => setSelectedSortBy(sortBy);

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const clearAllFilters = () => {
    setSelectedLanguage("all");
    setSelectedSortBy("relevance");
    setSelectedGenres([]);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-fit overflow-hidden sticky top-6">
      <div className="p-4" style={{ backgroundColor: "#87CEEB" }}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <span>🔍</span>
            <h2 className="text-lg font-bold">Filters</h2>
          </div>
          <button
            onClick={clearAllFilters}
            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Language Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("language")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          aria-expanded={expandedSections.language}
        >
          <div className="flex items-center space-x-2">
            <span>🌐</span>
            <span className="font-medium text-gray-900">Language</span>
          </div>
          <span className="text-gray-500">{expandedSections.language ? "▲" : "▼"}</span>
        </button>
        {expandedSections.language && (
          <div className="px-4 pb-4 space-y-2">
            {languages.map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value={value}
                  checked={selectedLanguage === value}
                  onChange={() => handleLanguageChange(value)}
                  className="w-4 h-4"
                  style={{ accentColor: "#87CEEB" }}
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sort By Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("sortBy")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          aria-expanded={expandedSections.sortBy}
        >
          <div className="flex items-center space-x-2">
            <span>🗓️</span>
            <span className="font-medium text-gray-900">Sort By</span>
          </div>
          <span className="text-gray-500">{expandedSections.sortBy ? "▲" : "▼"}</span>
        </button>
        {expandedSections.sortBy && (
          <div className="px-4 pb-4 space-y-2">
            {sortOptions.map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value={value}
                  checked={selectedSortBy === value}
                  onChange={() => handleSortChange(value)}
                  className="w-4 h-4"
                  style={{ accentColor: "#87CEEB" }}
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Genre Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("genre")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          aria-expanded={expandedSections.genre}
        >
          <div className="flex items-center space-x-2">
            <span>🏷️</span>
            <span className="font-medium text-gray-900">Genre</span>
            {selectedGenres.length > 0 && (
              <span className="text-white text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#87CEEB" }}>
                {selectedGenres.length}
              </span>
            )}
          </div>
          <span className="text-gray-500">{expandedSections.genre ? "▲" : "▼"}</span>
        </button>
        {expandedSections.genre && (
          <div className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
            {genres.map((genre) => (
              <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                  className="w-4 h-4"
                  style={{ accentColor: "#87CEEB" }}
                />
                <span className="text-sm text-gray-700">{genre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {(selectedLanguage !== "all" || selectedSortBy !== "relevance" || selectedGenres.length > 0) && (
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">Active Filters:</h3>
          <div className="space-y-1 text-sm">
            {selectedLanguage !== "all" && (
              <div className="flex items-center justify-between px-2 py-1 rounded" style={{ backgroundColor: "#E6F3FF" }}>
                <span>Language: {selectedLanguageLabel}</span>
                <button onClick={() => setSelectedLanguage("all")} className="ml-2" title="Remove language" style={{ color: "#87CEEB" }}>×</button>
              </div>
            )}
            {selectedSortBy !== "relevance" && (
              <div className="flex items-center justify-between px-2 py-1 rounded" style={{ backgroundColor: "#E6F3FF" }}>
                <span>Sort: {selectedSortLabel}</span>
                <button onClick={() => setSelectedSortBy("relevance")} className="ml-2" title="Remove sort" style={{ color: "#87CEEB" }}>×</button>
              </div>
            )}
            {selectedGenres.map((genre) => (
              <div key={genre} className="flex items-center justify-between px-2 py-1 rounded" style={{ backgroundColor: "#E6F3FF" }}>
                <span>{genre}</span>
                <button onClick={() => handleGenreToggle(genre)} className="ml-2" title={`Remove ${genre}`} style={{ color: "#87CEEB" }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
