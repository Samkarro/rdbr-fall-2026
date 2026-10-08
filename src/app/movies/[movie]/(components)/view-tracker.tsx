// lib/components/movie-detail/track-view.tsx
"use client";
import { useEffect } from "react";
import { addRecent, RecentMovie } from "@/lib/recently-viewed";

export default function TrackView({ movie }: { movie: RecentMovie }) {
  useEffect(() => {
    addRecent(movie);
  }, [movie.slug]);

  return null;
}
