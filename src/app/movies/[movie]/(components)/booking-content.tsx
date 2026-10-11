"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  BookingPhase,
  FieldErrors,
  HoldResult,
  Order,
  OrderResult,
  Seat,
  SeatHold,
  SeatMap,
  SelectedTicket,
  TicketType,
} from "@/lib/api/types/booking.types";
import type { Session } from "@/lib/api/types/sessions.types";
import type { User } from "@/lib/api/types/user.types";
import { holdSeats, submitOrder } from "@/lib/api/booking.api";
import { clearHoldId, saveHoldId } from "@/lib/api/drafts.api";
import { saveDraft } from "@/lib/misc/booking-draft";
import { calculateSubtotal } from "@/lib/misc/ticket-pricing";
import { selectionMatchesHold } from "@/lib/misc/hold-selection";
import { useTimedMessage } from "@/lib/hooks/use-timed-message";
import { useHoldCountdown } from "@/lib/hooks/use-hold-countdown";
import { useHoldResume } from "@/lib/hooks/use-hold-resume";
import "./styles/checkout.styles.css";
import "./styles/booking-confirmation.styles.css";
import ConfirmationView from "./booking-content-leaves/confirmation-view";
import CheckoutForm from "./booking-content-leaves/checkout-form";
import SeatsSidebar from "./booking-content-leaves/seats-sidebar";
import CheckoutSummary from "./booking-content-leaves/checkout-summary";
import BookingHeader from "./booking-content-leaves/booking-header";
import SeatPicker from "./booking-content-leaves/seat-picker";
export type { SelectedTicket } from "@/lib/api/types/booking.types";

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
  const [phase, setPhase] = useState<BookingPhase>("seats");
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [hold, setHold] = useState<SeatHold | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, showError] = useTimedMessage(5000);

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
  }, [router, showError, session.id]);

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

  const resetToSeats = () => {
    clearHoldId(session.id);
    setHold(null);
    setPhase("seats");
  };

  const showSeats = () => setPhase("seats");

  const secondsLeft = useHoldCountdown(hold?.expiresAt ?? null, handleExpire);

  const handleHoldError = (result: Extract<HoldResult, { ok: false }>) => {
    if (result.status === 409 && "contested" in result) {
      dropContested(result.contested, result.message);
      return;
    }
    showError(result.message);
  };

  const holdAndContinue = async (tickets: SelectedTicket[]) => {
    if (tickets.length === 0) return;

    setIsHolding(true);
    let result: HoldResult;
    try {
      result = await holdSeats(
        session.id,
        tickets.map(({ seat, type }) => ({
          seatId: seat.id,
          ticketType: type,
        })),
      );
    } finally {
      setIsHolding(false);
    }

    if (result.ok) {
      saveHoldId(session.id, result.hold.holdId);
      setHold(result.hold);
      setPhase("checkout");
      return;
    }
    handleHoldError(result);
  };

  const { isResuming } = useHoldResume({
    isAuthed,
    sessionId: session.id,
    seatMap,
    onRestoreDraft: async (restored) => {
      setSelectedTickets(restored);
      await holdAndContinue(restored);
    },
    onResumeHold: (resumed, tickets) => {
      setSelectedTickets(tickets);
      setHold(resumed);
      setPhase("checkout");
    },
    onExpired: handleExpire,
  });

  const handleNext = async () => {
    if (selectedTickets.length === 0 || isHolding) return;

    if (!isAuthed) {
      saveDraft(session.id, selectedTickets);
      const params = new URLSearchParams(searchParams.toString());
      params.set("auth", "true");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      return;
    }

    if (selectionMatchesHold(hold, selectedTickets)) {
      setPhase("checkout");
      return;
    }

    await holdAndContinue(selectedTickets);
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
      resetToSeats();
      dropContested(result.contested, result.message);
      return;
    }

    if (result.status === 403) {
      resetToSeats();
      showError(result.message);
      return;
    }

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

  const handleTicketTypeChange = (seatId: Seat["id"], type: TicketType) => {
    setSelectedTickets((prev) =>
      prev.map((ticket) =>
        ticket.seat.id === seatId ? { ...ticket, type } : ticket,
      ),
    );
  };

  const handleRemoveSeat = (seatId: Seat["id"]) => {
    setSelectedTickets((prev) => prev.filter((t) => t.seat.id !== seatId));
  };

  const subtotal = calculateSubtotal(selectedTickets, session.price);
  const tabsBusy = isHolding || isResuming || isSubmitting;

  return (
    <div className="booking-modal-content-wrapper">
      {phase === "confirmation" ? (
        order && <ConfirmationView order={order} />
      ) : (
        <>
          <BookingHeader
            movieTitle={movieTitle}
            sessionDetails={sessionDetails}
          />

          <div className="booking-modal-content">
            <div className="booking-modal-left-content">
              <div className="booking-phase-switcher-container">
                <button
                  type="button"
                  className={`booking-phase-switcher label-s clickable ${phase === "seats" ? "active" : ""}`}
                  onClick={() => {
                    if (!tabsBusy && phase !== "seats") showSeats();
                  }}
                >
                  SEATS
                </button>
                <button
                  type="button"
                  className={`booking-phase-switcher label-s clickable ${phase === "checkout" ? "active" : ""}`}
                  onClick={() => {
                    if (!tabsBusy && phase !== "checkout") handleNext();
                  }}
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
                <SeatsSidebar
                  selectedTickets={selectedTickets}
                  ageRating={movieAgeRating}
                  basePrice={session.price}
                  subtotal={subtotal}
                  isHolding={isHolding}
                  onTypeChange={handleTicketTypeChange}
                  onRemove={handleRemoveSeat}
                  onNext={handleNext}
                />
              )}

              {phase === "checkout" && (
                <CheckoutSummary
                  movieTitle={movieTitle}
                  session={session}
                  selectedTickets={selectedTickets}
                  subtotal={subtotal}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>

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
        </>
      )}

      {errorMessage && (
        <div key={errorMessage} className="booking-error-label">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
