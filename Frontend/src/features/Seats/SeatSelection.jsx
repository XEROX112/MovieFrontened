import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SeatSection from '../../components/SeatSection';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowLeft } from 'react-icons/fa';
import { useMovies } from '../Movie/MovieContext';
import Login from '../auth/Login.jsx';
import Register from '../auth/Register.jsx';
import TotalSeat from './TotalSeat.jsx';
import axios from 'axios';

const SeatSelection = () => {
  // Get showId, date, and time from URL params
  const { showId, date, time } = useParams();

  // State for movie data
  const [movie, setMovie] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [seatCategories, setSeatCategories] = useState([]); // Dynamic seat categories
  const [bookedSeats, setBookedSeats] = useState([]); // Dynamic booked seats
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showTotalSeat, setShowTotalSeat] = useState(true);
  const [totalSeatCount, setTotalSeatCount] = useState(1);

  const navigate = useNavigate();
  const api = "http://localhost:8080/admin";
  const bookingApi = "http://localhost:8080/ticket";
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);

        // Use the updated endpoint that returns ShowDetailsDTO
        const showResponse = await axios.get(`${api}/shows/${showId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const showData = showResponse.data;
        console.log('Show Details:', showData);
        setShowDetails(showData);

        // Set movie data from show details
        if (showData.movieTitle) {
          setMovie({
            title: showData.movieTitle,
            poster: showData.moviePoster,
          });
        }

        // Transform seat categories from backend to frontend format
        if (showData.seatCategories && showData.seatCategories.length > 0) {
          const transformedCategories = showData.seatCategories.map(category => ({
            id: category.categoryId,
            title: category.categoryName, // Updated to use categoryName
            price: category.price,
            totalSeats: category.totalSeats,
            availableSeats: category.availableSeats,
            rows: category.rows, // Use rows from backend
            seatsPerRow: category.seatsPerRow // Use seatsPerRow from backend
          }));
          setSeatCategories(transformedCategories);
        }

        // Fetch booked seats for this show
        await fetchBookedSeats();

        setError(null);
      } catch (err) {
        console.error('Failed to fetch show/movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    if (showId) {
      fetchShowDetails();
    }
  }, [showId, token]);

  const fetchBookedSeats = async () => {
    try {
      const bookedSeatsResponse = await axios.get(`${api}/shows/${showId}/booked-seats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log("booked Seat:" + bookedSeatsResponse.data)
      setBookedSeats(bookedSeatsResponse.data || []);
    } catch (err) {
      console.error('Failed to fetch booked seats:', err);
    }
  };

  const getBookedSeatsForCategory = (categoryRows) => {
  return bookedSeats
    .filter(seat => categoryRows.includes(seat.charAt(0)))
    .map(seat => seat.includes('-') ? seat : `${seat.charAt(0)}-${seat.slice(1)}`);
};



  // Function to handle booking
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
      const seatObjects = await Promise.all(
        selectedSeats.map(async (seatId) => {
          const [row, number] = seatId.split('-');
          
          try {
            const backendSeatNumber = seatId.replace('-', '');
            const seatResponse = await axios.get(`${api}/shows/${showId}/seats/find`, {
              params: {
                seatNumber:backendSeatNumber
              },
              headers: { Authorization: `Bearer ${token}` }
            });
            return seatResponse.data;
          } catch (err) {
              console.log("error"+ err);
          }
        })
      );

      // Create booking request
      const bookingRequest = {
        userId: user.id,
        showId: parseInt(showId),
        requestedSeats: seatObjects
      };

      console.log('Booking Request:', bookingRequest);

      // Make booking API call
      const response = await axios.post(`${bookingApi}/book_ticket`, bookingRequest, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Booking successful
        const booking = response.data;
       console.log("booking details:", JSON.stringify(response.data, null, 2));

        alert(`Booking confirmed! Booking ID: ${booking.id}\nTotal Amount: Rs. ${booking.totalAmount}`);

        // Refresh booked seats to update UI
        await fetchBookedSeats();

        // Clear selected seats
        setSelectedSeats([]);

        // Navigate to booking confirmation or user bookings page
        navigate(`/bookings/${booking.id}`);
      }

    } catch (error) {
      console.error('Booking failed:', error);

      let errorMessage = 'Booking failed. Please try again.';

      if (error.response) {
        // Server responded with error
        if (error.response.status === 400) {
          errorMessage = error.response.data || 'Please select other seats - some seats may no longer be available.';
        } else if (error.response.status === 404) {
          errorMessage = 'Show or user not found.';
        }
      }

      alert(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSelect = (id) => {
    // Allow selecting only up to totalSeatCount
    if (selectedSeats.includes(id)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== id));
    } else {
      if (selectedSeats.length < totalSeatCount) {
        setSelectedSeats((prev) => [...prev, id]);
      } else {
        alert(`You can select only ${totalSeatCount} seats.`);
      }
    }
  };

  const booked = bookedSeats; // Use dynamic booked seats

  const handleTotalSeatSelect = (count) => {
    setTotalSeatCount(count);
    setShowTotalSeat(false);
    setSelectedSeats([]); // reset selected seats on new count
  };

  // Calculate total cost based on selected seats and category price
  const totalCost = selectedSeats.reduce((acc, seatId) => {
    // seatId format "A-1", so row letter = seatId.split('-')[0]
    const row = seatId.split('-')[0];
    const category = seatCategories.find((cat) => cat.rows.includes(row));
    return acc + (category ? category.price : 0);
  }, 0);

  // Loading state
  if (loading) {
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
          onLogout={() => {
            localStorage.removeItem("jwt");
            localStorage.removeItem("user");
            setUser(null);
          }}
        />
        <div className="p-6 text-center">Loading...</div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !movie) {
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
          onLogout={() => {
            localStorage.removeItem("jwt");
            localStorage.removeItem("user");
            setUser(null);
          }}
        />
        <div className="p-6 text-center text-red-500">
          {error || 'Movie not found'}
        </div>
        <Footer />
      </>
    );
  }

  // Format showtime info - handle both new and old data structure
  const showtime = {
    location: showDetails?.theaterName || showDetails?.theater?.name || 'Theater Name',
    date: date ? new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : showDetails?.showDate || 'Date',
    time: decodeURIComponent(time) || showDetails?.showTime || 'Time',
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
        onLogout={() => {
          localStorage.removeItem("jwt");
          localStorage.removeItem("user");
          setUser(null);
        }}
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
            src={movie.poster?.startsWith("http") ? movie.poster : `/${movie.poster}`}
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

        {!showTotalSeat && (
          <>
            <div className="my-6 text-gray-700 font-medium">
              Total Seats Selected: {totalSeatCount}
            </div>
            {seatCategories.map(({ id, title, price, rows, seatsPerRow }) => (
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
          </>
        )}
      </div>

      <Footer />

      {showTotalSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <TotalSeat
              onSelect={handleTotalSeatSelect}
              showId={showId}
              date={date}
              time={time}
              seatCategories={seatCategories} // Pass seat categories to TotalSeat
              showDetails={showDetails} // Pass show details to TotalSeat
            />
          </div>
        </div>
      )}

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

      {!showTotalSeat && selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-300 p-4 z-50 animate-slide-up">
          <div className="flex flex-col items-center">
            <p className="text-lg text-black mb-1">
              Seats Selected: {selectedSeats.length} / {totalSeatCount}
            </p>
            <div className="text-sm text-gray-600 mb-2">
              Selected: {selectedSeats.join(', ')}
            </div>
            <button
              className={`font-semibold px-10 py-2 rounded-full text-lg ${bookingLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-600 text-white'
                }`}
              onClick={handleBooking}
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Processing...' : `Pay: Rs. ${totalCost}`}
            </button>
          </div>
        </div>
      )}

      {/* Add simple slide-up animation */}
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