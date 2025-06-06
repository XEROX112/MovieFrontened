
import React, { createContext, useContext, useState } from 'react';

const TheaterContext = createContext();

const theatersData = [
  {
    id: 1,
    name: 'PVR Cinemas Phoenix',
    location: 'Lower Parel, Mumbai',
    formats: ['2D', '3D', 'IMAX'],
    showtimes: [
      { time: '10:00 AM', date: '2025-06-04', price: 150 },
      { time: '1:30 PM', date: '2025-06-04', price: 300 },
      { time: '5:00 PM', date: '2025-06-04', price: 450 },
      { time: '8:30 PM', date: '2025-06-04', price: 650 },
      { time: '11:45 PM', date: '2025-06-04', price: 700 },
    ],
  },
  {
    id: 2,
    name: 'INOX Megaplex',
    location: 'Inorbit Mall, Malad',
    formats: ['2D', '3D'],
    showtimes: [
      { time: '11:15 AM', date: '2025-06-04', price: 180 },
      { time: '2:45 PM', date: '2025-06-04', price: 350 },
      { time: '6:15 PM', date: '2025-06-04', price: 500 },
      { time: '9:45 PM', date: '2025-06-04', price: 700 },
    ],
  },
];


export const TheaterProvider = ({ children }) => {
  const [theaters, setTheaters] = useState(theatersData);

  return (
    <TheaterContext.Provider value={{ theaters, setTheaters }}>
      {children}
    </TheaterContext.Provider>
  );
};

export const useTheaters = () => useContext(TheaterContext);
