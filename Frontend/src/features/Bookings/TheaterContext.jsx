import React, { createContext, useContext, useState } from 'react';

const TheaterContext = createContext();

const initialTheaters = [
  {
    id: 1,
    name: 'PVR Cinemas Phoenix',
    location: 'Lower Parel, Mumbai',
    formats: ['2D', '3D', 'IMAX'],
    showtimes: [
      {
        time: '10:00 AM',
        date: '2025-06-04',
        seats: [
          { type: 'Diamond', price: 700 },
          { type: 'Gold', price: 500 },
          { type: 'Silver', price: 300 }
        ],
      },
      {
        time: '1:30 PM',
        date: '2025-06-04',
        seats: [
          { type: 'Diamond', price: 800 },
          { type: 'Gold', price: 600 },
          { type: 'Silver', price: 400 }
        ],
      },
      {
        time: '5:00 PM',
        date: '2025-06-04',
        seats: [
          { type: 'Diamond', price: 900 },
          { type: 'Gold', price: 700 },
          { type: 'Silver', price: 500 }
        ],
      },
      {
        time: '8:30 PM',
        date: '2025-06-04',
        seats: [
          { type: 'Diamond', price: 1000 },
          { type: 'Gold', price: 800 },
          { type: 'Silver', price: 600 }
        ],
      },
      {
        time: '11:45 PM',
        date: '2025-06-04',
        seats: [
          { type: 'Diamond', price: 1100 },
          { type: 'Gold', price: 900 },
          { type: 'Silver', price: 700 }
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'INOX Megaplex',
    location: 'Inorbit Mall, Malad',
    formats: ['IMAX'],
    showtimes: [
      {  
        time: '11:15 AM',
        date: '2025-06-04',
        seats: [
          { type: 'Diamond', price: 600 },
          { type: 'Gold', price: 400 },
          { type: 'Silver', price: 250 }
        ],
      },
      {
        time: '2:45 PM',
        date: '2025-06-04',
        seats: [
          { type: 'Diamond', price: 750 },
          { type: 'Gold', price: 550 },
          { type: 'Silver', price: 350 }
        ],
      },
      {
        time: '6:15 PM',
        date: '2025-06-04',
        seats: [
          { type: 'Diamond', price: 850 },
          { type: 'Gold', price: 650 },
          { type: 'Silver', price: 450 }
        ],
      },
      {
        time: '9:45 PM',
        date: '2025-06-04',
        seats: [
          { type: 'Diamond', price: 950 },
          { type: 'Gold', price: 750 },
          { type: 'Silver', price: 550 }
        ],
      },
    ],
  },
];

export const TheaterProvider = ({ children }) => {
  const [theaters, setTheaters] = useState(initialTheaters);

  return (
    <TheaterContext.Provider value={{ theaters, setTheaters }}>
      {children}
    </TheaterContext.Provider>
  );
};

export const useTheaters = () => useContext(TheaterContext);
