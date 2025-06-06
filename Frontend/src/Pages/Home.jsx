import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import FilterSidebar from "../components/FilterSidebar";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import { useMovies } from "../features/Movie/MovieContext";


const Home = () => {
  
  const allMovies = useMovies();

  console.log(allMovies);
  const [filters, setFilters] = useState({
    language: "all",
    sortBy: "relevance",
    genres: [],
  });

  const [selectedTab, setSelectedTab] = useState("now_showing");
  const [selectedLocation, setSelectedLocation] = useState("Mumbai");

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const applyFilters = (movies) => {
    let filtered = [...movies];

    if (filters.language !== "all") {
      filtered = filtered.filter((movie) => movie.language === filters.language);
    }

    if (filters.genres.length > 0) {
      filtered = filtered.filter((movie) =>
        filters.genres.every((genre) => movie.genre.includes(genre))
      );
    }

    switch (filters.sortBy) {
      case "release_date_desc":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "release_date_asc":
        filtered.sort((a, b) => a.year - b.year);
        break;
      case "rating_desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating_asc":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "title_asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return filtered;
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
      />

      <main className="flex-grow bg-gray-50 px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="bg-gray-100 rounded-full p-1 flex space-x-2 mb-2 md:mb-0">
            <button
              className={`px-4 py-2 rounded-full ${selectedTab === "now_showing" ? "bg-blue-400 text-white" : "text-gray-700"
                }`}
              onClick={() => setSelectedTab("now_showing")}
            >
              Now Showing
            </button>
            <button
              className={`px-4 py-2 rounded-full ${selectedTab === "coming_soon" ? "bg-blue-400 text-white" : "text-gray-700"
                }`}
              onClick={() => setSelectedTab("coming_soon")}
            >
              Coming Soon
            </button>
          </div>
          <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        <div className="bg-blue-400 text-white rounded-md px-6 py-4 mb-6">
          <h2 className="text-2xl font-bold">{selectedTab === "now_showing" ? "Now Showing" : "Coming Soon"}</h2>
          <p>{filteredMovies.length} movies found in {selectedLocation}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <FilterSidebar onFiltersChange={setFilters} />
          </div>
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            {filteredMovies.length === 0 && (
              <p className="text-gray-500 mt-4">No movies match the selected filters.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
            <button className="absolute top-2 right-3 text-gray-400 text-xl" onClick={() => setShowLogin(false)}>
              ×
            </button>
            <Login
              onLogin={() => setShowLogin(false)}
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
            <button className="absolute top-2 right-3 text-gray-400 text-xl" onClick={() => setShowSignup(false)}>
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
    </div>
  );
};

export default Home;
