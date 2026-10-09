import { getMovieDetail } from "@/lib/api/catalog.api";
import "../../../lib/components/homepage/styles/hero.styles.css";
import "./styles/movie-detail.styles.css";
import { MovieDetail, MovieFormat } from "@/lib/api/types/movie.types";
import { notFound } from "next/navigation";
import { RecentMovie } from "@/lib/recently-viewed";
import TrackView from "./(components)/view-tracker";
import { getMe } from "@/lib/api/user.api";
import { getNextSevenDays, getToday } from "@/lib/utils/dates";
import DetailSessions from "./(components)/movie-detail-sessions";
import { getMovieSessionData } from "@/lib/api/sessions.api";
import { Session, Venue } from "@/lib/api/types/sessions.types";
import { Suspense } from "react";
import BookingModal from "./(components)/booking-modal";
import ModalShell from "./(components)/modal-shell";

export default async function MovieDetailsPage({
  searchParams,
  params,
}: PageProps<"/movies/[movie]">) {
  const { movie: slug } = await params;
  const sp = await searchParams;
  const user = await getMe();
  let movie: MovieDetail = await getMovieDetail(slug);
  if (!movie) notFound();

  const accountInvalid = Boolean(
    user !== null &&
    (user.dateOfBirth === null ||
      (user.dateOfBirth && getToday({ years: -16 })) <= user.dateOfBirth),
  );

  const days = getNextSevenDays();
  const sessionData = await getMovieSessionData(sp, slug);

  const releaseDate = new Date(movie.releaseDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const sessionId = typeof sp.session === "string" ? sp.session : undefined;

  const selected =
    !accountInvalid &&
    (sessionId
      ? sessionData
          .flatMap(({ sessions }: { sessions: Session }) => sessions)
          .find((session: Session) => String(session.id) === sessionId)
      : undefined);

  return (
    <div className="movie-details-page-container">
      {/* Tracking view so that it appears on the home page */}
      <TrackView
        movie={
          {
            slug: movie.slug,
            title: movie.title,
            posterUrl: movie.posterUrl ?? "",
            genre: movie.genres[0]?.name,
            runtimeMins: movie.runtimeMinutes,
            ageRating: movie.ageRating.code,
          } as RecentMovie
        }
      />
      <section id="movie-detail-banner">
        <img src={movie.backdropUrl ?? undefined} alt="" />
        <div className="movie-detail-image-overlay"></div>
        <div className="detail-banner-content">
          <img src={movie.posterUrl ?? undefined} alt="" />
          <div className="detail-banner-text-content">
            <div className="hero-content-red-label premiere-label label-s">
              NOW PLAYING
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
        <DetailSessions days={days} sessionData={sessionData} />
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
              <p className="label-m">{releaseDate}</p>
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
            {accountInvalid && (
              <div className="rating-note-container">
                <p className="rating-note-heading label-s">RATING NOTE</p>
                <div className="rating-note-sub-container">
                  <p className="label-s">{movie.ageRating.code}</p>
                  <p className="body-s">
                    {/* FIXME: dynamic message isn't accurate enough,
                    take into account the account age vs no account distinction */}
                    {movie.ageRating.code == "16+"
                      ? "Not recommended for under-16s. Tickets require an account aged 16 or over."
                      : "This film is rated 18+. You cannot buy tickets for it with this account."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {selected && (
        <Suspense
          key={selected.od}
          fallback={
            <ModalShell>
              <p>Loading seats…</p>
            </ModalShell>
          }
        >
          <BookingModal
            session={selected}
            title={movie.title}
            ageRating={movie.ageRating.code}
          />
        </Suspense>
      )}
    </div>
  );
}
