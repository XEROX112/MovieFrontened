import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SeatSection from '../../components/SeatSection';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowLeft } from 'react-icons/fa';
import Login from '../auth/Login';
import Register from '../auth/Register';
import TotalSeat from './TotalSeat';
import axios from 'axios';

const SeatSelection = () => {
  const { showId, date, time } = useParams();
  const navigate = useNavigate();
  const { user, setUser, showLogin, showSignup, setShowLogin, setShowSignup } = useAuth();

  const [movie, setMovie] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [seatCategories, setSeatCategories] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTotalSeat, setShowTotalSeat] = useState(true);
  const [totalSeatCount, setTotalSeatCount] = useState(1);

  const api = "http://localhost:8080";
  const bookingApi = "http://localhost:8080/ticket";
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${api}/shows/${showId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const data = res.data;
        setShowDetails(data);
        setMovie({ title: data.movieTitle, poster: data.moviePoster });

        if (data.seatCategories?.length > 0) {
          setSeatCategories(data.seatCategories.map(category => ({
            id: category.categoryId,
            title: category.categoryName,
            price: category.price,
            totalSeats: category.totalSeats,
            availableSeats: category.availableSeats,
            rows: category.rows,
            seatsPerRow: category.seatsPerRow
          })));
        }

        await fetchBookedSeats();
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId]);

  const fetchBookedSeats = async () => {
    try {
      const res = await axios.get(`${api}/shows/${showId}/booked-seats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setBookedSeats(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getBookedSeatsForCategory = (rows) =>
    bookedSeats.filter(seat => rows.includes(seat.charAt(0)))
      .map(seat => seat.includes('-') ? seat : `${seat.charAt(0)}-${seat.slice(1)}`);

  const handleBooking = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    try {
      setBookingLoading(true);
      const seatObjects = await Promise.all(selectedSeats.map(async seatId => {
        const backendSeatNumber = seatId.replace('-', '');
        const res = await axios.get(`${api}/shows/${showId}/seats/find`, {
          params: { seatNumber: backendSeatNumber },
          headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
      }));

      const bookingRequest = {
        userId: user.id,
        showId: parseInt(showId),
        requestedSeats: seatObjects
      };

      const res = await axios.post(`${bookingApi}/book_ticket`, bookingRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 200) {
        const booking = res.data;
        alert(`Booking confirmed! Booking ID: ${booking.id}\nTotal: ₹${booking.totalAmount}`);
        await fetchBookedSeats();
        setSelectedSeats([]);
        navigate(`/`);
      }

    } catch (err) {
      console.error(err);
      alert('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSelect = (id) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats(prev => prev.filter(s => s !== id));
    } else if (selectedSeats.length < totalSeatCount) {
      setSelectedSeats(prev => [...prev, id]);
    } else {
      alert(`You can select only ${totalSeatCount} seats.`);
    }
  };

  const totalCost = selectedSeats.reduce((acc, seatId) => {
    const row = seatId.split('-')[0];
    const category = seatCategories.find(cat => cat.rows.includes(row));
    return acc + (category?.price || 0);
  }, 0);

  const showtime = {
    location: showDetails?.theaterName || 'Theater Name',
    date: date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' }) : '',
    time: decodeURIComponent(time)
  };

  return (
    <>
      <Navbar
        onLoginClick={() => { setShowLogin(true); setShowSignup(false); }}
        onSignupClick={() => { setShowSignup(true); setShowLogin(false); }}
        user={user}
        onLogout={() => { localStorage.clear(); setUser(null); }}
      />

      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-sky-300 font-semibold text-lg mb-4">
          <FaArrowLeft className="mr-1" /> Back
        </button>

        {loading ? (
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="w-16 h-16 bg-sky-400 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="w-1/2 h-5 bg-sky-400 rounded" />
              <div className="w-3/4 h-4 bg-sky-400 rounded" />
            </div>
          </div>
        ) : movie && showDetails && (
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
            <img src={movie.poster?.startsWith("http") ? movie.poster : `/${movie.poster}`} alt={movie.title} className="w-16 h-16 rounded-lg" />
            <div>
              <h1 className="text-xl font-bold">{movie.title}</h1>
              <div className="text-sm text-gray-600 flex gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt /> {showtime.location}
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendarAlt /> {showtime.date}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock /> {showtime.time}
                </span>
              </div>
            </div>
          </div>
        )}

        {!loading && !showTotalSeat && seatCategories.map(({ id, title, price, rows, seatsPerRow }) => (
          <SeatSection
            key={id}
            title={title}
            price={price}
            rows={rows}
            seatsPerRow={seatsPerRow}
            bookedSeats={getBookedSeatsForCategory(rows)}
            selectedSeats={selectedSeats}
            onSelect={handleSelect}
          />
        ))}

        {!loading && !showTotalSeat && (
          <div className="flex flex-col items-center justify-center mt-14 mb-6 ml-7">
            <div className="w-64 h-4 bg-gray-300 rounded-b-full border border-gray-400 shadow-inner" />
            <p className="mt-1 text-gray-500 text-sm font-medium">All eyes this way please!</p>
            <div className="flex justify-center gap-6 items-center text-sm text-gray-700 font-medium mt-4">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 border-2 border-sky-400 rounded-sm" /> Available
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-sky-400 rounded-sm" /> Selected
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-gray-300 rounded-sm" /> Sold
              </div>
            </div>
          </div>
        )}

        {showTotalSeat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <TotalSeat
                onSelect={(count) => {
                  setTotalSeatCount(count);
                  setShowTotalSeat(false);
                  setSelectedSeats([]);
                }}
                showId={showId}
                date={date}
                time={time}
                seatCategories={seatCategories}
                showDetails={showDetails}
              />
            </div>
          </div>
        )}
      </div>

      {!showTotalSeat && selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-300 p-4 z-50 animate-slide-up">
          <div className="flex flex-col items-center">
            <p className="text-lg text-black mb-1">Seats Selected: {selectedSeats.length} / {totalSeatCount}</p>
            <div className="text-sm text-gray-600 mb-2">{selectedSeats.join(', ')}</div>
            <button
              className={`font-semibold px-10 py-2 rounded-full text-lg ${bookingLoading ? 'bg-gray-400' : 'bg-sky-500 hover:bg-sky-600 text-white'}`}
              onClick={handleBooking}
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Processing...' : `Pay: ₹${totalCost}`}
            </button>
            {!user && <p className="mt-2 text-sm text-red-500 font-medium">Please login to continue</p>}
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-md relative">
            <button className="absolute top-2 right-3 text-xl" onClick={() => setShowLogin(false)}>×</button>
            <Login onLogin={(user) => { setUser(user); setShowLogin(false); }} onSwitch={() => { setShowLogin(false); setShowSignup(true); }} />
          </div>
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-md relative">
            <button className="absolute top-2 right-3 text-xl" onClick={() => setShowSignup(false)}>×</button>
            <Register onSwitch={() => { setShowSignup(false); setShowLogin(true); }} />
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease forwards;
        }
      `}</style>
    </>
  );
};

export default SeatSelection;
