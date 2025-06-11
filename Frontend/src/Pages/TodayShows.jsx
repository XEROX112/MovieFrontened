import React, { useState } from 'react';

const initialShows = [
  {
    id: 1,
    title: 'Inception',
    poster: 'https://www.themoviedb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    shows: [
      { time: '09:30 AM', language: 'English', format: 'IMAX 2D', screen: '1' },
      { time: '01:00 PM', language: 'Hindi', format: 'IMAX 2D', screen: '1' },
      { time: '06:45 PM', language: 'English', format: '2D', screen: '2' },
    ],
  },
  {
    id: 2,
    title: 'Interstellar',
    poster: 'https://www.themoviedb.org/t/p/w500/sR1Wh1rNQCrGr6Qs47DCdXxEC0S.jpg',
    shows: [
      { time: '10:00 AM', language: 'Tamil', format: '3D', screen: '4' },
      { time: '03:15 PM', language: 'English', format: 'IMAX', screen: '2' },
      { time: '08:30 PM', language: 'Hindi', format: '3D', screen: '3' },
    ],
  },
  {
    id: 3,
    title: 'Dune',
    poster: 'https://www.themoviedb.org/t/p/w500/A80Rx2cGLlNXvKB2AUB5mbnVnI6.jpg',
    shows: [
      { time: '11:00 AM', language: 'English', format: '2D', screen: '5' },
      { time: '04:45 PM', language: 'English', format: '3D', screen: '5' },
    ],
  },
];

const TodayShows = () => {
  const [movies, setMovies] = useState(initialShows);
  const [editingRow, setEditingRow] = useState({ movieId: null, row: null });

  const startEdit = (movieId, row) => {
    setEditingRow({ movieId, row });
  };

  const onCellChange = (movieId, rowIdx, field, value) => {
    setMovies((prev) =>
      prev.map((m) =>
        m.id === movieId
          ? {
              ...m,
              shows: m.shows.map((s, i) =>
                i === rowIdx ? { ...s, [field]: value } : s
              ),
            }
          : m
      )
    );
  };

  const saveMovie = (movieId) => {
    const movie = movies.find((m) => m.id === movieId);
    console.log('Saved:', movie.title, movie.shows);
    setEditingRow({ movieId: null, row: null });
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="relative flex flex-col sm:flex-row bg-white shadow-lg rounded-xl overflow-hidden"
        >
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full sm:w-48 h-64 object-cover flex-shrink-0"
          />

          <div className="flex-1 p-4 pb-20 relative">
            <h2 className="text-2xl font-semibold mb-2">{movie.title}</h2>
            <hr className="border-t border-gray-300 mb-4" />

            <div className="grid grid-cols-5 gap-4 font-medium text-gray-600 mb-2">
              <span>Time</span>
              <span>Language</span>
              <span>Format</span>
              <span>Screen</span>
            </div>

            <div className="space-y-2">
              {movie.shows.map((show, idx) => {
                const isEditing =
                  editingRow.movieId === movie.id && editingRow.row === idx;

                return (
                  <div
                    key={idx}
                    className="grid grid-cols-5 gap-4 items-center text-base"
                  >
                    {['time', 'language', 'format', 'screen'].map((field) =>
                      isEditing ? (
                        <input
                          key={field}
                          value={show[field]}
                          onChange={(e) =>
                            onCellChange(movie.id, idx, field, e.target.value)
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <span key={field}>{show[field]}</span>
                      )
                    )}

                    <button
                      onClick={() => startEdit(movie.id, idx)}
                      className="text-sky-600 hover:underline"
                    >
                      {isEditing ? 'Editing' : 'Edit'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => saveMovie(movie.id)}
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 shadow"
              >
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodayShows;
