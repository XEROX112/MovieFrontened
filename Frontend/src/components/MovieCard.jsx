import React from "react";

const MovieCard = ({ movie }) => {
  return (
    <div
      className="w-72 bg-white rounded-xl shadow-md overflow-hidden
                 transform transition-transform duration-300 ease-in-out
                 hover:scale-105"
    >
      <div className="relative h-72 bg-gray-200 flex items-center justify-center">
        <img
          src={movie.poster || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-black text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
          <span>⭐</span>
          <span>{movie.rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold">{movie.title}</h2>
        <p className="text-sm text-gray-500 mb-2">{movie.year} • {movie.genre.join(", ")}</p>
        <p className="text-sm text-gray-700 mb-4">
          {movie.description}
        </p>
        <button className="w-full bg-sky-300 hover:bg-sky-400 text-white font-semibold py-2 rounded-lg">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
