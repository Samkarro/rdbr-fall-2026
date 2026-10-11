// Path: (components)/confirmation-view.tsx
"use client";

import { useRouter } from "next/navigation";
import type { Order } from "@/lib/api/types/booking.types";
import { formatTicketCounts } from "@/lib/misc/ticket-pricing";

export default function ConfirmationView({ order }: { order: Order }) {
  const router = useRouter();
  const { session, tickets } = order;

  return (
    <div className="confirmation-container">
      <div className="confirmation-info-box">
        <div className="confirmation-checkmark-container">
          <img
            className="confirmation-checkmark"
            src="/confirmation-check.svg"
            alt=""
          />
        </div>
        <div className="confirmation-message-container">
          <h1 className="confirmation-message-heading">Booking confirmed!</h1>
          <p className="confirmation-message body-s">
            Your tickets are ready. We've sent the confirmation to your email.
          </p>
          <div className="confirmation-order-reference label-s">
            ORDER #{order.reference}
          </div>
        </div>
      </div>

      <div className="confirmation-card">
        <div className="confirmation-card-session-info">
          <img
            className="confirmation-card-movie-poster"
            src={session.movie.posterUrl ?? undefined}
            alt=""
          />
          <div className="confirmation-card-session-info-text">
            <p className="confirmation-card-movie-title">
              {session.movie.title}
            </p>
            <p className="confirmation-card-session-details body-s">
              {session.venue.name} · Hall {session.hall.name} · {session.date} ·{" "}
              {session.time}
            </p>
          </div>
        </div>
        <hr />
        <div className="summary-card-info-container">
          <p className="confirmation-card-info-label body-s">Seats</p>
          <p className="confirmation-card-info-content label-s">
            {tickets.map((t) => t.seatCode).join(", ")}
          </p>
        </div>
        <div className="summary-card-info-container">
          <p className="confirmation-card-info-label body-s">Tickets</p>
          <p className="confirmation-card-info-content body-s">
            {formatTicketCounts(tickets.map((t) => t.ticketType.name))}
          </p>
        </div>
        <hr />
        <div className="summary-card-info-container">
          <p className="confirmation-card-info-label body-s">TOTAL</p>
          <p className="confirmation-card-total-price">₾ {order.totalPrice}</p>
        </div>
      </div>

      <div className="confirmation-card-buttons-container">
        <button
          className="custom-button-large red-button clickable"
          onClick={() => router.push("/profile?page=my-tickets")}
        >
          View my tickets
        </button>
        <button
          className="custom-button-large gray-button clickable"
          onClick={() => router.push("/")}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
