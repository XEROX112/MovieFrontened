import { useState } from 'react';
import axios from 'axios';

const api = "http://localhost:8080/theater";

export default function AddTheater() {
  const [theater, setTheater] = useState({
    name: '',
    address: '',
    city: '',
    numberOfScreens: 1,
    screens: [
      {
        seatCategories: [
          { seatCategory: '', price: '', rows: '', cols: '' }
        ]
      }
    ]
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;


  const handleTheaterChange = (e) => {
    const { name, value } = e.target;
    setTheater(prev => ({
      ...prev,
      [name]: name === 'numberOfScreens' ? Number(value) : value
    }));
  };

  const handleScreenCountChange = (e) => {
    const count = Number(e.target.value);
    const screens = Array.from({ length: count }, (_, i) => theater.screens[i] || {
      seatCategories: [{ seatCategory: '', price: '', rows: '', cols: '' }]
    });
    setTheater(prev => ({
      ...prev,
      numberOfScreens: count,
      screens
    }));
  };

  const handleSeatCategoryChange = (screenIndex, categoryIndex, e) => {
    const updatedScreens = [...theater.screens];
    updatedScreens[screenIndex].seatCategories[categoryIndex][e.target.name] = e.target.value;
    setTheater({ ...theater, screens: updatedScreens });
  };

  const addSeatCategory = (screenIndex) => {
    const updatedScreens = [...theater.screens];
    updatedScreens[screenIndex].seatCategories.push({
      seatCategory: '',
      price: '',
      rows: '',
      cols: ''
    });
    setTheater({ ...theater, screens: updatedScreens });
  };

  const removeSeatCategory = (screenIndex, categoryIndex) => {
    const updatedScreens = [...theater.screens];
    updatedScreens[screenIndex].seatCategories.splice(categoryIndex, 1);
    setTheater({ ...theater, screens: updatedScreens });
  };

    const handleSubmit = async (e) => {
  e.preventDefault();


 const theaterPayload = {
  userId:userId,
  theaterName: theater.name,
  address: theater.address,
  region: theater.city,
  screens: theater.screens.map((screen, screenIndex) => {
    let globalRowIndex = 0; 

    return {
      screenName: `Screen ${screenIndex + 1}`,
      seatCategories: screen.seatCategories.map(category => {
        const seatRows = Array.from({ length: Number(category.rows) }, () => {
          const rowChar = String.fromCharCode(65 + globalRowIndex); // A, B, C, ...
          globalRowIndex++;

          const seats = Array.from({ length: Number(category.cols) }, (_, colIndex) => ({
            seatNumber: `${rowChar}${colIndex + 1}`
          }));

          return {
            rowName: rowChar,
            columnCount: Number(category.cols),
            seats
          };
        });

        return {
          categoryName: category.seatCategory,
          price: Number(category.price),
          seatRows
        };
      })
    };
  })
};


  try {
    const jwt = localStorage.getItem("jwt");
    const response = await axios.post(`${api}/admin/add-theatre`, theaterPayload, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("Theater created:", response.data);
    alert("Theater created successfully");
  } catch (err) {
    console.error("Error creating theater:", err.response?.data || err.message);
    alert("Failed to create theater");
  }
};



  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Add Theater</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium">Theater Name</label>
              <input name="name" value={theater.name} onChange={handleTheaterChange}
                className="w-full border border-sky-300 rounded p-2 mt-1" />
            </div>

            <div>
              <label className="block font-medium">Address</label>
              <input name="address" value={theater.address} onChange={handleTheaterChange}
                className="w-full border border-sky-300 rounded p-2 mt-1" />
            </div>

            <div>
              <label className="block font-medium">City</label>
              <input name="city" value={theater.city} onChange={handleTheaterChange}
                className="w-full border border-sky-300 rounded p-2 mt-1" />
            </div>

            <div>
              <label className="block font-medium">Number of Screens</label>
              <input type="number" name="numberOfScreens" min="1"
                value={theater.numberOfScreens}
                onChange={handleScreenCountChange}
                className="w-full border border-sky-300 rounded p-2 mt-1" />
            </div>
          </div>

          {theater.screens.map((screen, screenIndex) => (
            <div key={screenIndex} className="border p-4 rounded-md bg-gray-50 mt-6">
              <h3 className="text-lg font-semibold mb-4">Screen {screenIndex + 1}</h3>

              {screen.seatCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border border-sky-300 rounded p-4 mb-4 bg-white">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Seat Category</label>
                      <input
                        name="seatCategory"
                        value={category.seatCategory}
                        onChange={(e) => handleSeatCategoryChange(screenIndex, categoryIndex, e)}
                        className="w-full border border-sky-300 rounded p-2 mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Price</label>
                      <input
                        name="price"
                        type="number"
                        value={category.price}
                        onChange={(e) => handleSeatCategoryChange(screenIndex, categoryIndex, e)}
                        className="w-full border border-sky-300 rounded p-2 mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Rows</label>
                      <input
                        name="rows"
                        type="number"
                        min="0"
                        value={category.rows}
                        onChange={(e) => {
                          const value = Math.max(0, Number(e.target.value));
                          const event = { target: { name: 'rows', value } };
                          handleSeatCategoryChange(screenIndex, categoryIndex, event);
                        }}
                        className="w-full border border-sky-300 rounded p-2 mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Columns</label>
                      <input
                        name="cols"
                        type="number"
                        min="0"
                        value={category.cols}
                        onChange={(e) => {
                          const value = Math.max(0, Number(e.target.value));
                          const event = { target: { name: 'cols', value } };
                          handleSeatCategoryChange(screenIndex, categoryIndex, event);
                        }}
                        className="w-full border border-sky-300 rounded p-2 mt-1"
                      />
                    </div>

                  </div>

                  {screen.seatCategories.length > 1 && (
                    <div className="mt-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeSeatCategory(screenIndex, categoryIndex)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove Category
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => addSeatCategory(screenIndex)}
                  className="bg-sky-300 text-white px-4 py-2 rounded hover:bg-sky-400"
                >
                  + Add Another Seat Category
                </button>
              </div>
            </div>
          ))}

          <div className="text-center">
            <button
              type="submit"
              className="bg-sky-300 text-white px-6 py-2 rounded hover:bg-sky-400 mt-6"
            >
              Submit Theater
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
