import React, { useState, useEffect, useMemo, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import "./components/loader.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Initially set to true
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const retryDelay = 5000; // Retry after 5 seconds

  // Memoize the MoviesList component to avoid re-rendering when other state changes
  const memoizedMoviesList = useMemo(() => <MoviesList movies={movies} />, [movies]);

  // Create a useCallback for fetchMoviesHandler to prevent unnecessary re-renders
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong");
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
      setError(error.message);
      setRetrying(true);

      // Retry after the specified delay
      setTimeout(() => {
        setRetrying(false);
      }, retryDelay);
    } finally {
      setIsLoading(false);
    }
  }, [retryDelay]);

  useEffect(() => {
    // Fetch data when the component mounts and on page reload
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  function cancelRetryHandler() {
    setRetrying(false);
  }

  let content = isLoading ? <p className="loader"></p> : memoizedMoviesList;

  if (error) {
    content = (
      <div>
        <p>{error}</p>
        {retrying ? (
          <div>
            Retrying...
            <button onClick={cancelRetryHandler}>Cancel</button>
          </div>
        ) : (
          <div>
            <button onClick={fetchMoviesHandler}>Retry</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <React.Fragment>
      <section>
        <h1>Star Wars Movies</h1>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
