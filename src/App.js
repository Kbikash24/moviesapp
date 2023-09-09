import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AddMovie from './components/AddMovies';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);
 
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-6b5e2-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong! retrying....');
      }

      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
      setRetry(true);
      setTimeout(() => {
        setRetry(false);
        fetchMoviesHandler();
      }, 5000);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const cancelRetry = () => {
    setRetry(false);
  };
 
  async function addMovieHandler(movie) {
    const response = await fetch('https://react-http-6b5e2-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  const moviesList = useMemo(() => {
    return <MoviesList movies={movies} />;
  }, [movies]);




  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = moviesList;
  }

  if (error) {
    content = (
      <div>
        <p>{error}</p>
        {retry ? (
          <div>
            <button onClick={cancelRetry}>Cancel</button>
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
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
<section>
      <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
