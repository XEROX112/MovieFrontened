import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

const api = "http://localhost:8080/theater"; // Update this as needed

export default function TheaterDetail() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTheater, setExpandedTheater] = useState(null);
  const [editMode, setEditMode] = useState({});

  useEffect(() => {
    async function fetchTheater() {
      const jwt = localStorage.getItem("jwt");
      try {
        const response = await axios.get(`${api}/theatres/${userId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setTheaters(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch theater data");
        setLoading(false);
      }
    }

    if (userId) {
      fetchTheater();
    }
  }, [userId]);

  const toggleTheater = (theaterId) => {
    setExpandedTheater(expandedTheater === theaterId ? null : theaterId);
  };

  const handleFieldChange = (e, theaterId) => {
    const { name, value } = e.target;
    setTheaters((prev) =>
      prev.map((theater) =>
        theater.id === theaterId ? { ...theater, [name]: value } : theater
      )
    );
  };

  const toggleFieldEdit = (field, theaterId) => {
    const key = `${theaterId}-${field}`;
    setEditMode((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSeatCategoryChange = (e, theaterId, screenIndex, categoryIndex, attr) => {
    const value = attr === "price" ? Number(e.target.value) : e.target.value;
    setTheaters((prev) =>
      prev.map((theater) => {
        if (theater.id === theaterId) {
          const updatedScreens = [...theater.screens];
          updatedScreens[screenIndex].seatCategories[categoryIndex][attr] = value;
          return { ...theater, screens: updatedScreens };
        }
        return theater;
      })
    );
  };

  const handleSave = async (theaterId) => {
    const jwt = localStorage.getItem("jwt");
    const theater = theaters.find((t) => t.id === theaterId);
    try {
      await axios.put(`${api}/theatres/${theaterId}`, theater, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      alert("Theater data saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save data");
    }
  };

  if (loading) return <div className="text-center py-10">Loading theaters...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">My Theater Details</h1>

      {theaters.map((theater) => (
        <div key={theater.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div
            onClick={() => toggleTheater(theater.id)}
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors border-b"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-sky-400 mb-2">{theater.theaterName}</h2>
                <div className="flex items-center text-sky-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{theater.address},{theater.region}</span>
                </div>
              </div>
              <div className="ml-4">
                {expandedTheater === theater.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {expandedTheater === theater.id && (
            <div className="p-6 bg-gray-50">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Theater Details</h3>

                <div className="space-y-4">
                  {["theaterName", "address", "region"].map((field) => (
                    <div key={field} className="flex items-center gap-4">
                      <label className="w-40 font-medium capitalize text-sm">
                        {field === "theaterName" ? "Theater Name" : field}
                      </label>
                      {editMode[`${theater.id}-${field}`] ? (
                        <>
                          <input
                            name={field}
                            value={theater[field]}
                            onChange={(e) => handleFieldChange(e, theater.id)}
                            className="flex-1 px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                          />
                          <button
                            onClick={() => toggleFieldEdit(field, theater.id)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md"
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 p-2">{theater[field]}</span>
                          <button
                            onClick={() => toggleFieldEdit(field, theater.id)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {theater.screens?.map((screen, screenIndex) => (
                  <div key={screen.id} className="bg-gray-100 rounded-lg border border-sky-300">
                    <div className="p-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Screen Name</label>
                        <div className="w-full border border-gray-300 rounded p-2 bg-gray-200">
                          {screen.screenName}
                        </div>
                      </div>

                      {screen.seatCategories?.map((category, categoryIndex) => (
                        <div key={category.id} className="mb-4 bg-white rounded-lg border border-sky-300">
                          <div className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Category Name</label>
                                <div className="w-full border border-gray-200 rounded p-2 bg-gray-200">
                                  {category.categoryName}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">Price</label>
                                <input
                                  type="number"
                                  value={category.price}
                                  onChange={(e) =>
                                    handleSeatCategoryChange(e, theater.id, screenIndex, categoryIndex, "price")
                                  }
                                  className="w-full px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">Rows</label>
                                <div className="w-full border border-gray-200 rounded p-2 bg-gray-100">
                                  {category.seatRows?.length || 0}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">Columns</label>
                                <div className="w-full border border-gray-200 rounded p-2 bg-gray-100">
                                  {category.seatRows?.[0]?.columnCount || 0}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => handleSave(theater.id)}
                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md"
                  >
                    Save All Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
