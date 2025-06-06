import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import MovieDetails from '../features/Movie/MovieDetails';
import AddBookings from '../features/Bookings/AddBookings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/movies/:id/theaters" element={<AddBookings />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;

