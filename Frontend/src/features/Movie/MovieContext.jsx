import React, { createContext, useContext } from 'react';
const MovieContext = createContext();

const allMovies = [
  {
    id: '1',
    title: 'Avengers: EndGame',
    rating: 8.4,
    year: 2019,
    genre: ['Action', 'Adventure', 'Science Fiction'],
    duration: '181 min',
    formats: {
      English: ['2D', '3D', 'IMAX', '4DX'],
      Hindi: ['2D', '3D']
    },
    description: 'After the devastating events of Infinity War...',
    about: 'After the devastating events of Infinity War...',
    poster: 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
    cast: [
      { name: 'Robert Downey Jr.', role: 'Tony Stark / Iron Man' },
      { name: 'Chris Evans', role: 'Steve Rogers / Captain America' }
    ]
  },
  {
    id: '2',
    title: 'Guardians of the Galaxy',
    rating: 8.0,
    year: 2014,
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    duration: '121 min',
    formats: {
      English: ['2D', '3D'],
      Hindi: ['2D']
    },
    description: 'A group of intergalactic criminals must pull together...',
    about: 'Peter Quill forms an uneasy alliance...',
    poster: 'https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
    cast: [
      { name: 'Chris Pratt', role: 'Peter Quill / Star-Lord' },
      { name: 'Zoe Saldana', role: 'Gamora' }
    ]
  },
  {
    id: '3',
    title: 'Inception',
    rating: 8.8,
    year: 2010,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    duration: '148 min',
    formats: {
      English: ['2D', 'IMAX'],
      Hindi: ['2D']
    },
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
    about: 'Dom Cobb is a skilled thief who steals secrets from deep within the subconscious...',
    poster: 'https://image.tmdb.org/t/p/original/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Dom Cobb' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur' }
    ]
  },
  {
    id: '4',
    title: 'The Dark Knight',
    rating: 9.0,
    year: 2008,
    genre: ['Action', 'Crime', 'Drama'],
    duration: '152 min',
    formats: {
      English: ['2D', 'IMAX'],
      Hindi: ['2D']
    },
    description: 'When the menace known as the Joker wreaks havoc and chaos...',
    about: 'Batman raises the stakes in his war on crime...',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne / Batman' },
      { name: 'Heath Ledger', role: 'Joker' }
    ]
  },
  {
    id: '5',
    title: 'Interstellar',
    rating: 8.6,
    year: 2014,
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    duration: '169 min',
    formats: {
      English: ['2D', 'IMAX', '4DX'],
      Hindi: ['2D']
    },
    description: 'A team of explorers travel through a wormhole in space...',
    about: 'In a dystopian future, a group of astronauts undertake a mission...',
    poster: 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper' },
      { name: 'Anne Hathaway', role: 'Brand' }
    ]
  },
  {
    id: '6',
    title: 'Spider-Man: Into the Spider-Verse',
    rating: 8.4,
    year: 2018,
    genre: ['Animation', 'Action', 'Adventure'],
    duration: '117 min',
    formats: {
      English: ['2D', '3D'],
      Hindi: ['2D']
    },
    description: 'Teen Miles Morales becomes Spider-Man of his reality...',
    about: 'Miles Morales navigates being a teenager and becoming Spider-Man...',
    poster: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    cast: [
      { name: 'Shameik Moore', role: 'Miles Morales / Spider-Man (voice)' },
      { name: 'Jake Johnson', role: 'Peter B. Parker / Spider-Man (voice)' }
    ]
  },
  {
    id: '7',
    title: 'Joker',
    rating: 8.5,
    year: 2019,
    genre: ['Crime', 'Drama', 'Thriller'],
    duration: '122 min',
    formats: {
      English: ['2D'],
      Hindi: ['2D']
    },
    description: 'In Gotham City, mentally troubled comedian Arthur Fleck...',
    about: 'Arthur Fleck embarks on a downward spiral...',
    poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    cast: [
      { name: 'Joaquin Phoenix', role: 'Arthur Fleck / Joker' },
      { name: 'Robert De Niro', role: 'Murray Franklin' }
    ]
  }
];



export const MovieProvider = ({ children }) => {
  return (
    <MovieContext.Provider value={allMovies}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);
