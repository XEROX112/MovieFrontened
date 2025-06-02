import { FaSearch, FaUserCircle, FaFilm } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-sky-300 px-6 py-3 flex items-center justify-between shadow">
      <div className="flex items-center space-x-2">
        <FaFilm className="text-white text-2xl" />
        <h1 className="text-white text-2xl font-bold">MovieFlix</h1>
      </div>

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

      <div className="flex items-center space-x-4">
        <Link to="/register" className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-sky-400 transition">
          Sign Up
        </Link>
        <Link to="/login" className="bg-white text-sky-400 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition">
          Login
        </Link>
        <FaUserCircle className="text-white text-2xl" />
      </div>
    </nav>
  );
};

export default Navbar;
