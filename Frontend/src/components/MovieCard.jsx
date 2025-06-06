import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <div
      className="w-60 bg-white rounded-xl shadow-md overflow-hidden
                 transform transition-transform duration-300 ease-in-out
                 hover:scale-105 relative"  // <-- added relative here
    >
      <div className="relative h-72 bg-gray-200 flex items-center justify-center">
        <img
          src={movie.poster || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={movie.title}
          className="h-72 w-60 object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-black text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
          <span>⭐</span>
          <span>{movie.rating}</span>
        </div>
      </div>

      <div className="p-4 pb-16"> {/* add extra bottom padding for button space */}
        <h2 className="text-lg font-bold">{movie.title}</h2>
        <p className="text-sm text-gray-500 mb-2">
          {movie.year} • {movie.genre.join(", ")}
        </p>
        <p className="text-sm text-gray-700">{movie.description}</p>
      </div>

      <button
  className="bg-sky-300 hover:bg-sky-400 text-white font-semibold py-2 rounded-lg
             absolute bottom-4 left-0 right-0 mx-auto px-6 max-w-[200px]"
  onClick={handleBookNow}
>
  Book Now
</button>

    </div>
  );
};

export default MovieCard;
