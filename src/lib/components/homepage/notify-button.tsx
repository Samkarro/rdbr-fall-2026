"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTimedMessage } from "@/lib/hooks/use-timed-message";
import { notifyMe } from "@/lib/api/catalog.api";

export type NotifyResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

export default function NotifyButton({ movieSlug }: { movieSlug: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, showError] = useTimedMessage(5000);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pending) return;

    setPending(true);
    const result = await notifyMe(movieSlug);
    setPending(false);

    if (result.ok) {
      setSubscribed(true);
      return;
    }

    if (result.status === 401) {
      const params = new URLSearchParams(window.location.search);
      params.set("auth", "true");
      router.replace(`${window.location.pathname}?${params.toString()}`, {
        scroll: false,
      });
      return;
    }

    showError(result.message);
  };

  return (
    <>
      <button
        type="button"
        className={`coming-soon-card-notify-button label-s clickable ${pending || subscribed ? "disabled" : ""} ${subscribed && "subscribed"}`}
        onClick={handleClick}
        disabled={pending || subscribed}
      >
        {subscribed ? <img src="/check.svg" /> : <img src="/bell.svg" alt="" />}
        {subscribed ? "Reminder set" : "Notify Me"}
      </button>
      {errorMessage && (
        <p className="coming-soon-notify-error body-s">{errorMessage}</p>
      )}
    </>
  );
}
