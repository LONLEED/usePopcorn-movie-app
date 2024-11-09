import { useState } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { useMovies } from "./useMovies";
import NavBar from "./Componenets/NavBar";
import Search from "./Componenets/Search";
import NumResults from "./Componenets/NumResults";
import Main from "./Componenets/Main";
import Box from "./Componenets/Box";
import MovieList from "./Componenets/MovieList";
import MovieDetails from "./Componenets/MovieDetails";
import Loader from "./Componenets/Loader";
import ErrorMessage from "./Componenets/ErrorMessage";
import WatchedSummary from "./Componenets/WatchedSummary";
import WatchedMoviesList from "./Componenets/WatchedMoviesList";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
