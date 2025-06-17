import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaClock, FaGlobe, FaFilm } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';
import BookTicketModal from '../../components/BookTicketModal';
import axios from 'axios';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [formatData, setFormatData] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const token = localStorage.getItem("jwt");
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/admin/movies/get-movie/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setMovie(res.data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
        setMovie(null);
      }
    };

    fetchMovie();
  }, [id]);

  const handleBookTickets = async () => {
    try {
      const region = localStorage.getItem("selectedLocation");
      console.log(region)
      const res = await axios.get(`http://localhost:8080/admin/shows/format/${region}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setFormatData(res.data);
      setShowTicketModal(true);
    } catch (err) {
      console.error("Error fetching format info:", err);
    }
  };

  if (!movie) {
    return (
      <div className="p-10 text-center text-red-500">
        <p>Movie not found</p>
      </div>
    );
  }

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
        user={user}
        onLogout={() => {
          localStorage.removeItem("jwt");
          localStorage.removeItem("user");
          setUser(null);
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          className="text-sky-300 flex items-center mb-6 text-lg font-semibold"
          onClick={() => navigate('/')}
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="bg-white shadow rounded-lg flex flex-col md:flex-row overflow-hidden">
          <div className="w-40 md:w-1/4 h-48 md:h-auto flex-shrink-0">
            <img
              src={imageSrc}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 flex-1">
            <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>

            <div className="text-gray-600 text-base mb-4">
              <span className="ml-3">{movie.year}</span>
            </div>

            <div className="flex flex-wrap gap-3 mb-5">
              {Array.isArray(movie.genre) &&
                movie.genre.map((genre) => (
                  <span
                    key={genre}
                    className="bg-sky-300 text-white text-base px-5 py-2 rounded-full font-medium"
                  >
                    {genre}
                  </span>
                ))}
            </div>

            <div className="text-base text-gray-700 space-y-3 mb-5">
              <p className="flex items-center">
                <FaClock className="mr-3 text-gray-500" /> Duration: {movie.duration} minutes
              </p>
              <p className="flex items-center">
                <FaGlobe className="mr-3 text-gray-500" /> Language:{" "}
                {movie.language?.join(", ")}
              </p>
              <p className="flex items-center">
                <FaFilm className="mr-3 text-gray-500" /> Format:{" "}
                {movie.format?.join(", ")}
              </p>
            </div>

            <p className="text-gray-800 mb-7 text-lg">{movie.description}</p>

            <button
              className="bg-sky-300 text-white font-semibold py-3 rounded hover:bg-sky-400 transition text-lg w-full"
              onClick={handleBookTickets}
            >
              Book Tickets
            </button>
          </div>
        </div>

        <div className="mt-12 bg-white p-8 shadow rounded-lg">
          <h2 className="text-3xl font-semibold mb-5">About the Movie</h2>
          <p className="text-gray-800 leading-relaxed text-lg">{movie.about}</p>
        </div>

        <div className="mt-12 bg-white p-8 shadow rounded-lg">
          <h2 className="text-3xl font-semibold mb-8">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 text-center">
            {Array.isArray(movie.cast) &&
              movie.cast.map((actor) => (
                <div key={actor.name} className="flex flex-col items-center">
                  <img
                    src={actor.photo?.startsWith("http") ? actor.photo : `/${actor.photo}`}
                    alt={actor.name}
                    className="w-24 h-24 rounded-full mb-4 object-cover"
                  />
                  <p className="font-semibold text-base text-gray-900">{actor.name}</p>
                  <p className="text-sm text-gray-600">{actor.role}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Login Modal */}
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

      {/* Signup Modal */}
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

      {/* Format & Language Modal */}
      <BookTicketModal
        visible={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        movie={formatData} 
        onFormatSelect={(language, format) => {
          setShowTicketModal(false);
          navigate(`/movies/${movie.id}/theaters?lang=${language}&format=${format}`);
        }}
      />

    </>
  );
};

export default MovieDetails; 