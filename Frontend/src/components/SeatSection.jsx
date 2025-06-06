
import React from 'react';
import Seat from './Seat';

const SeatSection = ({ title, price, rows, seatsPerRow, bookedSeats, selectedSeats, onSelect }) => {
  const seatRows = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const seatRow = [];
    for (let j = 1; j <= seatsPerRow; j++) {
      const id = `${row}-${j}`;
      const status = bookedSeats.includes(id)
        ? 'booked'
        : selectedSeats.includes(id)
        ? 'selected'
        : 'available';

      seatRow.push(
        <Seat key={id} id={id} status={status} onSelect={onSelect} />
      );
    }

    seatRows.push(
      <div key={row} className="flex items-center mb-2">
        <span className="w-4 mr-2">{row}</span>
        <div className="flex">{seatRow}</div>
        <span className="ml-2 w-4">{row}</span>
      </div>
    );
  }

  return (
    <div className="my-6">
      <h2 className="font-bold text-lg">{title} ₹{price}</h2>
      {seatRows}
    </div>
  );
};

export default SeatSection;
