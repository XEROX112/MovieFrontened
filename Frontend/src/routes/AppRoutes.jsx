import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import MovieDetails from '../features/Movie/MovieDetails';
import AddBookings from '../features/Bookings/AddBookings';
import SeatSelection from '../features/Seats/SeatSelection';
import Profile from '../Pages/Profile';
import UserBooking from '../Pages/UserBooking';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
       <Route path="/profile" element={<Profile />} />
       <Route path="/bookings" element={<UserBooking />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/movies/:id/theaters" element={<AddBookings />} />
      <Route path="/seat-selection/:movieId/:theaterId/:date/:time" element={<SeatSelection/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;

