import React, { useState } from 'react';
import { FaArrowLeft, FaStar, FaClock, FaGlobe, FaFilm } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useMovies } from './MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const allMovies = useMovies();
  const movie = allMovies.find((m) => m.id.toString() === id);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (!movie) {
    return (
      <div className="p-10 text-center text-red-500">
        <p>Movie not found</p>
      </div>
    );
  }

  const imageSrc = movie.poster?.startsWith('http')
    ? movie.poster
    : `/${movie.poster || ''}`; // assumes poster is in public folder

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

            <div className="flex items-center text-gray-600 text-base mb-4">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="mr-3">{movie.rating}</span>
              <span>•</span>
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
                <FaClock className="mr-3 text-gray-500" /> Duration: {movie.duration}
              </p>
              <p className="flex items-center">
                <FaGlobe className="mr-3 text-gray-500" /> Language: {movie.language}
              </p>
              <p className="flex items-center">
                <FaFilm className="mr-3 text-gray-500" />
                Format:{' '}
                {Array.isArray(movie.format) ? movie.format.join(', ') : movie.format}
              </p>
            </div>

            <p className="text-gray-800 mb-7 text-lg">{movie.description}</p>

            <button
              className="bg-sky-300 text-white font-semibold py-3 rounded hover:bg-sky-400 transition text-lg w-full"
              onClick={() => navigate(`/movies/${movie.id}/theaters`)}
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
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                  <p className="font-semibold text-base text-gray-900">{actor.name}</p>
                  <p className="text-sm text-gray-600">{actor.role}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Footer />

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
            <button
              className="absolute top-2 right-3 text-gray-400 text-xl"
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>
            <Login
              onLogin={() => setShowLogin(false)}
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
            <button
              className="absolute top-2 right-3 text-gray-400 text-xl"
              onClick={() => setShowSignup(false)}
            >
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

export default MovieDetails;
