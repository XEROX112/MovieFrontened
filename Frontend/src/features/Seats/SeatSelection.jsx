
import React, { useState } from 'react';
import SeatSection from '../../components/SeatSection';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSelect = (id) => {
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((seat) => seat !== id) : [...prev, id]
    );
  };

  const booked = [
    'A-3', 'A-4', 'A-9', 'B-5', 'B-6', 'B-11',
    'C-2', 'C-7', 'C-8', 'D-10', 'D-11', 'E-3', 'E-4', 'E-13',
    'G-1', 'H-7', 'H-8', 'H-9', 'I-5', 'I-6', 'J-12', 'J-13', 'K-2', 'K-14'
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
  <div className="w-16 h-16 bg-gray-200 rounded-lg" />
  <div>
    <h1 className="text-xl font-bold">Inception</h1>
    <div className="text-sm text-gray-600 flex flex-wrap items-center gap-4 mt-1">
      <span className="flex items-center gap-1">
        <FaCalendarAlt className="text-gray-600" /> Friday, June 6, 2025
      </span>
      <span className="flex items-center gap-1">
        <FaClock className="text-gray-600" /> 10:00 AM
      </span>
      <span className="flex items-center gap-1">
        <FaMapMarkerAlt className="text-gray-600" /> PVR Cinemas Phoenix
      </span>
    </div>
  </div>
</div>

        {/* Screen Indicator */}
        <div className="mt-10 text-center">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-300 h-2 w-3/4 mx-auto rounded" />
          <div className="mt-2 font-medium text-gray-700">SCREEN</div>
        </div>

        {/* Seat Sections in Silver → Gold → Diamond order */}
        <SeatSection
          title="Silver"
          price={250}
          rows={['G', 'H', 'I', 'J', 'K']}
          seatsPerRow={16}
          bookedSeats={booked}
          selectedSeats={selectedSeats}
          onSelect={handleSelect}
        />
        <SeatSection
          title="Gold"
          price={350}
          rows={['C', 'D', 'E', 'F']}
          seatsPerRow={14}
          bookedSeats={booked}
          selectedSeats={selectedSeats}
          onSelect={handleSelect}
        />
        <SeatSection
          title="Diamond"
          price={450}
          rows={['A', 'B']}
          seatsPerRow={12}
          bookedSeats={booked}
          selectedSeats={selectedSeats}
          onSelect={handleSelect}
        />

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-300" /> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-300" /> Selected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500" /> Booked
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SeatSelection;
