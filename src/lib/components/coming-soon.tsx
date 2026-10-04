import { Movie } from "../api/types/movie.types";
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
    </section>
  );
}
