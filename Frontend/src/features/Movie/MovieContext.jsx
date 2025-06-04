import React, { createContext, useContext } from 'react';

const MovieContext = createContext();

const allMovies = [
  {
    id: '1',
    title: 'Avengers: Main',
    rating: 8.4,
    year: 2019,
    genre: ['Action', 'Adventure', 'Science Fiction'],
    duration: '181 min',
    language: 'English',
    format: ['2D', '3D', 'IMAX', '4DX'],
    description:
      'The epic conclusion to the Infinity Saga...',
    about:
      'After the devastating events of Infinity War...',
    cast: [
      { name: 'Robert Downey Jr.', role: 'Tony Stark / Iron Man' },
      { name: 'Chris Evans', role: 'Steve Rogers / Captain America' },
      // more...
    ],
  },
  {
    id: '2',
    title: 'Guardians of the Galaxy',
    rating: 8.0,
    year: 2014,
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    duration: '121 min',
    language: 'English',
    format: ['2D', '3D'],
    description:
      'A group of intergalactic criminals must pull together...',
    about:
      'Peter Quill forms an uneasy alliance...',
    cast: [
      { name: 'Chris Pratt', role: 'Peter Quill / Star-Lord' },
      { name: 'Zoe Saldana', role: 'Gamora' },
    ],
  },
];

export const MovieProvider = ({ children }) => {
  return (
    <MovieContext.Provider value={allMovies}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);
