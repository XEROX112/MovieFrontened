import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovies } from '../Movie/MovieContext.jsx';
import { ChevronLeft, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import CustomDropdown from '../../components/CustomDropdown.jsx';
import { useTheaters } from '../Bookings/TheaterContext.jsx';

const getTimeBlock = (timeStr) => {
  const [time, meridian] = timeStr.split(' ');
  let [hour] = time.split(':').map(Number);

  if (meridian === 'PM' && hour !== 12) hour += 12;
  if (meridian === 'AM' && hour === 12) hour = 0;

  if (hour >= 6 && hour < 12) return 'Morning (6 AM - 12 PM)';
  if (hour >= 12 && hour < 16) return 'Afternoon (12 PM - 4 PM)';
  if (hour >= 16 && hour < 20) return 'Evening (4 PM - 8 PM)';
  if (hour >= 20 && hour < 24) return 'Night (8 PM - 12 AM)';
  return null;
};

const AddBookings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const allMovies = useMovies();
  const movie = allMovies.find((m) => m.id.toString() === id);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedPreferredTimes, setSelectedPreferredTimes] = useState([]);

  const { theaters } = useTheaters();
  const today = new Date();
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label:
        i === 0
          ? 'Today'
          : i === 1
          ? 'Tomorrow'
          : date.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }),
    };
  });

  const priceRangeOptions = ['₹0 - ₹200', '₹200 - ₹400', '₹400 - ₹600', '₹600+'];
  const preferredTimeOptions = [
    'Morning (6 AM - 12 PM)',
    'Afternoon (12 PM - 4 PM)',
    'Evening (4 PM - 8 PM)',
    'Night (8 PM - 12 AM)',
  ];

  // Filter theaters and showtimes by date, price, and preferred time
  const filteredTheaters = theaters
    .map((theater) => ({
      ...theater,
      showtimes: theater.showtimes.filter((show) => {
        if (selectedDate && show.date !== selectedDate) return false;

        // Filter by price range if selected
        if (selectedPriceRanges.length > 0) {
          const price = show.price ?? 0;
          const priceMatch = selectedPriceRanges.some((range) => {
            switch (range) {
              case '₹0 - ₹200':
                return price >= 0 && price <= 200;
              case '₹200 - ₹400':
                return price > 200 && price <= 400;
              case '₹400 - ₹600':
                return price > 400 && price <= 600;
              case '₹600+':
                return price > 600;
              default:
                return true;
            }
          });
          if (!priceMatch) return false;
        }

        // Filter by preferred time if selected
        if (selectedPreferredTimes.length > 0) {
          const timeBlock = getTimeBlock(show.time);
          if (!selectedPreferredTimes.includes(timeBlock)) return false;
        }

        return true;
      }),
    }))
    .filter((theater) => theater.showtimes.length > 0);

  if (!movie) {
    return <div className="p-10 text-center text-red-500">Movie not found</div>;
  }

  const sharedBlurStyle = {
    boxShadow: '0 6px 12px -3px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/movies/${movie.id}`)}
          className="text-blue-600 text-lg font-semibold hover:text-blue-800 mb-6 flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Movie Details
        </button>

        {/* Movie Card */}
        <div className="bg-white rounded-xl p-6 flex gap-6 items-center mb-8" style={sharedBlurStyle}>
          <div className="w-28 h-36 bg-gray-200 rounded-lg" />
          <div>
            <h1 className="text-3xl font-medium mb-1">{movie.title}</h1>
            <p className="text-gray-600 flex flex-wrap gap-5">
              <span>{movie.duration}</span>
              <span>{movie.genre.join(', ')}</span>
              <span>{movie.language}</span>
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="mb-10 rounded-lg p-6" style={sharedBlurStyle}>
          <h2 className="font-medium text-2xl mb-4">Select Date</h2>
          <div className="flex flex-wrap gap-4">
            {dateOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedDate(opt.value)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedDate === opt.value
                    ? 'bg-blue-300 text-white border-black font-semibold'
                    : 'bg-white text-black border-gray-300 hover:border-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theater & Showtime Section */}
        <div className="rounded-lg p-6 mb-12" style={sharedBlurStyle}>
          <div className="flex items-center flex-wrap mb-6">
            <h2 className="font-medium text-2xl">Select Theater &amp; Showtime ({filteredTheaters.length} theaters found)</h2>

            {/* Custom Dropdowns */}
            <div className="flex gap-6 ml-auto mt-2 sm:mt-0">
              <CustomDropdown
                options={priceRangeOptions}
                placeholder="Select Price Range"
                selectedOptions={selectedPriceRanges}
                setSelectedOptions={setSelectedPriceRanges}
              />

              <CustomDropdown
                options={preferredTimeOptions}
                placeholder="Select Preferred Time"
                selectedOptions={selectedPreferredTimes}
                setSelectedOptions={setSelectedPreferredTimes}
              />
            </div>
          </div>

          {/* Theater Cards */}
          {filteredTheaters.map((theater) => (
            <div
              key={theater.id}
              className="border p-6 rounded-xl shadow mb-6 transition-all duration-300 hover:shadow-lg focus:shadow-lg"
              tabIndex={0}
            >
              <h3 className="text-lg font-semibold mb-2">{theater.name}</h3>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="max-w-[60%]">
                  <p className="text-sm text-gray-600 whitespace-nowrap mb-2">{theater.location}</p>
                  <div className="flex gap-2 flex-wrap">
                    {theater.formats.map((format) => (
                      <span key={format} className="bg-blue-300 text-blue-900 text-xs px-3 py-1 rounded-full">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap justify-end flex-grow">
                  {theater.showtimes.map(({ time, price }) => (
                    <button
                      key={time}
                      onClick={() => setSelectedShowtime(time)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm whitespace-nowrap transition-colors ${
                        selectedShowtime === time
                          ? 'bg-blue-300 text-white border-black font-semibold'
                          : 'bg-white text-black border-gray-300 hover:border-gray-700'
                      }`}
                      title={`Price: ₹${price}`}
                    >
                      <Clock className="w-4 h-4" /> {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddBookings;
