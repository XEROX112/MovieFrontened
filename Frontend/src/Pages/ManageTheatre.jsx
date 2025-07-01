import { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ManageTheatreNavbar from '../components/ManageTheatreNavbar';

import DropdownTheater from '../components/DropdownTheater';
import AddTheater from './AddTheater';
import AddMovie from './AddMovie';
import TheaterDetail from './TheaterDetail';
import DropdownTheaterShow from '../components/DropdownTheaterShow';

import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ManageTheatre() {
  const {
    user,
    logout,
    login,
    showLogin,
    showSignup,
    setShowLogin,
    setShowSignup
  } = useAuth();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('addTheatre');
  const [theaters, setTheaters] = useState([]);
  const [theaterMoviesMap, setTheaterMoviesMap] = useState({});
  const [screensMap, setScreensMap] = useState({});

  const userId = user?.id;

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt || !userId) return;

      try {
        const res = await axios.get(`http://localhost:8080/theater/admin/${userId}/theaters`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });

        const fetchedTheaters = res.data;
        setTheaters(fetchedTheaters);

        const movieMap = {};
        const screenMap = {};

        for (const theater of fetchedTheaters) {
          const movieRes = await axios.get(`http://localhost:8080/movies/admin/${theater.theaterId}`, {
            headers: { Authorization: `Bearer ${jwt}` }
          });

          movieMap[theater.theaterId] = movieRes.data;

          const totalScreen = movieRes.data.length > 0 ? movieRes.data[0].totalScreen : 0;
          screenMap[theater.theaterId] = Array.from({ length: totalScreen }, (_, i) => `Screen ${i + 1}`);
        }

        setTheaterMoviesMap(movieMap);
        setScreensMap(screenMap);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [activeTab, userId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'addTheatre':
        return <AddTheater />;
      case 'theatreDetails':
        return <TheaterDetail />;
      case 'addMovie':
        return <AddMovie />;
      case 'todaysShows':
        return <DropdownTheaterShow theaters={theaters} />;
      case 'addShow':
        return (
          <div className="space-y-6">
            {theaters.map((theater) => (
              <DropdownTheater
                key={theater.theaterId}
                theater={theater}
                movies={theaterMoviesMap[theater.theaterId] || []}
                screens={screensMap[theater.theaterId] || []}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar
        onLoginClick={() => {
          setShowLogin(true);
          setShowSignup(false);
        }}
        onSignupClick={() => {
          setShowSignup(true);
          setShowLogin(false);
        }}
        user={user}
        onLogout={logout}
      />

      <ManageTheatreNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-6xl mx-auto mt-6">
        {renderTabContent()}
      </div>

      <Footer />

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
            <button
              className="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600"
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>
            <Login
              onLogin={login}
              onSwitch={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
            />
          </div>
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
            <button
              className="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600"
              onClick={() => setShowSignup(false)}
            >
              ×
            </button>
            <Register
              onSwitch={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
