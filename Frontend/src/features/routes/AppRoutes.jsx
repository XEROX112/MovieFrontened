import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MoviePage from '../pages/MoviePage';
import BookingPage from '../pages/BookingPage';
import ProfilePage from '../pages/ProfilePage';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies/:id" element={<MoviePage />} />
      <Route path="/booking/:id" element={<BookingPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
