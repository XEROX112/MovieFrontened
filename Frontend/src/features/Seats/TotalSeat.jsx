import React, { useState } from 'react';

const TotalSeat = ({ onSelect, showId, date, time, seatCategories, showDetails }) => {
  const [selectedCount, setSelectedCount] = useState(1);

  const handleCountChange = (count) => {
    setSelectedCount(count);
  };

  const handleConfirm = () => {
    onSelect(selectedCount);
  };

  // Display seat category information
  const displaySeatInfo = () => {
    if (!seatCategories || seatCategories.length === 0) {
      return <div className="text-gray-500">Loading seat information...</div>;
    }

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Available Seat Categories</h3>
        <div className="space-y-2">
          {seatCategories.map((category) => (
            <div key={category.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{category.title}</span>
                <span className="text-sm text-gray-600 ml-2">
                  ({category.availableSeats} available)
                </span>
              </div>
              <span className="text-lg font-semibold text-green-600">
                ₹{category.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Select Number of Seats</h2>
      
      {/* Show Details */}
      {showDetails && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800">{showDetails.movieTitle}</h3>
          <p className="text-sm text-blue-600">
            {showDetails.theaterName} - {showDetails.screenName}
          </p>
          <p className="text-sm text-blue-600">
            {showDetails.showDate} at {showDetails.showTime}
          </p>
        </div>
      )}

      {/* Seat Categories Information */}
      {displaySeatInfo()}
      
      {/* Seat Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">How many seats?</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
            <button
              key={count}
              onClick={() => handleCountChange(count)}
              className={`w-12 h-12 rounded-full border-2 font-semibold transition-colors ${
                selectedCount === count
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-sky-300'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Price Estimation */}
      {seatCategories && seatCategories.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Estimated Price Range</h4>
          <div className="text-sm text-yellow-700">
            <p>
              Minimum: ₹{Math.min(...seatCategories.map(cat => cat.price)) * selectedCount}
              {seatCategories.length > 1 && (
                <span> - Maximum: ₹{Math.max(...seatCategories.map(cat => cat.price)) * selectedCount}</span>
              )}
            </p>
            <p className="text-xs mt-1">*Final price depends on seat category selection</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleConfirm}
          className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Continue with {selectedCount} seat{selectedCount > 1 ? 's' : ''}
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>You can select seats from different categories on the next page</p>
      </div>
    </div>
  );
};

export default TotalSeat;