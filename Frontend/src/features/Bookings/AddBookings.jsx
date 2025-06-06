import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovies } from '../Movie/MovieContext.jsx';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import CustomDropdown from '../../components/CustomDropdown.jsx';
import { useTheaters } from '../Bookings/TheaterContext.jsx';
import Login from '../auth/Login.jsx';
import Register from '../auth/Register.jsx';

const getTimeBlock = (timeStr) => {
  const [time, meridian] = timeStr.split(' ');
  let [hour] = time.split(':').map(Number);

  if (meridian === 'PM' && hour !== 12) hour += 12;
  if (meridian === 'AM' && hour === 12) hour = 0;

  if (hour >= 6 && hour < 12) return 'Morning (6 AM - 12 PM)';
  if (hour >= 12 && hour < 16) return 'Afternoon (12 PM - 4 PM)';
  if (hour >= 16 && hour < 20) return 'Evening (4 PM - 8 PM)';
  if (hour >= 20 && hour < 24) return 'Night (8 PM - 12 AM)';
  return null;
};

const AddBookings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const allMovies = useMovies();
  const movie = allMovies.find((m) => m.id.toString() === id);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedPreferredTimes, setSelectedPreferredTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const { theaters } = useTheaters();
  const today = new Date();
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label:
        i === 0
          ? 'Today'
          : i === 1
          ? 'Tomorrow'
          : date.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }),
    };
  });

  const priceRangeOptions = ['₹0 - ₹200', '₹200 - ₹400', '₹400 - ₹600', '₹600+'];
  const preferredTimeOptions = [
    'Morning (6 AM - 12 PM)',
    'Afternoon (12 PM - 4 PM)',
    'Evening (4 PM - 8 PM)',
    'Night (8 PM - 12 AM)',
  ];

  const filteredTheaters = theaters
    .map((theater) => ({
      ...theater,
      showtimes: theater.showtimes.filter((show) => {
        if (selectedDate && show.date !== selectedDate) return false;

        if (selectedPriceRanges.length > 0) {
          const prices = Array.isArray(show.seats)
            ? show.seats.map((seat) => seat.price)
            : Object.values(show.seats || {});
          const priceMatch = prices.some((price) =>
            selectedPriceRanges.some((range) => {
              switch (range) {
                case '₹0 - ₹200':
                  return price >= 0 && price <= 200;
                case '₹200 - ₹400':
                  return price > 200 && price <= 400;
                case '₹400 - ₹600':
                  return price > 400 && price <= 600;
                case '₹600+':
                  return price > 600;
                default:
                  return true;
              }
            })
          );
          if (!priceMatch) return false;
        }

        if (selectedPreferredTimes.length > 0) {
          const timeBlock = getTimeBlock(show.time);
          if (!selectedPreferredTimes.includes(timeBlock)) return false;
        }

        return true;
      }),
    }))
    .filter((theater) => theater.showtimes.length > 0);

  if (!movie) {
    return <div className="p-10 text-center text-red-500">Movie not found</div>;
  }

  const sharedBlurStyle = {
    boxShadow: '0 6px 12px -3px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  };

  const imageSrc = movie.poster?.startsWith('http')
    ? movie.poster
    : `/${movie.poster || ''}`;

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
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/movies/${movie.id}`)}
          className="text-sky-300 text-lg font-semibold hover:text-blue-800 mb-6 flex items-center gap-2 transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" /> Back
        </button>

        <div
          className="bg-white rounded-xl p-6 flex gap-6 items-center mb-8"
          style={sharedBlurStyle}
        >
          <img
            src={imageSrc}
            alt={movie.title}
            className="w-28 h-36 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-3xl font-medium mb-1">{movie.title}</h1>
            <p className="text-gray-600 flex flex-wrap gap-5">
              <span>{movie.duration}</span>
              <span>{movie.genre.join(', ')}</span>
              <span>{movie.language}</span>
            </p>
          </div>
        </div>

        <div className="mb-10 rounded-lg p-6" style={sharedBlurStyle}>
          <h2 className="font-medium text-2xl mb-4">Select Date</h2>
          <div className="flex flex-wrap gap-4">
            {dateOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSelectedDate(opt.value);
                  setSelectedTime(null); // reset time selection on date change
                }}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedDate === opt.value
                    ? 'bg-blue-300 text-white border-black font-semibold'
                    : 'bg-white text-black border-gray-300 hover:border-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg p-6 mb-12" style={sharedBlurStyle}>
          <div className="flex items-center flex-wrap mb-6">
            <h2 className="font-medium text-2xl">
              Select Showtime ({filteredTheaters.length} theaters found)
            </h2>
            <div className="flex gap-6 ml-auto mt-2 sm:mt-0">
              <CustomDropdown
                options={priceRangeOptions}
                placeholder="Select Price Range"
                selectedOptions={selectedPriceRanges}
                setSelectedOptions={setSelectedPriceRanges}
              />
              <CustomDropdown
                options={preferredTimeOptions}
                placeholder="Select Preferred Time"
                selectedOptions={selectedPreferredTimes}
                setSelectedOptions={setSelectedPreferredTimes}
              />
            </div>
          </div>

          {filteredTheaters.map((theater) => (
            <div
              key={theater.id}
              className="border p-6 rounded-xl shadow mb-6 transition-all duration-300 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-1">{theater.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{theater.location}</p>

              <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="flex gap-2 flex-wrap">
                  {theater.formats.map((format) => (
                    <span
                      key={format}
                      className="bg-blue-300 text-blue-900 text-sm px-4 py-2 rounded-full font-semibold"
                    >
                      {format}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 flex-wrap">
                  {theater.showtimes.map(({ time }) => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        navigate(
                          `/seat-selection/${movie.id}/${theater.id}/${selectedDate}/${encodeURIComponent(
                            time
                          )}`
                        );
                      }}
                      className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border ${
                        selectedTime === time
                          ? 'bg-blue-300 text-white border-black font-semibold'
                          : 'bg-white text-black border-gray-300 hover:border-gray-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitch={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {showSignup && (
        <Register
          onClose={() => setShowSignup(false)}
          onSwitch={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};

export default AddBookings;
