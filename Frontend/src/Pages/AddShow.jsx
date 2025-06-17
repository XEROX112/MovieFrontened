import { useState, useEffect } from 'react';
import axios from 'axios';

const api = "http://localhost:8080/admin/shows";

const AddShow = ({ movies = [], screens = [] }) => {
    const [movieList, setMovieList] = useState(movies);
    const [activeMovie, setActiveMovie] = useState(null);
    const [showData, setShowData] = useState({
        language: '',
        format: '',
        screenNo: '',
        startTime: '',
        date: '',
    });

    useEffect(() => {
        setMovieList(movies);
    }, [movies]);

    const openModal = (movie) => {
        setActiveMovie(movie);
        setShowData({
            language: '',
            format: '',
            screenNo: '',
            startTime: '',
            date: '',
        });
    };

    const closeModal = () => setActiveMovie(null);

    const saveShow = async () => {
        const jwt = localStorage.getItem("jwt");
        const theaterId = localStorage.getItem("theater_Id");

        const payload = {
            movie: { id: activeMovie.id },
            language: showData.language,
            format: showData.format,
            screenNo: showData.screenNo, // should be like "Screen-1"
            showtime: showData.startTime,
            showDate: showData.date,
        };

        try {
            const response = await axios.post(`${api}/add/${theaterId}`, payload, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            console.log('Show saved successfully:', response.data);
            alert("Show added successfully!");
            closeModal();
        } catch (error) {
            console.error('Error saving show:', error.response?.data || error.message);
            alert("Failed to save show. Check console.");
        }
    };

    const deleteMovie = (id) => {
        setMovieList((prev) => prev.filter((movie) => movie.id !== id));
    };

    return (
        <>
            <div className="grid gap-4 p-6 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
                {movieList.map((m) => (
                    <div key={m.id} className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
                        <div className="pt-4 h-72 overflow-hidden">
                            <img src={m.poster} alt={m.title} className="w-full h-full object-contain" />
                        </div>
                        <div className="p-4 space-y-1 text-sm flex-1">
                            <h3 className="font-medium text-lg truncate">{m.title}</h3>
                            <p>{m.genre.join(', ')}</p>
                            <p>{m.duration} mins</p>
                        </div>
                        <div className="p-4 pt-0 flex justify-between">
                            <button
                                onClick={() => deleteMovie(m.id)}
                                className="bg-red-400 text-white px-3 py-1 rounded text-sm"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => openModal(m)}
                                className="bg-sky-300 text-white px-4 py-1 rounded text-base"
                            >
                                Add Show
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {activeMovie && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4 shadow">
                        <h2 className="text-2xl font-bold mb-2">Add Show – {activeMovie.title}</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm mb-1">Language</label>
                                <select
                                    value={showData.language}
                                    onChange={(e) => setShowData({ ...showData, language: e.target.value })}
                                    className="w-full border rounded p-2 border-sky-300"
                                >
                                    <option value="">Select language</option>
                                    {activeMovie.language.map((l) => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Format</label>
                                <select
                                    value={showData.format}
                                    onChange={(e) => setShowData({ ...showData, format: e.target.value })}
                                    className="w-full border rounded p-2 border-sky-300"
                                >
                                    <option value="">Select format</option>
                                    {(activeMovie.format || ['2D']).map((f) => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Screen</label>
                                <select
                                    value={showData.screenNo}
                                    onChange={(e) => setShowData({ ...showData, screenNo: e.target.value })}
                                    className="w-full border rounded p-2 border-sky-300"
                                >
                                    <option value="">Select screen</option>
                                    {screens.map((screen) => {
                                        const screenName = `${screen}`;
                                        return (
                                            <option key={screenName} value={screenName}>
                                                {screenName}
                                            </option>
                                        );
                                    })}
                                </select>


                            </div>

                            <div>
                                <label className="block text-sm mb-1">Start Time</label>
                                <input
                                    type="time"
                                    value={showData.startTime}
                                    onChange={(e) => setShowData({ ...showData, startTime: e.target.value })}
                                    className="w-full border rounded p-2 border-sky-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Date</label>
                                <input
                                    type="date"
                                    value={showData.date}
                                    onChange={(e) => setShowData({ ...showData, date: e.target.value })}
                                    className="w-full border rounded p-2 border-sky-300"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button onClick={closeModal} className="px-4 py-1 rounded border border-gray-400">Cancel</button>
                            <button
                                onClick={saveShow}
                                className="px-4 py-1 bg-sky-300 text-white rounded disabled:opacity-50"
                                disabled={
                                    !showData.language ||
                                    !showData.format ||
                                    !showData.screenNo ||
                                    !showData.startTime ||
                                    !showData.date
                                }
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddShow;
