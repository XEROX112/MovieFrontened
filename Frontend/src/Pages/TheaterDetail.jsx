import { useState } from 'react';

const dummyTheater = {
    name: 'Galaxy Cinema',
    address: '123 Movie Lane',
    city: 'Cineville',
    numberOfScreens: 2,
    screens: [
        {
            seatCategories: [
                {
                    seatCategory: 'Regular',
                    price: 150,
                    rows: 10,
                    cols: 15,
                },
                {
                    seatCategory: 'Premium',
                    price: 250,
                    rows: 5,
                    cols: 10,
                },
            ],
        },
        {
            seatCategories: [
                {
                    seatCategory: 'VIP',
                    price: 400,
                    rows: 3,
                    cols: 6,
                },
            ],
        },
    ],
};

export default function TheaterDetail({ theaterData }) {
    const initialTheater = theaterData || dummyTheater;

    const [theater, setTheater] = useState(initialTheater);
    const [editMode, setEditMode] = useState({
        name: false,
        address: false,
        city: false,
        numberOfScreens: false,
    });

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setTheater((prev) => ({
            ...prev,
            [name]: name === 'numberOfScreens' ? Number(value) : value,
        }));
    };

    const toggleFieldEdit = (field) => {
        if (editMode[field]) {
            // Save logic could be added here (e.g., API call)
        }
        setEditMode((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSeatCategoryChange = (e, screenIndex, categoryIndex, attr) => {
        const value = ['price', 'rows', 'cols'].includes(attr)
            ? Number(e.target.value)
            : e.target.value;

        const updatedScreens = [...theater.screens];
        updatedScreens[screenIndex].seatCategories[categoryIndex][attr] = value;

        setTheater((prev) => ({
            ...prev,
            screens: updatedScreens,
        }));
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Theater Details</h2>

            {/* General Details */}
            {/* General Details - One Line Edit */}
            <div className="space-y-4">
                {['name', 'address', 'city', 'numberOfScreens'].map((field) => (
                    <div key={field} className="flex items-center gap-4">
                        <label className="w-40 font-medium">
                            {field.charAt(0).toUpperCase() + field.slice(1)}:
                        </label>

                        {editMode[field] ? (
                            <input
                                name={field}
                                value={theater[field]}
                                onChange={handleFieldChange}
                                className="border border-sky-300 rounded p-2 flex-1"
                                type={field === 'numberOfScreens' ? 'number' : 'text'}
                            />
                        ) : (
                            <span className="flex-1">{theater[field]}</span>
                        )}

                        <button
                            onClick={() => toggleFieldEdit(field)}
                            className="bg-sky-300 text-white px-4 py-1 rounded hover:bg-sky-400"
                        >
                            {editMode[field] ? 'Save' : 'Edit'}
                        </button>
                    </div>
                ))}
            </div>


            {/* Screens */}
            {theater.screens.map((screen, screenIndex) => (
                <div key={screenIndex} className="mt-6 p-4 border rounded bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">Screen {screenIndex + 1}</h3>

                    {screen.seatCategories.map((category, categoryIndex) => (
                        <div
                            key={categoryIndex}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 border bg-white rounded"
                        >
                            {['seatCategory', 'price', 'rows', 'cols'].map((attr) => (
                                <div key={attr}>
                                    <label className="block text-sm font-medium">
                                        {attr.charAt(0).toUpperCase() + attr.slice(1)}
                                    </label>
                                    <input
                                        type={['price', 'rows', 'cols'].includes(attr) ? 'number' : 'text'}
                                        value={theater.screens[screenIndex].seatCategories[categoryIndex][attr]}
                                        onChange={(e) =>
                                            handleSeatCategoryChange(e, screenIndex, categoryIndex, attr)
                                        }
                                        className="w-full border border-sky-300 rounded p-2 mt-1"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => {
                        // Replace this with actual save logic (API call etc.)
                        console.log("Saving theater data...", theater);
                        alert("Theater data saved successfully!");
                    }}
                    className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded shadow"
                >
                    Save All Changes
                </button>
            </div>
        </div>
    );
}
