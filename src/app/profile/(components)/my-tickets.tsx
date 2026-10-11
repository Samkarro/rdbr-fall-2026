"use client";
import { getMyTickets } from "@/lib/api/booking.api";
import { Order } from "@/lib/api/types/booking.types";
import { useEffect, useState } from "react";
import "./styles/my-tickets.styles.css";
import { formatRefundDeadline } from "@/lib/api/refunds.api";

export default function MyTickets() {
  const [activeTimeframe, setActiveTimeframe] = useState<"upcoming" | "past">(
    "upcoming",
  );
  const [upcoming, setUpcoming] = useState<Order[]>([]);
  const [past, setPast] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchTickets() {
      const [upcomingTickets, pastTickets] = await Promise.all([
        getMyTickets("upcoming"),
        getMyTickets("past"),
      ]);

      setUpcoming(upcomingTickets ?? []);
      setPast(pastTickets ?? []);
    }

    fetchTickets();
  }, []);

  const ticketListRef = activeTimeframe == "upcoming" ? upcoming : past;

  return (
    <div className="my-tickets-section-container">
      <div className="my-tickets-timeframe-selector">
        <button
          className={`my-tickets-timeframe-button label-m clickable ${activeTimeframe === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTimeframe("upcoming")}
        >
          Upcoming {upcoming.length}
        </button>
        <button
          className={`my-tickets-timeframe-button label-m clickable ${activeTimeframe === "past" ? "active" : ""}`}
          onClick={() => setActiveTimeframe("past")}
        >
          Past {past.length}
        </button>
      </div>
      <div className="my-ticket-list">
        {ticketListRef.map((ticket: Order) => {
          const refundLabel = formatRefundDeadline(ticket.session.startsAt);
          return (
            <div className="my-ticket" key={ticket.id}>
              <div className="my-ticket-left">
                <img
                  className="my-ticket-poster"
                  src={ticket.session.movie.posterUrl ?? ""}
                />
                <div className="my-ticket-session-info-container">
                  <div className="my-ticket-movie-texts">
                    <h2 className="my-ticket-movie-title">
                      {ticket.session.movie.title}
                    </h2>
                    <p className="my-ticket-movie-age-rating label-s">
                      {ticket.session.movie.ageRating.code}
                    </p>
                    <p className="my-ticket-movie-runtime body-m">
                      {ticket.session.movie.runtimeMinutes} min
                    </p>
                  </div>
                  <div className="my-ticket-detail-container">
                    <div className="my-ticket-detail">
                      <p className="my-ticket-detail-heading overline">DATE</p>
                      <p className="my-ticket-detail-text label-m">
                        {ticket.session.date} · {ticket.session.time}
                      </p>
                    </div>
                    <div className="my-ticket-detail">
                      <p className="my-ticket-detail-heading overline">VENUE</p>
                      <p className="my-ticket-detail-text label-m">
                        {ticket.session.venue.name} · Hall{" "}
                        {ticket.session.hall.name}
                      </p>
                    </div>
                    <div className="my-ticket-detail">
                      <p className="my-ticket-detail-heading overline">
                        FORMAT
                      </p>
                      <p className="my-ticket-detail-text label-m">
                        {ticket.session.format.name} ·{" "}
                        {ticket.session.language.name}
                      </p>
                    </div>
                  </div>
                  <div className="my-ticket-seats-container">
                    <p className="my-ticket-detail-heading overline">SEATS</p>
                    {ticket.tickets.map((t) => {
                      return (
                        <p key={t.id} className="my-ticket-seat label-s">
                          {t.seatCode} ·{" "}
                          {t.ticketType.name[0] + t.ticketType.name.slice(1)}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="my-ticket-right">
                <div className="my-ticket-order-reference-container">
                  <p className="my-ticket-order-reference-label overline">
                    ORDER
                  </p>
                  <p className="my-ticket-order-reference label-m">
                    #{ticket.reference}
                  </p>
                </div>
                <div className="my-ticket-refundability-container">
                  <div className="my-ticket-price-container">
                    <p className="my-ticket-total-paid-label label-m">
                      Total paid
                    </p>
                    <p className="my-ticket-price h1">₾{ticket.totalPrice}</p>
                  </div>
                  <button
                    className={`refund-button gray-button clickable ${ticket.isRefundable ? "" : "disabled"}`}
                  >
                    {ticket.refundedAt !== null ? "Refunded" : "Refund"}
                  </button>
                  <p className="refundability-notice body-s">
                    Refundable until{" "}
                    {`${String((+ticket.session.time.split(":")[0] - 2 + 24) % 24).padStart(2, "0")}:${ticket.session.time.split(":")[1]}`}{" "}
                    {refundLabel}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
