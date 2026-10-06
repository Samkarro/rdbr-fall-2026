import { Movie } from "@/lib/api/types/movie.types";
import { Session } from "@/lib/api/types/sessions.types";

export default function SessionCard({
  movie,
  sessions,
}: {
  movie: Movie;
  sessions: Session[];
}) {
  return <div>{movie.title}</div>;
}
