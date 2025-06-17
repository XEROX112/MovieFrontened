import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import FilterSidebar from "../components/FilterSidebar";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import isTokenExpired from './isTokenExpired';
import axios from "axios";
import LocationSelector from "../components/LocationSelector"
import LocationButton from "../components/LocationButton"
const api = "http://localhost:8080/admin/movies";

const Home = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    language: [],
    sortBy: 'relevance',
    genres: [],
  });

  const [selectedTab, setSelectedTab] = useState("now_showing");
  const [selectedLocation, setSelectedLocation] = useState("Mumbai");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Initialize user and location from localStorage after component mounts
  useEffect(() => {
    const initializeFromStorage = () => {
      // Initialize location
      const savedLocation = localStorage.getItem("selectedLocation");
      if (savedLocation) {
        setSelectedLocation(savedLocation);
      }

      // Initialize user
      const token = localStorage.getItem("jwt");
      const savedUser = localStorage.getItem("user");

      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        setUser(null);
      } else if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    };

    initializeFromStorage();
  }, []);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwt");

      // Check token before making request
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        setUser(null);
        throw new Error("Authentication required");
      }

      const response = await axios.get(`${api}/region/${selectedLocation}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAllMovies(response.data || []);
    } catch (error) {
      console.error("Error fetching movies:", error);

      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        setUser(null);
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to fetch movies. Please try again.");
      }

      setAllMovies([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Check token expiration periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("jwt");
      if (token && isTokenExpired(token)) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    // Check immediately and then every minute
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, []);

  const applyFilters = useCallback((movies) => {
    let filtered = [...movies];

    // Language filter
    if (filters.language.length > 0) {
      filtered = filtered.filter((movie) => {
        const movieLangs = Array.isArray(movie.language)
          ? movie.language
          : typeof movie.language === "string"
            ? [movie.language]
            : [];

        const normalizedMovieLangs = movieLangs.map((l) => l.toLowerCase().trim());

        return filters.language.some(
          (selectedLang) =>
            normalizedMovieLangs.includes(selectedLang.toLowerCase().trim())
        );
      });
    }

    // Genre filter - Fixed: use some() instead of every() for OR logic
    if (filters.genres.length > 0) {
      filtered = filtered.filter((movie) => {
        if (!Array.isArray(movie.genre)) return false;

        return filters.genres.some((genre) =>
          movie.genre.some((movieGenre) =>
            movieGenre.toLowerCase().includes(genre.toLowerCase())
          )
        );
      });
    }

    // Sorting
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
  }, [filters]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedLocation", location);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
    fetchMovies(); // Refresh movies after login
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    setAllMovies([]); // Clear movies on logout
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
        onLogout={handleLogout}
      />

      <main className="flex-grow bg-gray-50 px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="bg-gray-100 rounded-full p-1 flex space-x-2 mb-2 md:mb-0">
            <button
              className={`px-4 py-2 rounded-full transition-colors ${selectedTab === "now_showing"
                ? "bg-blue-400 text-white"
                : "text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => setSelectedTab("now_showing")}
            >
              Now Showing
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-colors ${selectedTab === "coming_soon"
                ? "bg-blue-400 text-white"
                : "text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => setSelectedTab("coming_soon")}
            >
              Coming Soon
            </button>
          </div>

          <LocationButton
            selectedLocation={selectedLocation}
            onClick={() => setIsLocationModalOpen(true)}
          />
        </div>

        <div className="bg-blue-400 text-white rounded-md px-6 py-4 mb-6">
          <h2 className="text-2xl font-bold">
            {selectedTab === "now_showing" ? "Now Showing" : "Coming Soon"}
          </h2>
          <p>{filteredMovies.length} movies found in {selectedLocation}</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <FilterSidebar onFiltersChange={setFilters} />
          </div>

          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
                {filteredMovies.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">
                      {user ? "No movies match the selected filters." : "Please login to view movies."}
                    </p>
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
          <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
            <button
              className="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600"
              onClick={() => setShowLogin(false)}
              aria-label="Close login modal"
            >
              ×
            </button>
            <Login
              onLogin={handleLogin}
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
              aria-label="Close signup modal"
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