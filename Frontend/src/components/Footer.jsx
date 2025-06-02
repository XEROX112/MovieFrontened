import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white py-6 px-4 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="text-sky-300 text-2xl">🎞️</div>
          <h1 className="text-xl font-bold text-sky-300">MovieFlix</h1>
        </div>

        <div className="flex space-x-6 text-sky-300 text-sm">
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="flex space-x-4 text-sky-300 text-xl">
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
        </div>
      </div>

      <hr className="my-4 border-sky-800" />

      <div className="text-center text-sm text-gray-400">
        By accessing this page, you confirm that you have read, understood, and agreed to our{' '}
        <span className="text-sky-400">
          Terms of Service, Cookie Policy, Privacy Policy,
        </span>{' '}
        and <span className="text-sky-400">Content Guidelines</span>.
      </div>

      <div className="text-center text-sm text-gray-500 mt-2">
        © 2025 MovieFlix. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
