import { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ManageTheatreNavbar from '../components/ManageTheatreNavbar';

import AddTheater from './AddTheater';
import AddMovie from './AddMovie';
import TheaterDetail from './TheaterDetail';
import AddShow from './AddShow';
import TodayShows from './TodayShows';

import Login from '../features/auth/Login';
import Register from '../features/auth/Register';

export default function ManageTheatre() {
  const [activeTab, setActiveTab] = useState('addTheatre');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    const theaterId = localStorage.getItem("theater_Id");
    const jwt = localStorage.getItem("jwt");

    if (activeTab === 'addShow' && theaterId && jwt) {
      axios.get(`http://localhost:8080/admin/movies/${theaterId}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
        .then(res => {
          console.log("Fetched movie + screen data:", res.data);

          const moviesArray = res.data; // since res.data is an array
          setMovies(moviesArray);

          const totalScreen = moviesArray.length > 0 ? moviesArray[0].totalScreen : 0;
          const screenArr = Array.from({ length: totalScreen }, (_, i) => `Screen ${i + 1}`);
          setScreens(screenArr);
        })
        .catch(err => {
          console.error("Error fetching data:", err);
          setMovies([]);
          setScreens([]);
        });
    }
  }, [activeTab]);


  const renderTabContent = () => {
    if (activeTab === 'addShow') {
      if (movies.length === 0) return <div className="text-center p-10">Loading movies...</div>;
      if (screens.length === 0) return <div className="text-center p-10">Loading screens...</div>;
      return <AddShow key={activeTab} movies={movies} screens={screens} />;
    }

    switch (activeTab) {
      case 'addTheatre':
        return <AddTheater />;
      case 'theatreDetails':
        return <TheaterDetail />;
      case 'addMovie':
        return <AddMovie />;
      case 'todaysShows':
        return <TodayShows />;
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
        onLogout={() => {
          localStorage.removeItem("jwt");
          localStorage.removeItem("user");
          setUser(null);
        }}
      />

      <ManageTheatreNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-6xl mx-auto mt-6">
        {renderTabContent()}
      </div>

      <Footer />

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
            <button className="absolute top-2 right-3 text-gray-400 text-xl" onClick={() => setShowLogin(false)}>
              ×
            </button>
            <Login
              onLogin={(user) => {
                setUser(user);
                setShowLogin(false);
              }}
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
            <button className="absolute top-2 right-3 text-gray-400 text-xl" onClick={() => setShowSignup(false)}>
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
