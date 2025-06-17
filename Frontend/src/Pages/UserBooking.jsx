
import React, { useState, useEffect } from 'react';

const UserBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const api = "http://localhost:8080/ticket";
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api}/get_booking/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data || []);
        setError(null);
      } else {
        throw new Error('Failed to fetch bookings');
      }
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
      const cancelRequest = {
        userId: user.id,
        showId: booking.show.id,
        requestedSeats: booking.seats
      };

      const response = await fetch(`${api}/delete`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(cancelRequest)
      });

      if (response.ok) {
        alert('Booking cancelled successfully!');
        fetchBookings(); // Refresh the bookings list
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString || 'Time not available';
  };

  const canCancelBooking = (booking) => {
    // Allow cancellation if show is more than 2 hours away
    const showDateTime = new Date(`${booking.show.showDate}T${booking.show.showTime}`);
    const now = new Date();
    const timeDiff = showDateTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff > 2;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
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
          <button 
            onClick={fetchBookings}
            className="mt-4 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
          >
            Book More Tickets
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 text-gray-300 mb-4 text-6xl">🎫</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h2>
            <p className="text-gray-500 mb-6">You haven't booked any movies yet.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
            >
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
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {booking.show.movie.title}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">📍</span>
                            <span>{booking.show.theater?.name || 'Theater Name'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">📅</span>
                            <span>{formatDate(booking.show.showDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">🕐</span>
                            <span>{formatTime(booking.show.showTime)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        ₹{booking.totalAmount}
                      </div>
                      <div className="text-sm text-gray-500">
                        Booking ID: #{booking.id}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Seats: </span>
                        <span className="text-sm text-gray-600">
                          {booking.seats.map(seat => seat.seatNumber).join(', ')}
                        </span>
                        <span className="ml-4 text-sm text-gray-500">
                          ({booking.seats.length} seat{booking.seats.length > 1 ? 's' : ''})
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Booked on: {new Date(booking.dateTime).toLocaleDateString()}
                        </span>
                        
                        {canCancelBooking(booking) && (
                          <button
                            onClick={() => cancelBooking(booking)}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          >
                            <span>🗑️</span>
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
  );
};

export default UserBooking;