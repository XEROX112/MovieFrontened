import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { MovieProvider } from './features/Movie/MovieContext.jsx';
import { TheaterProvider } from './features/Bookings/TheaterContext.jsx';
import { BookingProvider } from './Pages/BookingContext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <BookingProvider>
    <MovieProvider>
      <TheaterProvider>
      <App />
      </TheaterProvider>
    </MovieProvider>
    </BookingProvider>
  </BrowserRouter>
);
