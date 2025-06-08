import { FaSearch, FaUserCircle, FaFilm, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = ({ onLoginClick, onSignupClick, user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-sky-300 px-6 py-3 flex items-center justify-between shadow">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <FaFilm className="text-white text-2xl" />
        <h1 className="text-white text-2xl font-bold">MovieFlix</h1>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2 flex-1 mx-6">
        <div className="flex items-center bg-sky-200 rounded-md px-3 py-2 flex-grow">
          <FaSearch className="text-white mr-2" />
          <input
            type="text"
            placeholder="Search movies..."
            className="bg-transparent outline-none text-white w-full placeholder-white"
          />
        </div>
        <button className="ml-2 bg-sky-200 text-white px-4 py-2 rounded-md hover:bg-sky-400 transition">Search</button>
      </div>

      {/* Right-side: Auth / Profile */}
      <div className="flex items-center space-x-4 relative">
        {!user ? (
          <>
            <button
              onClick={onSignupClick}
              className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-sky-400 transition"
            >
              Sign Up
            </button>
            <button
              onClick={onLoginClick}
              className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-sky-400 transition"
            >
              Login
            </button>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center text-white focus:outline-none"
            >
              <FaUserCircle className="text-2xl mr-2" />
              <span>{user.name}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-sky-300 rounded-md shadow-lg py-2 z-50">
                <a href="/profile" className=" px-4 py-2 text-white hover:bg-sky-400 flex items-center">
                  <FaUserCircle className="mr-2" /> My Profile
                </a>
                <a href="/bookings" className="block px-4 py-2 text-white hover:bg-sky-400">
                  My Bookings
                </a>
                <a href="/favorites" className="block px-4 py-2 text-white hover:bg-sky-400">
                  Favorites
                </a>
                <hr className="my-1 border-t border-white/30" />
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-white hover:bg-sky-400 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
