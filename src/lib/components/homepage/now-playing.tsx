import { Movie } from "../../api/types/movie.types";
import HorizontalScroller from "../global/horizontal-scroller";
import NowPlayingCard from "./now-playing-card";
import "./styles/now-playing.styles.css";

export default function NowPlaying({ movies }: { movies: Movie[] }) {
  return (
    <section id="now-playing">
      <div className="now-playing-list-container">
        <div className="homepage-heading-container">
          <h1 className="now-playing-heading">Now Playing</h1>
          <a className="see-all-anchor label-m" href="/sessions">
            See all
          </a>
        </div>
        <div className="now-playing-list-overlay"></div>
        <HorizontalScroller className="now-playing-list">
          {movies.map((movie: Movie) => {
            return <NowPlayingCard key={movie.id} movie={movie} />;
          })}
        </HorizontalScroller>
      </div>
    </section>
  );
}
