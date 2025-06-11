import { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const AddMovie = () => {
    const [movie, setMovie] = useState({
        title: '',
        releaseDate: '',
        genre: '',
        duration: '',
        language: '',
        format: '',
        description: '',
        about: '',
    });

    const [casts, setCasts] = useState([{ name: '', role: '', image: '' }]);

    const handleMovieChange = (e) => {
        setMovie({ ...movie, [e.target.name]: e.target.value });
    };

    const handleCastChange = (index, e) => {
        const newCasts = [...casts];
        newCasts[index][e.target.name] = e.target.value;
        setCasts(newCasts);
    };

    const addCast = () => {
        setCasts([...casts, { name: '', role: '', image: '' }]);
    };

    const removeCast = (index) => {
        setCasts(casts.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        const finalData = { ...movie, casts };
        console.log('Submitted Movie Data:', finalData);
        // You can send `finalData` to a backend API here
        alert('Movie data submitted!');
    };

    return (
        <>
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-6">Movie Details :</h2>

                {[
                    { label: 'Title', name: 'title', type: 'text' },
                    { label: 'Release Date', name: 'releaseDate', type: 'date' },
                    { label: 'Genre', name: 'genre', type: 'text' },
                    { label: 'Duration (in mins)', name: 'duration', type: 'number' },
                    { label: 'Language', name: 'language', type: 'text' },
                    { label: 'Format', name: 'format', type: 'text' },
                ].map((field) => (
                    <div key={field.name} className="flex items-center mb-4 gap-2">
                        <label className="w-40 font-medium">{field.label}:</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={movie[field.name]}
                            onChange={handleMovieChange}
                            className="flex-1 border p-2 rounded border-sky-300"
                        />
                    </div>
                ))}

                <div className="flex items-start mb-6 gap-2">
                    <label className="w-40 font-medium pt-2">Description:</label>
                    <textarea
                        name="description"
                        value={movie.description}
                        onChange={handleMovieChange}
                        className="flex-1 border p-2 rounded border-sky-300"
                        rows={3}
                    />
                </div>

                <div className="flex items-start gap-2">
                    <label className="w-40 font-medium pt-2">About:</label>
                    <textarea
                        name="about"
                        value={movie.about}
                        onChange={handleMovieChange}
                        className="flex-1 border p-2 rounded border-sky-300"
                        rows={3}
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Cast Details</h2>
                    <button onClick={addCast} className="bg-sky-300 text-white px-4 py-1 rounded border border-white">
                        + Add Cast
                    </button>
                </div>

                {casts.map((cast, index) => (
                    <div
                        key={index}
                        className="bg-gray-100 p-4 rounded-xl mb-4 shadow flex flex-col justify-between"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Cast Name"
                                    value={cast.name}
                                    onChange={(e) => handleCastChange(index, e)}
                                    className="w-full border p-2 rounded border-sky-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    placeholder="Role"
                                    value={cast.role}
                                    onChange={(e) => handleCastChange(index, e)}
                                    className="w-full border p-2 rounded border-sky-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    placeholder="Image URL"
                                    value={cast.image}
                                    onChange={(e) => handleCastChange(index, e)}
                                    className="w-full border p-2 rounded border-sky-300"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => removeCast(index)}
                                className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        className="bg-sky-300 text-white px-6 py-2 rounded hover:bg-sky-300"
                    >
                        Submit Movie
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default AddMovie;
