"use client";

import { useCallback, useEffect, useState } from "react";
import {
  HoldResult,
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
import { getHold, holdSeats } from "@/lib/api/booking.api";
import {
  clearHoldId,
  loadHoldId,
  saveHoldId,
  ticketsFromHold,
} from "@/lib/api/drafts.api";

type BookingPhase = "seats" | "checkout" | "confirmation";

export type SelectedTicket = {
  seat: Seat;
  type: TicketType;
};

export default function BookingModalContent({
  session,
  seatMap,
  user,
  ageRating,
}: {
  session: Session;
  seatMap: SeatMap;
  user: User | null;
  ageRating: string;
}) {
  const [hold, setHold] = useState<SeatHold | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [errorMessage, showError] = useTimedMessage(5000);

  const [phase, setPhase] = useState<BookingPhase>("seats");
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);

  const [isResuming, setIsResuming] = useState(true);

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

  return (
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

        {phase === "checkout" && <div className="payment-left-container" />}
      </div>

      <div className="booking-modal-separator" />

      <div className="booking-modal-right-content">
        <div className="selected-seats-container">
          <p className="selected-seats-heading">Your seats · Max {MAX_SEATS}</p>

          {selectedTickets.length > 0 ? (
            selectedTickets.map(({ seat, type }) => (
              <SelectedSeatCard
                key={seat.id}
                seat={seat}
                ageRating={ageRating}
                type={type}
                price={session.price}
                onTypeChange={(newType) =>
                  handleTicketTypeChange(seat.id, newType)
                }
              />
            ))
          ) : (
            <p className="seat-guide-message body-s">
              Pick up to {MAX_SEATS} seats from the map. Each seat can carry its
              own ticket type.
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
  );
}
