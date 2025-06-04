import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import MovieDetails from '../features/Movie/MovieDetails';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      {/* <Route path="/booking/:id" element={<BookingPage />} />
      <Route path="/profile" element={<ProfilePage />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
