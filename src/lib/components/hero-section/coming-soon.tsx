import { Movie } from "../../api/types/movie.types";
import ComingSoonCard from "./coming-soon-card";
import "./styles/coming-soon.styles.css";

export default function ComingSoon({ movies }: { movies: Movie[] }) {
  return (
    <section id="coming-soon">
      <div className="homepage-heading-container">
        <h1 className="coming-soon-heading">Coming soon...</h1>
        <a className="see-all-anchor label-m" href="">
          See all
        </a>
      </div>
      <div className="coming-soon-list">
        <div className="coming-soon-list-overlay"></div>
        {movies.map((movie: Movie) => {
          return <ComingSoonCard key={movie.id} movie={movie} />;
        })}
      </div>
    </section>
  );
}
