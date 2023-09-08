import React, { useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);

  async function fetchMoviesHandler() {
    try {
      const response = await fetch('https://swapi.dev/api/films/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const transformMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id, 
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date, 
        };
      });
      setMovies(transformMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
