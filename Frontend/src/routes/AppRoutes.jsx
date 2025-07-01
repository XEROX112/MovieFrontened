import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import MovieDetails from '../features/Movie/MovieDetails';
import AddBookings from '../features/Bookings/AddBookings';
import SeatSelection from '../features/Seats/SeatSelection';
import Profile from '../Pages/Profile';
import UserBooking from '../Pages/UserBooking';
import ManageTheatre from '../Pages/ManageTheatre';
import OtpVerification from '../components/OtpVerification';
import EmailVerification from '../components/EmailVerification';
import EmailVerificationOtp from '../components/EmailVerificationOtp';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="verify-email/otp" element={<OtpVerification />} />
      <Route path="/movies/:id/theaters" element={<AddBookings />} />
      <Route path="/bookings" element={<UserBooking />} />
      <Route path="/seat-selection/:showId/:date/:time" element={<SeatSelection />} />
      <Route path="/admin/manage-theatre" element={<ManageTheatre />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:id/verify-email" element={<EmailVerification />} />
      <Route path="/profile/:id/verify-email/otp" element={<EmailVerificationOtp />} />


    </Routes>
  );
};

export default AppRoutes;
