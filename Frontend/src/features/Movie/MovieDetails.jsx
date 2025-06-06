import React from 'react';
import { FaArrowLeft, FaStar, FaClock, FaGlobe, FaFilm } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useMovies } from './MovieContext';
import { useNavigate, useParams } from 'react-router-dom';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const allMovies = useMovies();
    const movie = allMovies.find((m) => m.id.toString() === id);

    if (!movie) {
        return (
            <div className="p-10 text-center text-red-500">
                <p>Movie not found</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <button
                    className="text-blue-600 flex items-center mb-6 text-lg"
                    onClick={() => navigate('/')}
                >
                    <FaArrowLeft className="mr-2" /> Back 
                </button>


                <div className="bg-white shadow rounded-lg flex flex-col md:flex-row overflow-hidden">
                    <div className="bg-gray-100 w-full md:w-1/3 h-64 md:h-auto flex items-center justify-center">
                        <FaFilm size={56} className="text-gray-400" />
                    </div>

                    <div className="p-6 flex-1">
                        <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>

                        {/* Rating and Year */}
                        <div className="flex items-center text-gray-600 text-base mb-4">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="mr-3">{movie.rating}</span>
                            <span>•</span>
                            <span className="ml-3">{movie.year}</span>
                        </div>

                        {/* Genre Pills in Blue */}
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

                        {/* Duration, Language, Format */}
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

                {/* About the Movie */}
                <div className="mt-12 bg-white p-8 shadow rounded-lg">
                    <h2 className="text-3xl font-semibold mb-5">About the Movie</h2>
                    <p className="text-gray-800 leading-relaxed text-lg">{movie.about}</p>
                </div>

                {/* Cast Section */}
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
        </>
    );
};

export default MovieDetails;
