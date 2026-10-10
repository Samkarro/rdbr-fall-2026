"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FieldErrors,
  HoldResult,
  Order,
  OrderResult,
  Seat,
  SeatHold,
  SeatMap,
  TicketType,
} from "@/lib/api/types/booking.types";
import { Session } from "@/lib/api/types/sessions.types";
import { User } from "@/lib/api/types/user.types";
import SeatPicker, { MAX_SEATS } from "./seat-picker";
import SelectedSeatCard from "./selected-seat-card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clearDraft, restoreDraft, saveDraft } from "@/lib/misc/booking-draft";
import { useTimedMessage } from "@/lib/hooks/use-timed-message";
import { useHoldCountdown } from "@/lib/hooks/use-hold-countdown";
import { getHold, holdSeats, submitOrder } from "@/lib/api/booking.api";
import {
  clearHoldId,
  loadHoldId,
  saveHoldId,
  ticketsFromHold,
} from "@/lib/api/drafts.api";
import "./styles/checkout.styles.css";
import CheckoutForm from "./checkout-form";

type BookingPhase = "seats" | "checkout" | "confirmation";

export type SelectedTicket = {
  seat: Seat;
  type: TicketType;
};

export default function BookingModalContent({
  session,
  seatMap,
  user,
  movieAgeRating,
  movieTitle,
  sessionDetails,
}: {
  session: Session;
  seatMap: SeatMap;
  user: User | null;
  movieAgeRating: string;
  movieTitle: string;
  sessionDetails: string;
}) {
  const [hold, setHold] = useState<SeatHold | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [errorMessage, showError] = useTimedMessage(5000);

  const [phase, setPhase] = useState<BookingPhase>("seats");
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);

  const [isResuming, setIsResuming] = useState(true);

  const [order, setOrder] = useState<Order | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAuthed = user !== null;

  const handleExpire = useCallback(() => {
    clearHoldId(session.id);
    setHold(null);
    setSelectedTickets([]);
    setPhase("seats");
    showError("Your hold time expired. Please re-select your seats.");
    router.refresh();
  }, [router, showError]);

  const secondsLeft = useHoldCountdown(hold?.expiresAt ?? null, handleExpire);

  const handleHoldError = (result: Extract<HoldResult, { ok: false }>) => {
    if (result.status === 409 && "contested" in result) {
      const lost = new Set(result.contested);
      // drop only the lost seats, keep the rest
      setSelectedTickets((prev) =>
        prev.filter(({ seat }) => !lost.has(seat.code)),
      );
      showError(
        result.contested.length
          ? `${result.contested.join(", ")} just got taken. Please pick other seats.`
          : result.message,
      );
      router.refresh();
      return;
    }
    showError(result.message);
  };

  // Restoring previous inputs
  useEffect(() => {
    if (!isAuthed) {
      setIsResuming(false);
      return;
    }

    const holdId = loadHoldId(session.id);

    if (!holdId) {
      const restored = restoreDraft(session.id, seatMap);
      if (restored.length)
        setSelectedTickets((prev) => (prev.length ? prev : restored));
      clearDraft(session.id);
      setIsResuming(false);
      return;
    }

    let cancelled = false;
    getHold(holdId).then((result) => {
      if (cancelled) return;

      if (
        result.status === "live" &&
        result.hold.sessionId === Number(session.id)
      ) {
        setSelectedTickets(ticketsFromHold(result.hold, seatMap));
        setHold(result.hold);
        setPhase("checkout");
      } else {
        clearHoldId(session.id);
        if (result.status === "expired") handleExpire();
      }
      setIsResuming(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthed, session.id]);

  const handleNext = async () => {
    if (selectedTickets.length === 0 || isHolding) return;

    if (!isAuthed) {
      saveDraft(session.id, selectedTickets);
      const params = new URLSearchParams(searchParams.toString());
      params.set("auth", "true");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      return;
    }

    setIsHolding(true);
    const result = await holdSeats(
      session.id,
      selectedTickets.map(({ seat, type }) => ({
        seatId: seat.id,
        ticketType: type,
      })),
    );

    setIsHolding(false);

    if (result.ok) {
      saveHoldId(session.id, result.hold.holdId);
      setHold(result.hold);
      setPhase("checkout");
      return;
    }
    handleHoldError(result);
  };

  const handleTicketTypeChange = (seatId: Seat["id"], type: TicketType) => {
    setSelectedTickets((prev) =>
      prev.map((ticket) =>
        ticket.seat.id === seatId ? { ...ticket, type } : ticket,
      ),
    );
  };

  const calculateSubtotal = () => {
    let sum = 0;

    selectedTickets.forEach(({ type }) => {
      switch (type) {
        case "child":
          sum += Math.round(session.price * 60);
          break;
        case "student":
          sum += Math.round(session.price * 75);
          break;
        default:
          sum += Math.round(session.price * 100);
          break;
      }
    });

    return sum / 100;
  };

  const calculateTicketTypeAmt = () => {
    return Object.entries(
      selectedTickets.reduce(
        (counts, { type }) => {
          counts[type]++;
          return counts;
        },
        { child: 0, student: 0, adult: 0 },
      ),
    )
      .filter(([, count]) => count > 0)
      .map(
        ([type, count]) =>
          `${count} x ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      )
      .join(", ");
  };

  const dropContested = (codes: string[], fallback: string) => {
    const lost = new Set(codes);
    setSelectedTickets((prev) =>
      prev.filter(({ seat }) => !lost.has(seat.code)),
    );
    showError(
      codes.length
        ? `${codes.join(", ")} just got taken. Please pick other seats.`
        : fallback,
    );
    router.refresh();
  };

  const clearFieldError = (name: string) =>
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });

  const handleCheckoutSubmit = async (data: FormData) => {
    if (!hold || isSubmitting) return;

    setFieldErrors({});
    setIsSubmitting(true);

    let result: OrderResult;
    try {
      result = await submitOrder(hold.holdId, data);
    } catch {
      result = {
        ok: false,
        status: 0,
        message: "Something went wrong. Please try again.",
      };
    } finally {
      setIsSubmitting(false);
    }

    if (result.ok) {
      clearHoldId(session.id);
      setHold(null);
      setOrder(result.order);
      setPhase("confirmation");
      return;
    }

    if (result.status === 409 && "contested" in result) {
      clearHoldId(session.id);
      setHold(null);
      setPhase("seats");
      dropContested(result.contested, result.message);
      return;
    }

    if (result.status === 403) {
      clearHoldId(session.id);
      setHold(null);
      setPhase("seats");
      showError(result.message);
      return;
    }

    // auth=true handles unauthorized codes already
    if (result.status === 401) return;

    if (result.status === 422) {
      if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
        setFieldErrors(result.fieldErrors);
      } else {
        handleExpire();
      }
      return;
    }

    showError(result.message);
  };

  return (
    <div className="booking-modal-content-wrapper">
      {phase !== "confirmation" && (
        <div className="booking-modal-header">
          <div className="booking-modal-info">
            <h2 className="booking-modal-session-title">{movieTitle}</h2>
            <p className="booking-modal-session-details body-s">
              {sessionDetails}
            </p>
          </div>
        </div>
      )}
      <div className="booking-modal-content">
        <div className="booking-modal-left-content">
          <div className="booking-phase-switcher-container">
            <button
              className={`booking-phase-switcher label-s ${phase === "seats" ? "active" : ""}`}
            >
              SEATS
            </button>
            <button
              className={`booking-phase-switcher label-s ${
                phase === "checkout" ? "active" : ""
              }`}
              onClick={handleNext}
            >
              CHECKOUT
            </button>
          </div>

          {phase === "seats" && !isResuming && (
            <SeatPicker
              seatMap={seatMap}
              selectedTickets={selectedTickets}
              setSelectedTickets={setSelectedTickets}
            />
          )}

          {phase === "checkout" && (
            <CheckoutForm
              user={user!}
              errors={fieldErrors}
              onSubmit={handleCheckoutSubmit}
              onFieldChange={clearFieldError}
            />
          )}
        </div>

        <div className="booking-modal-separator" />
        <div className="booking-modal-right-content">
          {phase === "seats" && (
            <div className="seats-right-container">
              <div className="selected-seats-container">
                <p className="selected-seats-heading">
                  Your seats · Max {MAX_SEATS}
                </p>

                {selectedTickets.length > 0 ? (
                  selectedTickets.map(({ seat, type }) => (
                    <SelectedSeatCard
                      key={seat.id}
                      seat={seat}
                      ageRating={movieAgeRating}
                      type={type}
                      price={session.price}
                      onTypeChange={(newType) =>
                        handleTicketTypeChange(seat.id, newType)
                      }
                    />
                  ))
                ) : (
                  <p className="seat-guide-message body-s">
                    Pick up to {MAX_SEATS} seats from the map. Each seat can
                    carry its own ticket type.
                  </p>
                )}
              </div>
              <div className="subtotal-container">
                <div className="subtotal-text-container">
                  <p className="subtotal-text label-s">SUBTOTAL</p>
                  <p className="subtotal-amt h1">₾ {calculateSubtotal()}</p>
                </div>
                <button
                  className={`custom-button-large red-button clickable ${
                    selectedTickets.length === 0 || isHolding ? "disabled" : ""
                  }`}
                  disabled={selectedTickets.length === 0 || isHolding}
                  onClick={handleNext}
                >
                  Next: Checkout
                </button>
              </div>
            </div>
          )}
          {phase === "checkout" && (
            <div className="payment-left-container">
              <div className="summary-container">
                <div>
                  <p className="summary-heading">Summary</p>
                  <div className="summary-card">
                    <div className="summary-card-header">
                      <p className="summary-card-header-heading">
                        {movieTitle}
                      </p>
                      <p className="summary-card-header-sub body-s">
                        {sessionDetails}
                      </p>
                    </div>
                    <hr />

                    <div className="summary-card-info-container">
                      <p className="summary-card-info-label body-s">Seats</p>
                      <p className="summary-card-info body-s">
                        {selectedTickets
                          .map(({ seat }) => seat.code)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="summary-card-info-container">
                      <p className="summary-card-info-label body-s">Tickets</p>
                      <p className="summary-card-info ticket-type-info body-s">
                        {calculateTicketTypeAmt()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="subtotal-container">
                  <div className="subtotal-text-container">
                    <p className="subtotal-text label-s">SUBTOTAL</p>
                    <p className="subtotal-amt h1">₾ {calculateSubtotal()}</p>
                  </div>
                  <button
                    type="submit"
                    form="checkout-form"
                    className={`custom-button-large red-button clickable ${isSubmitting ? "disabled" : ""}`}
                    disabled={isSubmitting}
                  >
                    Pay: Complete order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {phase === "confirmation" && order && (
          <div className="confirmation-container">
            <div className="confirmation-info-box">
              <div className="confirmation-checkmark-container">
                <img src="/check.svg" alt="" />
              </div>
              <div className="confirmation-message-container">
                <h1 className="confirmation-message-heading">
                  Booking confirmed!
                </h1>
                <p className="confirmation-message body-s">
                  Your tickets are ready. We've sent the confirmation to your
                  email.
                </p>
                <div className="confirmation-order-label">{order.id}</div>
              </div>
            </div>
            <div className="confirmation-card">
              <div className="confirmation-card-session-info">
                <img src="/x.svg" alt="" />
                <div className="confirmation-card-session-info-text">
                  <p className="confirmation-card-movie-title">
                    {order.session.movie.title}
                  </p>
                  <p className="confirmation-card-session-details">
                    {order.session.venue.name} · Hall {order.session.hall.name}{" "}
                    · {order.session.date} · {order.session.time}
                  </p>
                </div>
              </div>
              <hr />
              <div className="confirmation-card-ticket-detail-container">
                <div className="summary-card-info-container">
                  <p className="confirmation-card-info-label">Seats</p>
                  <p className="confirmation-card-info-content">
                    {order.tickets.map((t) => t.seatCode).join(", ")}
                  </p>
                </div>
                <div className="summary-card-info-container">
                  <p className="confirmation-card-info-label">Tickets</p>1
                  {/* TODO: extract this better later */}
                  <p className="confirmation-card-info-content">
                    {Object.entries(
                      selectedTickets.reduce(
                        (counts, { type }) => {
                          counts[type]++;
                          return counts;
                        },
                        { child: 0, student: 0, adult: 0 },
                      ),
                    )
                      .filter(([, count]) => count > 0)
                      .map(
                        ([type, count]) =>
                          `${count} x ${type.charAt(0).toUpperCase() + type.slice(1)}`,
                      )
                      .join(", ")}
                  </p>
                </div>
              </div>
              <hr />
              <div className="summary-card-info-container">
                <p className="confirmation-card-info-label larger">TOTAL</p>
                <p className="confirmation-card-info-content larger">
                  ₾ {order.totalPrice}
                </p>
              </div>
            </div>
          </div>
        )}
        {errorMessage && (
          <div key={errorMessage} className="booking-error-label">
            {errorMessage}
          </div>
        )}
        {secondsLeft !== null && secondsLeft > 0 && (
          <div className="clock-container">
            <p className="seats-held-label label-s">SEATS HELD</p>
            <p className="countdown label-s">
              {Math.floor(secondsLeft / 60)}:
              {String(secondsLeft % 60).padStart(2, "0")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
