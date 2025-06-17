import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CustomDropdown from '../../components/CustomDropdown';
import Login from '../auth/Login';
import Register from '../auth/Register';

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
const api = "http://localhost:8080/admin";
const AddBookings = () => {
  const { id: movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const language = searchParams.get('lang');
  const format = searchParams.get('format');
  const region = localStorage.getItem("selectedLocation");

  const token = localStorage.getItem('jwt');
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });

  const [selectedPreferredTimes, setSelectedPreferredTimes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    axios.get(`${api}/movies/get-movie/${movieId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((res) => setMovie(res.data))
      .catch((err) => console.error("Failed to fetch movie", err));
  }, [movieId]);


  useEffect(() => {
    if (selectedDate && language && format) {
      axios.get(`${api}/shows/${region}/theaters`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          time: selectedDate,
        },
        params: {
          movieId,
          lang: language,
          format,
        },
      })
        .then(res => {
          console.log(res.data);
          setTheaters(res.data);
        })
        .catch(err => {
          console.error("Error fetching shows:", err);
          setTheaters([]);
        });
    }
  }, [selectedDate, movieId, language, format]);


  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric'
      }),
    };
  });

  const priceRangeOptions = ['₹0 - ₹200', '₹200 - ₹400', '₹400 - ₹600', '₹600+'];
  const preferredTimeOptions = [
    'Morning (6 AM - 12 PM)', 'Afternoon (12 PM - 4 PM)',
    'Evening (4 PM - 8 PM)', 'Night (8 PM - 12 AM)'
  ];

  const filteredTheaters = theaters.map(theater => ({
    ...theater,
    showtimes: theater.showtimes.filter(show => {
      // Preferred time block check
      if (selectedPreferredTimes.length > 0) {
        const block = getTimeBlock(show.time);
        if (!selectedPreferredTimes.includes(block)) return false;
      }

      // Price check
      if (selectedPriceRanges.length > 0) {
        const priceMatch = show.price.some((price) =>
          selectedPriceRanges.some(range => {
            switch (range) {
              case '₹0 - ₹200': return price <= 200;
              case '₹200 - ₹400': return price > 200 && price <= 400;
              case '₹400 - ₹600': return price > 400 && price <= 600;
              case '₹600+': return price > 600;
              default: return true;
            }
          })
        );
        if (!priceMatch) return false;
      }

      return true;
    })
  })).filter(theater => theater.showtimes.length > 0);

  const imageSrc = movie?.poster?.startsWith("http")
    ? movie.poster
    : `/${movie?.poster || ''}`;

  const sharedBlurStyle = {
    backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.85)',
    boxShadow: '0 6px 12px -3px rgba(0,0,0,0.25)'
  };

  if (!movie) return <div className="p-10 text-center text-red-500">Movie not found</div>;

  return (
    <>
      <Navbar
        onLoginClick={() => { setShowLogin(true); setShowSignup(false); }}
        onSignupClick={() => { setShowSignup(true); setShowLogin(false); }}
        user={user}
        onLogout={() => setUser(null)}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/movies/${movie.id}`)}
          className="text-sky-300 text-lg font-semibold mb-6 flex items-center gap-2"
        >
          <FaArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="bg-white rounded-xl p-6 flex gap-6 items-center mb-8" style={sharedBlurStyle}>
          <img src={imageSrc} alt={movie.title} className="w-28 h-36 rounded-lg object-cover" />
          <div>
            <h1 className="text-3xl font-medium mb-1">{movie.title}</h1>
            <p className="text-gray-600 flex flex-wrap gap-5">
              <span className="flex items-center gap-1"><span className="text-black text-xl">•</span>{movie.duration} mins</span>
              <span className="flex items-center gap-1"><span className="text-black text-xl">•</span>{movie.genre?.join(', ')}</span>
              <span className="flex items-center gap-1"><span className="text-black text-xl">•</span>{movie.language?.join(', ')}</span>
            </p>

          </div>
        </div>

        {/* Date Picker */}
        <div className="mb-10 rounded-lg p-6" style={sharedBlurStyle}>
          <h2 className="text-2xl font-medium mb-4">Select Date</h2>
          <div className="flex gap-4 flex-wrap">
            {dateOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  setSelectedDate(opt.value);
                  setSelectedTime(null);
                }}
                className={`px-5 py-2 rounded-lg text-sm border ${selectedDate === opt.value
                  ? 'bg-blue-300 text-white border-black font-semibold'
                  : 'bg-white text-black border-gray-300 hover:border-gray-700'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Showtime Filter + Results */}
        <div className="rounded-lg p-6 mb-12" style={sharedBlurStyle}>
          <div className="flex items-center flex-wrap mb-6">
            <h2 className="text-2xl font-medium">Select Showtime ({filteredTheaters.length} theaters found)</h2>
            <div className="flex gap-4 ml-auto mt-2 sm:mt-0">
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

          {filteredTheaters.map(theater => (
            <div key={theater.id} className="border p-4 rounded-xl shadow mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left: Theater Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{theater.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{theater.location}</p>
                  <p className="inline-block bg-sky-400 text-white text-base font-medium px-3 py-1 mt-2 rounded-xl">
                    {format}
                  </p>
                </div>

                {/* Right: Showtimes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {theater.showtimes.map(show => (
                    <button
                      key={show.id}
                      onClick={() => {
                        setSelectedTime(show.time);
                        navigate(`/seat-selection/${show.id}/${selectedDate}/${encodeURIComponent(show.time)}`);

                      }}
                      className={` mt-7 flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold border whitespace-nowrap ${selectedTime === show.time
                        ? 'bg-sky-500 text-white border-black'
                        : 'bg-white text-gray-500 border-black hover:border-gray-700'
                        }`}
                    >
                      <FaClock className="w-4 h-4" />
                      {show.time}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
            <button className="absolute top-2 right-3 text-xl text-gray-400" onClick={() => setShowLogin(false)}>×</button>
            <Login onLogin={(u) => { setUser(u); setShowLogin(false); }} onSwitch={() => { setShowLogin(false); setShowSignup(true); }} />
          </div>
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
            <button className="absolute top-2 right-3 text-xl text-gray-400" onClick={() => setShowSignup(false)}>×</button>
            <Register onSwitch={() => { setShowSignup(false); setShowLogin(true); }} />
          </div>
        </div>
      )}
    </>
  );
};

export default AddBookings;
