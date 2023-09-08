import React, { useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import './components/loader.css'

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchMoviesHandler() {
    try {
      setIsLoading(true); // Set isLoading to true when fetching starts

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
    } finally {
      setIsLoading(false); // Set isLoading to false when fetching completes (whether successful or not)
    }
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {isLoading ? (
          // Show the loader when isLoading is true
          <div className="loader"></div>
        ) : (
          // Render the movie list when isLoading is false
          <MoviesList movies={movies} />
        )}
      </section>
    </React.Fragment>
  );
}

export default App;
