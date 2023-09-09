import React, { useState } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import "./components/loader.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const retryDelay = 5000; // Retry after 5 seconds

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/film/");
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
        fetchMoviesHandler(); // Retry the fetch
      }, retryDelay);
    } 
      setIsLoading(false);
    
  }

  function cancelRetryHandler() {
    setRetrying(false);
  }

  let content = <p>no movies found</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

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

  if (isLoading) {
    content = <p className="loader"></p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
