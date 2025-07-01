import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';

const UserBooking = () => {
  const navigate = useNavigate();
  const { user, logout, showLogin, showSignup, setShowLogin, setShowSignup, login } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = "http://localhost:8080/api/users";
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/${user.id}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (booking) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel this booking?\nMovie: ${booking.show.movie.title}\nTotal Amount: ₹${booking.totalAmount}`
    );
    if (!confirmCancel) return;

    try {
      await axios.delete(`http://localhost:8080/ticket/delete/${booking.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Booking cancelled successfully!");
      fetchBookings();
    } catch (error) {
      console.error("Cancellation error:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const formatTime = (timeString) => timeString || 'Time not available';

  const canCancelBooking = (booking) => {
    const [hour, minute, modifier] = booking.show.showTime.split(/[: ]/);
    let hours = parseInt(hour);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const showDateTime = new Date(booking.show.showDate);
    showDateTime.setHours(hours, parseInt(minute));
    return (showDateTime - new Date()) / (1000 * 60 * 60) > 2;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={fetchBookings} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Try Again</button>
        </div>
      </div>
    );
  }

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
        onLogout={logout}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <button className="text-sky-300 flex items-center mb-6 text-lg font-semibold ml-40" onClick={() => navigate('/')}>
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">
              Book More Tickets
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 text-gray-300 mb-4 text-6xl">🎫</div>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h2>
              <p className="text-gray-500 mb-6">You haven't booked any movies yet.</p>
              <button onClick={() => navigate('/')} className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
                Browse Movies
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={booking.show.movie.poster?.startsWith("http")
                            ? booking.show.movie.poster
                            : `/${booking.show.movie.poster}`}
                          alt={booking.show.movie.title}
                          className="w-20 h-28 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{booking.show.movie.title}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">📍 <span>{booking.show.theater?.name}, {booking.show.theater?.address}, {booking.show.theater?.region}</span></div>
                            <div className="flex items-center gap-2">📅 <span>{formatDate(booking.show.showDate)}</span></div>
                            <div className="flex items-center gap-2">🕐 <span>{formatTime(booking.show.showTime)}</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 mb-1">₹{booking.totalAmount}</div>
                        <div className="text-sm text-gray-500">Booking ID: #{booking.id}</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Seats: </span>
                          <span className="text-sm text-gray-600">{booking.seats.map(seat => seat.seatNumber).join(', ')}</span>
                          <span className="ml-4 text-sm text-gray-500">({booking.seats.length} seat{booking.seats.length > 1 ? 's' : ''})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Booked on: {new Date(booking.dateTime).toLocaleDateString()}</span>
                          {canCancelBooking(booking) && (
                            <button onClick={() => cancelBooking(booking)} className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition">
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {!canCancelBooking(booking) && (
                      <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded">
                        ⚠️ Cancellation not available (show is within 2 hours)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
            <button className="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600" onClick={() => setShowLogin(false)}>×</button>
            <Login
              onLogin={login}
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
            <button className="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600" onClick={() => setShowSignup(false)}>×</button>
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

export default UserBooking;
