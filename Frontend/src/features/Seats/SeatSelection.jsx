import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SeatSection from '../../components/SeatSection';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowLeft } from 'react-icons/fa';
import { useMovies } from '../Movie/MovieContext';
import Login from '../auth/Login.jsx';
import Register from '../auth/Register.jsx';

const SeatSelection = () => {
  const { movieId } = useParams();
  const movies = useMovies();
  const movie = movies.find((m) => m.id === movieId);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  if (!movie) return <div className="p-6 text-center">Movie not found</div>;

  const handleSelect = (id) =>
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const booked = [
    'A-3', 'A-4', 'A-9', 'B-5', 'B-6', 'B-11',
    'C-2', 'C-7', 'C-8', 'D-10', 'D-11', 'E-3', 'E-4', 'E-13',
    'G-1', 'H-7', 'H-8', 'H-9', 'I-5', 'I-6', 'J-12', 'J-13', 'K-2', 'K-14',
  ];

  const seatCategories = [
    { title: 'Diamond', price: 450, rows: ['A', 'B'], seatsPerRow: 12 },
    { title: 'Gold', price: 350, rows: ['C', 'D', 'E', 'F'], seatsPerRow: 14 },
    { title: 'Silver', price: 250, rows: ['G', 'H', 'I', 'J', 'K'], seatsPerRow: 16 },
  ];

  const showtime = {
    location: 'PVR Cinemas, Phoenix',
    date: 'Friday, June 6, 2025',
    time: '10:00 AM',
  };

  return (
    <>
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
        onLogout={() => setUser(null)}
      />

      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sky-300 font-semibold text-lg mb-4 ml-[-100px]"
        >
          <FaArrowLeft className="mr-1" /> Back
        </button>

        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-xl font-bold">{movie.title}</h1>
            <div className="text-sm text-gray-600 flex flex-wrap items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-gray-600" /> {showtime.location}
              </span>
              <span className="flex items-center gap-1">
                <FaCalendarAlt className="text-gray-600" /> {showtime.date}
              </span>
              <span className="flex items-center gap-1">
                <FaClock className="text-gray-600" /> {showtime.time}
              </span>
            </div>
          </div>
        </div>

        {seatCategories.map(({ title, price, rows, seatsPerRow }) => (
          <SeatSection
            key={title}
            title={title}
            price={price}
            rows={rows}
            seatsPerRow={seatsPerRow}
            bookedSeats={booked}
            selectedSeats={selectedSeats}
            onSelect={handleSelect}
          />
        ))}

        <div className="mt-10 text-center">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-300 h-2 w-3/4 mx-auto rounded" />
          <div className="mt-2 font-normal text-gray-700">All eyes this way please!</div>
        </div>

        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border border-sky-400 rounded-sm" /> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-sky-400 border-sky-400 rounded-sm" /> Selected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 border-gray-300 rounded-sm" /> Booked
          </div>
        </div>

        
      </div>

      <Footer />

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
            <button className="absolute top-2 right-3 text-gray-400 text-xl" onClick={() => setShowLogin(false)}>
              ×
            </button>
            <Login
              onLogin={(user) => {
                setUser(user);         
                setShowLogin(false);   
              }}
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
    </>
  );
};

export default SeatSelection;
