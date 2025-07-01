import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import FilterSidebar from "../components/FilterSidebar";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import axios from "axios";
import LocationSelector from "../components/LocationSelector";
import LocationButton from "../components/LocationButton";
import isTokenExpired from "./isTokenExpired";
import { useAuth } from "../context/AuthContext";

const api = "http://localhost:8080/movies";

const Home = () => {
  const { user, login, logout, showLogin, setShowLogin, showSignup, setShowSignup } = useAuth();

  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    language: [],
    sortBy: "relevance",
    genres: [],
  });

  const [selectedTab, setSelectedTab] = useState("now_showing");
  const [selectedLocation, setSelectedLocation] = useState("Mumbai");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwt");
      const isValidToken = token && !isTokenExpired(token);

      const headers = isValidToken
        ? { Authorization: `Bearer ${token}` }
        : {}; // ✅ Don't block if no token

      const response = await axios.get(`${api}/region/${selectedLocation}`, {
        headers,
      });

      setAllMovies(response.data || []);
    } catch (error) {
      console.error("Error fetching movies:", error);

      // Only logout if session expired with token
      if (error.response?.status === 401 && localStorage.getItem("jwt")) {
        logout();
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to fetch movies. Please try again.");
      }

      setAllMovies([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLocation, logout]);



  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const applyFilters = useCallback(
    (movies) => {
      let filtered = [...movies];

      if (filters.language.length > 0) {
        filtered = filtered.filter((movie) => {
          const langs = Array.isArray(movie.language)
            ? movie.language
            : typeof movie.language === "string"
              ? [movie.language]
              : [];
          return filters.language.some((lang) =>
            langs.map((l) => l.toLowerCase()).includes(lang.toLowerCase())
          );
        });
      }

      if (filters.genres.length > 0) {
        filtered = filtered.filter((movie) =>
          filters.genres.some((g) =>
            movie.genre?.some((mg) => mg.toLowerCase().includes(g.toLowerCase()))
          )
        );
      }

      switch (filters.sortBy) {
        case "release_date_desc":
          filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
          break;
        case "release_date_asc":
          filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
          break;
        case "rating_desc":
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "rating_asc":
          filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
          break;
        case "title_asc":
          filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
          break;
        case "title_desc":
          filtered.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
          break;
        default:
          break;
      }

      return filtered;
    },
    [filters]
  );

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedLocation", location);
  };

  const filteredMovies = applyFilters(allMovies);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onLoginClick={() => {
          setShowLogin(true);
          setShowSignup(false);
        }}
        onSignupClick={() => {
          setShowSignup(true);
          setShowLogin(false);
        }}
        user={user}
        onLogout={logout}
      />

      <main className="flex-grow bg-gray-50 px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="bg-gray-100 rounded-full p-1 flex space-x-2 mb-2 md:mb-0">
            <button
              className={`px-4 py-2 rounded-full ${selectedTab === "now_showing" ? "bg-blue-400 text-white" : "text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("now_showing")}
            >
              Now Showing
            </button>
            <button
              className={`px-4 py-2 rounded-full ${selectedTab === "coming_soon" ? "bg-blue-400 text-white" : "text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("coming_soon")}
            >
              Coming Soon
            </button>
          </div>
          <LocationButton selectedLocation={selectedLocation} onClick={() => setIsLocationModalOpen(true)} />
        </div>

        <div className="bg-blue-400 text-white rounded-md px-6 py-4 mb-6">
          <h2 className="text-2xl font-bold">
            {selectedTab === "now_showing" ? "Now Showing" : "Coming Soon"}
          </h2>
          <p>{filteredMovies.length} movies found in {selectedLocation}</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <FilterSidebar onFiltersChange={setFilters} />
          </div>
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-16 w-16 border-4 border-sky-400 border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
                {filteredMovies.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-lg">
                    {user ? "No movies match the selected filters." : "Please login to view movies."}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 pt-10 relative w-full max-w-md">
            <button
              className="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600 z-10"
              onClick={() => setShowLogin(false)}
            >
                ×
            </button>
            <Login
              onLogin={login}
              onSwitch={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
            />
          </div>
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
            <button
              className="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600"
              onClick={() => setShowSignup(false)}
            >
              ×
            </button>
            <Register
              onSwitch={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
            />
          </div>
        </div>
      )}

      <LocationSelector
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
      />
    </div>
  );
};

export default Home;
