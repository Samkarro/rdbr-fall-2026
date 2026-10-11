"use client";
import { getMyTickets } from "@/lib/api/booking.api";
import { Order } from "@/lib/api/types/booking.types";
import { useCallback, useEffect, useState } from "react";
import "./styles/my-tickets.styles.css";
import { refundOrder } from "@/lib/api/refunds.api";
import { useTimedMessage } from "@/lib/hooks/use-timed-message";
import EmptyState from "@/lib/components/global/empty-state";
import Link from "next/link";
import { formatSessionDateShort } from "@/lib/utils/dates";

export const REFUND_CUTOFF_MS = 2 * 60 * 60 * 1000;

export function formatRefundDeadline(startsAt: string): string {
  const deadline = new Date(new Date(startsAt).getTime() - REFUND_CUTOFF_MS);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    weekday: "short",
    month: "short",
    timeZone: "Asia/Tbilisi",
  }).format(deadline);
}

export default function MyTickets() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState<"upcoming" | "past">(
    "upcoming",
  );
  const [upcoming, setUpcoming] = useState<Order[]>([]);
  const [past, setPast] = useState<Order[]>([]);
  const [refundingId, setRefundingId] = useState<number | null>(null);
  const [errorMessage, showError] = useTimedMessage(5000);

  const loadTickets = useCallback(async () => {
    const [upcomingTickets, pastTickets] = await Promise.all([
      getMyTickets("upcoming"),
      getMyTickets("past"),
    ]);
    setUpcoming(upcomingTickets ?? []);
    setPast(pastTickets ?? []);
    setIsLoaded(true);
  }, []);

  // Extracted hook logic to allow reset after refund
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleRefund = async (order: Order) => {
    if (refundingId !== null) return;

    setRefundingId(order.id);
    const result = await refundOrder(order.reference);
    setRefundingId(null);

    if (!result.ok) {
      showError(result.message);
      if (result.status === 422) loadTickets();
      return;
    }

    if (result.order) {
      const refunded = result.order;
      setUpcoming((prev) => prev.filter((o) => o.id !== refunded.id));
      setPast((prev) => [
        refunded,
        ...prev.filter((o) => o.id !== refunded.id),
      ]);
    } else {
      loadTickets();
    }
  };

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
        {!isLoaded && ticketListRef.length === 0 && (
          <p className="label-s">Loading...</p>
        )}
        {isLoaded &&
          ticketListRef.length === 0 &&
          (activeTimeframe === "upcoming" ? (
            <EmptyState
              title="No upcoming tickets"
              message="You haven't booked anything yet. Find a session and grab your seats."
            >
              <Link
                href="/sessions"
                className="custom-button-large red-button clickable fit-content"
              >
                Browse sessions
              </Link>
            </EmptyState>
          ) : (
            <EmptyState
              title="No past tickets"
              message="Tickets for sessions you've attended or refunded will show up here."
            />
          ))}
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
                        {formatSessionDateShort(ticket.session.date)} ·{" "}
                        {ticket.session.time}
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
                  <div className="refund-button-wrapper">
                    {activeTimeframe === "upcoming" && !ticket.isRefundable && (
                      <p className="refund-blocked-label body-s">
                        Refunds close 2 hours before the session
                      </p>
                    )}
                    <button
                      className={`refund-button gray-button clickable ${ticket.isRefundable && refundingId === null ? "" : "disabled"}`}
                      disabled={!ticket.isRefundable || refundingId !== null}
                      onClick={() => handleRefund(ticket)}
                    >
                      {ticket.refundedAt !== null ? "Refunded" : "Refund"}
                    </button>
                  </div>
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
      {errorMessage && (
        <div key={errorMessage} className="booking-error-label">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
