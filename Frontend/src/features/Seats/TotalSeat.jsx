import React, { useState } from 'react';

const TotalSeat = ({ onSelect }) => {
  const [totalSeat, setTotalSeat] = useState(1);

  const seatOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const ticketCategories = [
    { type: 'NORMAL', price: 220 },
    { type: 'EXECUTIVE', price: 240 },
    { type: 'PREMIUM', price: 260 },
    { type: 'VIP', price: 480 },
  ];

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center p-6">
      <h2 className="text-xl font-semibold mb-6">How Many Seats?</h2>

      <div className="flex justify-center space-x-6 mb-10 px-6 w-full">
        {seatOptions.map((count) => (
          <button
            key={count}
            onClick={() => setTotalSeat(count)}
            className={`
              cursor-pointer
              font-semibold text-lg
              select-none
              rounded-full
              ${totalSeat === count 
                ? 'bg-sky-300 text-white' 
                : 'bg-transparent text-sky-300'}
              hover:bg-sky-300 hover:text-white
              transition-colors duration-200
              p-1
            `}
            style={{ border: 'none', outline: 'none' }}
          >
            {count}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-6 text-center mb-10 w-full max-w-2xl">
        {ticketCategories.map(({ type, price }) => (
          <div key={type}>
            <h4 className="text-sm font-medium">{type}</h4>
            <p className="text-md font-semibold">Rs. {price}</p>
            <span className="text-green-500">Available</span>
          </div>
        ))}
      </div>

      <button
        className="bg-sky-300 hover:bg-sky-400 text-white px-8 py-3 rounded-lg shadow"
        onClick={() => onSelect(totalSeat)}
      >
        Select Seats
      </button>
    </div>
  );
};

export default TotalSeat;
