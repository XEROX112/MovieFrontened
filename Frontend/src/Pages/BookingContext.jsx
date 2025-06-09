import React, { createContext, useContext } from "react";

const BookingContext = createContext([]);

export const BookingProvider = ({ children }) => {
  const bookings = [
    {
      movie: {
        title: "Dilwale Dulhania Le Jayenge",
        poster: "https://www.themoviedb.org/t/p/w1280/1hMglJ7PzU6FLUlJW2Wy0UCEfIl.jpg",
        venue: "Maratha Mandir: Mumbai Central",
      },
      date: "Tue, 01 Nov",
      time: "11:30 am",
      screen: "SCREEN 1",
      seat: "DRESS CI - F7",
    },
    {
      movie: {
        title: "3 Idiots",
        poster: "https://www.themoviedb.org/t/p/w1280/66VqY0x9A3wTfgbz1m5BI0YwS5u.jpg",
        venue: "PVR Icon: Andheri West",
      },
      date: "Fri, 15 Nov",
      time: "06:00 pm",
      screen: "SCREEN 2",
      seat: "PLATINUM - G10",
    },
    {
      movie: {
        title: "Zindagi Na Milegi Dobara",
        poster: "https://www.themoviedb.org/t/p/w1280/e2bE5If5YK0RZ64ohG6DbFzPxSt.jpg",
        venue: "INOX: Nariman Point",
      },
      date: "Sun, 24 Nov",
      time: "09:15 pm",
      screen: "SCREEN 3",
      seat: "GOLD - H4",
    },
  ];

  return (
    <BookingContext.Provider value={bookings}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  return useContext(BookingContext);
};
