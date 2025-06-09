import React from "react";

const BookingCard = ({ booking, onCancel }) => {
  if (!booking || !booking.movie) {
    return null;
  }

  const { movie, date, time, screen, seat } = booking;

  return (
    <div className="bg-white shadow-md rounded-xl w-full max-w-4xl p-6 mb-6 flex gap-6 items-center">
      {/* Movie Poster */}
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-32 h-40 rounded-lg object-cover flex-shrink-0"
      />

      {/* Movie & Booking Details */}
      <div className="flex flex-col justify-between flex-grow min-w-0">
        <div>
          <p className="text-xs text-gray-500">HINDI, 2D</p>
          <h3 className="text-xl font-semibold text-gray-700 truncate">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-600 truncate">{movie.venue}</p>
          <p className="text-sm text-gray-600">
            {date}, {time}
          </p>
        </div>

        <div className="flex gap-10 mt-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold">SCREEN</p>
            <p>{screen}</p>
          </div>
          <div>
            <p className="font-semibold">SEATS</p>
            <p>{seat}</p>
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      <div>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          onClick={onCancel}
        >
          Cancel Ticket
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
