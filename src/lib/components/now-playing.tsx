import { Movie } from "../api/types/movie.types";
import "./styles/now-playing.styles.css";

export default function ({ movies }: { movies: Movie[] }) {
  return (
    <section id="now-playing">
      <div className="now-playing-list-container">
        <h1>Now Playing</h1>
        <div className="now-playing-list">
          {movies.map((movie: Movie, index) => {
            return (
              <div key={index} className="now-playing-card">
                {movie.title}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
