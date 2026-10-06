import { getMovieDetail } from "@/lib/api/catalog.api";
import "../../../lib/components/styles/hero.styles.css";
import "../../../lib/components/styles/movie-detail.styles.css";
import { MovieFormat } from "@/lib/api/types/movie.types";

export default async function MovieDetailsPage({
  params,
}: PageProps<"/movies/[movie]">) {
  const { movie: slug } = await params;
  // cached
  let movie = await getMovieDetail(slug);

  return (
    <div className="movie-details-page-container">
      <section id="movie-detail-banner">
        <img src={movie.backdropUrl ?? undefined} alt="" />
        <div className="movie-detail-image-overlay"></div>
        <div className="detail-banner-content">
          <img src={movie.posterUrl ?? undefined} alt="" />
          <div className="detail-banner-text-content">
            <div className="hero-content-red-label premiere-label label-s">
              {/* TODO: Change this to the correct relevant label */}
              PREMIERE · WEEK OF{" "}
              {new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "short",
              }).format(new Date(movie.releaseDate))}
            </div>
            <p className="hero-content-title display">{movie.title}</p>
            <p className="hero-section-synopsis body-m">{movie.synopsis}</p>

            <div className="hero-content-labels">
              <div className="hero-content-red-label label-s">
                {movie.ageRating.code}
              </div>
              <div className="hero-content-gray-label label-s">
                <img src="/stopwatch.svg" />
                {movie.runtimeMinutes} Min
              </div>
              {movie.formats &&
                movie.formats.map((format: MovieFormat) => {
                  return (
                    <div
                      key={format.id}
                      className="hero-content-gray-label label-s"
                    >
                      {format.name.toUpperCase()}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
      <section id="movie-detail-booking"></section>
    </div>
  );
}
