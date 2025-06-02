import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import FilterSidebar from "../components/FilterSidebar"; // assuming you saved the sidebar component here

const Home = () => {
  const allMovies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      year: "2019",
      rating: 8.4,
      genre: ["Action", "Adventure", "Science Fiction"],
      language: "en",
      poster: "/placeholder.svg?height=400&width=300",
      description: "The epic conclusion to the Infinity Saga",
      releaseDate: "2019-04-26",
    },
    {
      id: 2,
      title: "Spider-Man: No Way Home",
      year: "2021",
      rating: 8.2,
      genre: ["Action", "Adventure", "Science Fiction"],
      language: "en",
      poster: "/placeholder.svg?height=400&width=300",
      description: "Peter Parker's identity is revealed",
      releaseDate: "2021-12-17",
    },
    {
      id: 3,
      title: "The Dark Knight",
      year: "2008",
      rating: 9.0,
      genre: ["Action", "Crime", "Drama"],
      language: "en",
      poster: "/placeholder.svg?height=400&width=300",
      description: "Batman faces the Joker",
      releaseDate: "2008-07-18",
    },
    {
      id: 4,
      title: "Inception",
      year: "2010",
      rating: 8.8,
      genre: ["Science Fiction", "Thriller"],
      language: "en",
      poster: "/placeholder.svg?height=400&width=300",
      description: "A thief enters dreams to steal secrets",
      releaseDate: "2010-07-16",
    },
    {
      id: 5,
      title: "Dangal",
      year: "2016",
      rating: 8.4,
      genre: ["Drama", "Family"],
      language: "hi",
      poster: "/placeholder.svg?height=400&width=300",
      description: "A former wrestler trains his daughters",
      releaseDate: "2016-12-23",
    },
    {
      id: 6,
      title: "Baahubali 2",
      year: "2017",
      rating: 8.2,
      genre: ["Action", "Adventure", "Drama"],
      language: "te",
      poster: "/placeholder.svg?height=400&width=300",
      description: "The conclusion of the Baahubali saga",
      releaseDate: "2017-04-28",
    },
    {
      id: 7,
      title: "KGF Chapter 2",
      year: "2022",
      rating: 8.3,
      genre: ["Action", "Crime", "Drama"],
      language: "kn",
      poster: "/placeholder.svg?height=400&width=300",
      description: "Rocky's empire faces new challenges",
      releaseDate: "2022-04-14",
    },
    {
      id: 8,
      title: "Dune",
      year: "2021",
      rating: 8.0,
      genre: ["Science Fiction", "Adventure"],
      language: "en",
      poster: "/placeholder.svg?height=400&width=300",
      description: "Paul Atreides leads a rebellion",
      releaseDate: "2021-10-22",
    },
  ];

  const [filters, setFilters] = useState({
    language: "all",
    sortBy: "relevance",
    genres: [],
  });

  const [selectedTab, setSelectedTab] = useState("now_showing");
  const [selectedLocation, setSelectedLocation] = useState("Mumbai");

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
      <Navbar />

      <main className="flex-grow bg-gray-50 px-8 py-4">
        {/* Tabs and Location Selector */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="bg-gray-100 rounded-full p-1 flex space-x-2 mb-2 md:mb-0">
            <button
              className={`px-4 py-2 rounded-full ${
                selectedTab === "now_showing" ? "bg-blue-400 text-white" : "text-gray-700"
              }`}
              onClick={() => setSelectedTab("now_showing")}
            >
              Now Showing
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                selectedTab === "coming_soon" ? "bg-blue-400 text-white" : "text-gray-700"
              }`}
              onClick={() => setSelectedTab("coming_soon")}
            >
              Coming Soon
            </button>
          </div>
          <div>
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
        </div>

        {/* Summary Header */}
        <div className="bg-blue-300 text-white rounded-md px-6 py-4 mb-6">
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
    </div>
  );
};

export default Home;
