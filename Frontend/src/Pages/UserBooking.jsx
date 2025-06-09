import React from "react";
import { useBooking } from "./BookingContext";
import BookingCard from "../components/BookingCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const UserBooking = () => {
  const { bookings, removeBooking } = useBooking();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="w-full max-w-4xl space-y-6">
          {bookings.length === 0 && (
            <p className="text-gray-600 text-lg">No bookings found.</p>
          )}

          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={() => removeBooking(booking.id)}
            />
          ))}

          <div className="bg-yellow-100 p-4 rounded text-sm text-gray-800">
            <p className="font-bold mb-1">Cancellation & Refund Terms</p>
            <p>
              You can cancel the booking up to <strong>4 hour(s)</strong> before
              showtime. Refunds will be processed according to our{" "}
              <a href="#" className="text-red-600 underline">
                Cancellation Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserBooking;
