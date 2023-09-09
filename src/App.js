import React, { useState, useEffect, useMemo, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import "./components/loader.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
 
  const [formData, setFormData] = useState({
    title: "",
    openingText: "",
    releaseDate: "",
  });

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
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  },[]);

  useEffect(() => {
    // Fetch data when the component mounts and on page reload
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  function cancelRetryHandler() {
    setRetrying(false);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form data (you can add more validation logic here)

    // Create a new movie object
    const newMovie = {
      id: movies.length + 1, // Generate a unique ID for the new movie
      ...formData,
    };

    // Add the new movie to the movies array
    setMovies((prevMovies) => [...prevMovies, newMovie]);

    // Clear the form data
    setFormData({
      title: "",
      openingText: "",
      releaseDate: "",
    });
  };

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
      <section className="form">
        {/* Add a form to add movies */}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="openingText">Opening Text:</label>
            <textarea
              id="openingText"
              name="openingText"
              value={formData.openingText}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="releaseDate">Release Date:</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Add Movie</button>
        </form>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
