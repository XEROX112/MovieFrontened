import { useState, useEffect } from 'react';
import axios from 'axios';

const api = "http://localhost:8080/admin";
console.log("Loaded theater ID:", localStorage.getItem("theater_Id"));
export default function TheaterDetail() {
    const [theater, setTheater] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editMode, setEditMode] = useState({
        theaterName: false,
        address: false,
        region: false,
    });

    const theaterId = localStorage.getItem("theater_Id");

    useEffect(() => {
        async function fetchTheater() {
            const jwt = localStorage.getItem("jwt");
            try {
                const response = await axios.get(`${api}/theatres/${theaterId}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
                setTheater(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch theater data');
                setLoading(false);
            }
        }

        fetchTheater();
    }, [theaterId]);

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setTheater((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleFieldEdit = (field) => {
        setEditMode((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSeatCategoryChange = (e, screenIndex, categoryIndex, attr) => {
        const value = attr === 'price' ? Number(e.target.value) : e.target.value;
        const updatedScreens = [...theater.screens];
        updatedScreens[screenIndex].seatCategories[categoryIndex][attr] = value;

        setTheater((prev) => ({
            ...prev,
            screens: updatedScreens,
        }));
    };

    const handleSave = async () => {
        const jwt = localStorage.getItem("jwt");
        try {
            const response = await axios.put(`${api}/theatres/${theater.id}`, theater, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                }
            });
            console.log(response.data);
            alert("Theater data saved successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to save data");
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Theater Details</h2>

            <div className="space-y-4">
                {['theaterName', 'address', 'region'].map((field) => (
                    <div key={field} className="flex items-center gap-4">
                        <label className="w-40 font-medium capitalize">
                            {field === 'theaterName' ? 'Theater Name' : field}
                        </label>

                        {editMode[field] ? (
                            <>
                                <input
                                    name={field}
                                    value={theater[field]}
                                    onChange={handleFieldChange}
                                    className="border border-sky-300 rounded p-2 flex-1"
                                    type="text"
                                />
                                <button
                                    onClick={() => toggleFieldEdit(field)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="flex-1">{theater[field]}</span>
                                <button
                                    onClick={() => toggleFieldEdit(field)}
                                    className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {theater.screens?.map((screen, screenIndex) => (
                <div key={screen.id} className="mt-6 p-4 border rounded bg-gray-50">
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Screen Name</label>
                        <div className="w-full border border-gray-200 rounded p-2 mt-1 bg-gray-100">
                            {screen.screenName}
                        </div>
                    </div>

                    {screen.seatCategories?.map((category, categoryIndex) => (
                        <div
                            key={category.id}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 border bg-white rounded"
                        >
                            {/* Category Name - Read Only */}
                            <div>
                                <label className="block text-sm font-medium">Category Name</label>
                                <div className="w-full border border-gray-200 rounded p-2 mt-1 bg-gray-100">
                                    {category.categoryName}
                                </div>
                            </div>

                            {/* Price - Editable */}
                            <div>
                                <label className="block text-sm font-medium">Price</label>
                                <input
                                    type="number"
                                    value={category.price}
                                    onChange={(e) =>
                                        handleSeatCategoryChange(e, screenIndex, categoryIndex, 'price')
                                    }
                                    className="w-full border border-sky-300 rounded p-2 mt-1"
                                />
                            </div>

                            {/* Rows - Read Only */}
                            <div>
                                <label className="block text-sm font-medium">Rows</label>
                                <div className="w-full border border-gray-200 rounded p-2 mt-1 bg-gray-100">
                                    {category.seatRows?.length || 0}
                                </div>
                            </div>

                            {/* Columns - Read Only */}
                            <div>
                                <label className="block text-sm font-medium">Columns</label>
                                <div className="w-full border border-gray-200 rounded p-2 mt-1 bg-gray-100">
                                    {category.seatRows?.[0]?.columnCount || 0}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded shadow"
                >
                    Save All Changes
                </button>
            </div>
        </div>
    );
}
