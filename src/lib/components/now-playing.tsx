import { Movie } from "../api/types/movie.types";
import NowPlayingCard from "./now-playing-card";
import "./styles/now-playing.styles.css";

export default function ({ movies }: { movies: Movie[] }) {
  return (
    <section id="now-playing">
      <div className="now-playing-list-container">
        <h1>Now Playing</h1>
        <div className="now-playing-list">
          {movies.map((movie: Movie) => {
            return <NowPlayingCard key={movie.id} movie={movie} />;
          })}
        </div>
      </div>
    </section>
  );
}
