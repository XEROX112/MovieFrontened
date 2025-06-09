import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Add unique ids to bookings
  const initialBookings = [
    {
      id: "1",
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
      id: "2",
      movie: {
        title: "3 Idiots",
        poster: "https://www.themoviedb.org/t/p/w1280/66A9MqXOyVFCssoloscw79z8Tew.jpg",
        venue: "PVR Icon: Andheri West",
      },
      date: "Fri, 15 Nov",
      time: "06:00 pm",
      screen: "SCREEN 2",
      seat: "PLATINUM - G10",
    },
    {
      id: "3",
      movie: {
        title: "Zindagi Na Milegi Dobara",
        poster: "https://www.themoviedb.org/t/p/w1280/gFQRmiPLFS0cIGpC1fyGiiqYz41.jpg",
        venue: "INOX: Nariman Point",
      },
      date: "Sun, 24 Nov",
      time: "09:15 pm",
      screen: "SCREEN 3",
      seat: "GOLD - H4",
    },
  ];

  const [bookings, setBookings] = useState(initialBookings);

  const removeBooking = (id) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  return (
    <BookingContext.Provider value={{ bookings, removeBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
