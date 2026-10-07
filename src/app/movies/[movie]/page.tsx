import { getMovieDetail } from "@/lib/api/catalog.api";
import "../../../lib/components/homepage/styles/hero.styles.css";
import "./styles/movie-detail.styles.css";
import { MovieFormat } from "@/lib/api/types/movie.types";
import { notFound } from "next/navigation";

export default async function MovieDetailsPage({
  params,
}: PageProps<"/movies/[movie]">) {
  const { movie: slug } = await params;
  let movie = await getMovieDetail(slug);
  if (!movie) notFound();

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
      <section id="movie-detail-booking">
        <div className="movie-extensive-detail-container">
          <div className="movie-extensive-detail-text-container">
            <h2>Details</h2>
            <label className=" movie-extensive-detail-text-label label-s">
              director
              <p className="label-m">{movie.director}</p>
            </label>
            <label className=" movie-extensive-detail-text-label label-s">
              main cast
              <p className="label-m">{movie.cast}</p>
            </label>
            <label className=" movie-extensive-detail-text-label label-s">
              duration
              <p className="label-m">{movie.runtimeMinutes} minutes</p>
            </label>
            <label className=" movie-extensive-detail-text-label label-s">
              release date
              <p className="label-m">{movie.releaseDate}</p>
            </label>
            <label className=" movie-extensive-detail-text-label label-s">
              formats
              <p className="label-m">
                {movie.formats.map((f) => f.name).join(", ")}
              </p>
            </label>
            <label className=" movie-extensive-detail-text-label label-s">
              from
              <p className="label-m">₾{movie.fromPrice}</p>
            </label>
            {/* FIXME: placeholder. Make dynamic based on account age & completion*/}
            <div className="rating-note-container">
              <p className="rating-note-heading label-s">RATING NOTE</p>
              <div className="rating-note-sub-container">
                <p className="label-s">16+</p>
                <p className="body-s">
                  Not recommended for under-16s. Tickets require an account aged
                  16 or over.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
