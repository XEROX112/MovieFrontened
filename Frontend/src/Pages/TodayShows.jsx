import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = "http://localhost:8080/shows";

const TodayShows = ({ theaterId }) => {
  const [movies, setMovies] = useState([]);
  const [editingRow, setEditingRow] = useState({ movieId: null, row: null });
  const [editedShowMap, setEditedShowMap] = useState({});

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if (theaterId && jwt) {
      axios
        .get(`${api}/admin/theatre/${theaterId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        .then((res) => {
          console.log("deatils :", res.data);
          setMovies(res.data || []);
        })
        .catch((err) => {
          console.error("Error fetching shows:", err);
          setMovies([]);
        });
    }
  }, [theaterId]);

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

    setEditedShowMap((prevMap) => {
      const updated = { ...prevMap };
      if (!updated[movieId]) updated[movieId] = new Set();
      updated[movieId].add(rowIdx);
      return updated;
    });
  };

  const deleteShow = (movieId, rowIdx) => {
    const jwt = localStorage.getItem("jwt");
    const showId = movies.find((m) => m.id === movieId)?.shows?.[rowIdx]?.id;

    if (!showId || !window.confirm("Are you sure you want to delete this show?")) return;

    const response =axios
      .delete(`${api}/delete/${showId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then(() => {
        console.log(response.data)
        setMovies((prev) =>
          prev.map((m) =>
            m.id === movieId
              ? {
                ...m,
                shows: m.shows.filter((_, i) => i !== rowIdx),
              }
              : m
          )
        );

        setEditedShowMap((prevMap) => {
          const updated = { ...prevMap };
          if (!updated[movieId]) updated[movieId] = new Set();
          updated[movieId].add(rowIdx);
          return updated;
        });
      })
      .catch((err) => {
        alert("Failed to delete show.");
        console.error("Delete failed", err);
      });
  };

  const saveAllMovies = () => {
    const jwt = localStorage.getItem("jwt");

    const payload = {};

    for (const movie of movies) {
      const movieId = movie.id;
      if (!editedShowMap[movieId]) continue;

      const editedRows = Array.from(editedShowMap[movieId]);
      const editedShows = movie.shows
        .filter((_, idx) => editedRows.includes(idx))
        .map((s) => ({
          id: s.id,
          time: s.time,
          language: s.language,
          format: s.format,
          screen: s.screen,
        }));

      if (editedShows.length > 0) {
        payload[movieId] = editedShows;
      }
    }

    if (Object.keys(payload).length === 0) {
      alert("No changes to save.");
      return;
    }

    axios
      .put(`${api}/admin/update/${theaterId}`, payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert("All changes saved!");
        setEditingRow({ movieId: null, row: null });
        setEditedShowMap({});
      })
      .catch((err) => {
        alert("Failed to save changes.");
        console.error("Bulk save failed", err);
      });
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50">
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

            <div className="grid grid-cols-6 gap-4 font-medium text-gray-600 mb-2">
              <span>Time</span>
              <span>Language</span>
              <span>Format</span>
              <span>Screen</span>
              <span className="col-span-2"></span>
            </div>

            <div className="space-y-2">
              {movie.shows.map((show, idx) => {
                const isEditing =
                  editingRow.movieId === movie.id && editingRow.row === idx;

                return (
                  <div
                    key={`${movie.id}-${idx}`}
                    className="grid grid-cols-6 gap-4 items-center text-base"
                  >
                    {["time", "language", "format", "screen"].map((field) =>
                      isEditing ? (
                        <input
                          key={field}
                          value={show[field]}
                          placeholder={
                            field === "time" ? "2:30 PM" : `Enter ${field}`
                          }
                          onChange={(e) =>
                            onCellChange(movie.id, idx, field, e.target.value)
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <span key={field}>{show[field]}</span>
                      )
                    )}

                    <div className="col-span-2 flex gap-4 justify-start">
                      <button
                        onClick={() => startEdit(movie.id, idx)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        {isEditing ? "Editing" : "Edit"}
                      </button>
                      <button
                        onClick={() => deleteShow(movie.id, idx)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {movies.length > 0 && (
        <div className="text-right pr-6">
          <button
            onClick={saveAllMovies}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 shadow"
          >
            Save All Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default TodayShows;
