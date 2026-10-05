"use client";

import { useParams } from "next/navigation";

export default function MovieDetailsPage() {
  const params = parseInt(useParams<{ movie: string }>().movie);

  return (
    <div className="movie-details-page-container">
      <section id="movie-detail-banner"></section>
      <section id="movie-detail-booking"></section>
    </div>
  );
}
