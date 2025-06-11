import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ManageTheatreNavbar from '../components/ManageTheatreNavbar';
import AddTheater from './AddTheater';
import AddMovie from './AddMovie';
import TheaterDetail from './TheaterDetail';
import AddShow from './AddShow';
import TodayShows from './TodayShows';
export default function ManageTheatre() {
  const [activeTab, setActiveTab] = useState('addTheatre');

 const dummyMovies = [
  {
    id: 1,
    title: 'Inception',
    poster: 'https://www.themoviedb.org/t/p/w1280/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    genre: ['Sci-Fi', 'Thriller'],
    duration: 148,
    language: 'English, Hindi',
    format: '2D, IMAX',
  },
  {
    id: 2,
    title: 'Interstellar',
    poster: 'https://www.themoviedb.org/t/p/w1280/sR1Wh1rNQCrGr6Qs47DCdXxEC0S.jpg',
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    duration: 169,
    language: 'English, Hindi, Tamil',
    format: '2D, 3D, IMAX',
  },
  {
    id: 3,
    title: 'Dune',
    poster: 'https://www.themoviedb.org/t/p/w1280/A80Rx2cGLlNXvKB2AUB5mbnVnI6.jpg',
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    duration: 155,
    language: 'English',
    format: '2D, 3D',
  },
  {
    id: 4,
    title: 'The Dark Knight',
    poster: 'https://www.themoviedb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    genre: ['Action', 'Crime', 'Drama'],
    duration: 152,
    language: 'English, Hindi',
    format: '2D, IMAX',
  },
  {
    id: 5,
    title: 'Avengers: Endgame',
    poster: 'https://www.themoviedb.org/t/p/w1280/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    genre: ['Superhero', 'Action', 'Adventure'],
    duration: 181,
    language: 'English, Hindi, Tamil, Telugu',
    format: '2D, 3D, IMAX',
  },
  {
    id: 6,
    title: 'Oppenheimer',
    poster: 'https://www.themoviedb.org/t/p/w1280/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
    genre: ['Biography', 'Drama', 'History'],
    duration: 180,
    language: 'English, Hindi',
    format: '2D, IMAX',
  },
];



  const renderTabContent = () => {
    switch (activeTab) {
      case 'addTheatre':
        return <AddTheater />;
      case 'theatreDetails':
        return <TheaterDetail />;
      case 'addMovie':
        return <AddMovie />;
      case 'addShow':
        return <AddShow movies={dummyMovies} />;
      case 'todaysShows':
        return <TodayShows/> ;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <ManageTheatreNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-6xl mx-auto mt-6">
        {renderTabContent()}
      </div>
      <Footer />
    </>
  );
}
