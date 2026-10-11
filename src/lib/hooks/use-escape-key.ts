"use client";

import { useEffect, useRef } from "react";

const stack: { current: () => void }[] = [];

export function useEscapeKey(onEscape: () => void, enabled = true) {
  const handler = useRef(onEscape);
  useEffect(() => {
    handler.current = onEscape;
  });

  useEffect(() => {
    if (!enabled) return;

    const entry = handler;
    stack.push(entry);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stack[stack.length - 1] === entry) entry.current();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      stack.splice(stack.indexOf(entry), 1);
    };
  }, [enabled]);
}