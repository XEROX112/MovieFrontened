import { useState } from 'react';



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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Theater Data:', theater);
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
