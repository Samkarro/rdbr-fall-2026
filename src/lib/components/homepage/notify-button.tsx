"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTimedMessage } from "@/lib/hooks/use-timed-message";
import { notifyMe } from "@/lib/api/catalog.api";
import { savePendingNotify, takePendingNotify } from "@/lib/misc/notify-draft";

export type NotifyResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

export default function NotifyButton({
  movieSlug,
  isNotified,
  isAuthed,
}: {
  movieSlug: string;
  isNotified: boolean;
  isAuthed: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, showError] = useTimedMessage(5000);

  const subscribe = async (): Promise<NotifyResult> => {
    setPending(true);
    const result = await notifyMe(movieSlug);
    setPending(false);
    if (result.ok) {
      setSubscribed(true);
      router.refresh();
    }
    return result;
  };
  console.log("isNotified", isNotified);

  // after login: finish the click the user already made
  useEffect(() => {
    if (!takePendingNotify(movieSlug)) return;

    subscribe().then((result) => {
      if (!result.ok && result.status !== 401) showError(result.message);
    });
  }, [isAuthed]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pending || subscribed) return;

    const result = await subscribe();
    if (result.ok) return;

    if (result.status === 401) {
      savePendingNotify(movieSlug); // saving draft
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
        className={`coming-soon-card-notify-button label-s clickable ${
          pending || subscribed ? "disabled" : ""
        } ${subscribed || isNotified ? "subscribed" : ""}`}
        onClick={handleClick}
        disabled={pending || subscribed}
      >
        <img src={subscribed ? "/check.svg" : "/bell.svg"} alt="" />
        {subscribed || isNotified ? "Reminder set" : "Notify Me"}
      </button>
      {errorMessage && (
        <p className="coming-soon-notify-error body-s">{errorMessage}</p>
      )}
    </>
  );
}
