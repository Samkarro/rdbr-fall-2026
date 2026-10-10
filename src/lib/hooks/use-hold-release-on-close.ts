"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { clearHoldId, loadHoldId } from "../api/drafts.api";
import { releaseHold } from "../api/booking.api";
import { clearDraft } from "../misc/booking-draft";

export function useHoldReleaseOnClose() {
  const current = useSearchParams().get("session");
  const previous = useRef(current);

  useEffect(() => {
    const before = previous.current;
    previous.current = current;

    // Mismatch releases the hold
    if (before && before !== current) {
      const holdId = loadHoldId(before);
      if (holdId) {
        clearHoldId(before);
        void releaseHold(holdId);
      }
      clearDraft(before);
    }
  }, [current]);
}