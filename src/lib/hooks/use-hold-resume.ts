"use client";

import { useEffect, useState } from "react";
import { getHold } from "@/lib/api/booking.api";
import { clearHoldId, loadHoldId, ticketsFromHold } from "@/lib/api/drafts.api";
import { clearDraft, restoreDraft } from "@/lib/misc/booking-draft";
import type { SeatHold, SeatMap, SelectedTicket } from "@/lib/api/types/booking.types";

type Options = {
  isAuthed: boolean;
  sessionId: number | string;
  seatMap: SeatMap;
  onRestoreDraft: (tickets: SelectedTicket[]) => void | Promise<void>;
  onResumeHold: (hold: SeatHold, tickets: SelectedTicket[]) => void;
  onExpired: () => void;
};

export function useHoldResume({
  isAuthed,
  sessionId,
  seatMap,
  onRestoreDraft,
  onResumeHold,
  onExpired,
}: Options) {
  const [isResuming, setIsResuming] = useState(true);

  useEffect(() => {
    if (!isAuthed) {
      setIsResuming(false);
      return;
    }

    const holdId = loadHoldId(sessionId);

    if (!holdId) {
      const restored = restoreDraft(sessionId, seatMap);
      clearDraft(sessionId);

      if (restored.length === 0) {
        setIsResuming(false);
        return;
      }

      Promise.resolve(onRestoreDraft(restored)).finally(() => setIsResuming(false));
      return;
    }

    let cancelled = false;
    getHold(holdId).then((result) => {
      if (cancelled) return;

      if (result.status === "live" && result.hold.sessionId === Number(sessionId)) {
        onResumeHold(result.hold, ticketsFromHold(result.hold, seatMap));
      } else {
        clearHoldId(sessionId);
        if (result.status === "expired") onExpired();
      }
      setIsResuming(false);
    });

    return () => {
      cancelled = true;
    };

  }, [isAuthed, sessionId]);

  return { isResuming };
}