import { useEffect, useRef, useState } from "react";

export function formatCountdown(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function useHoldCountdown(expiresAt: string | null, onExpire: () => void) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (!expiresAt) {
      setSecondsLeft(null);
      return;
    }

    const deadline = new Date(expiresAt).getTime();
    let fired = false;

    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0 && !fired) {
        fired = true;
        clearInterval(id);
        onExpireRef.current();
      }
    };

    const id = setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    tick();

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [expiresAt]);

  return secondsLeft;
}