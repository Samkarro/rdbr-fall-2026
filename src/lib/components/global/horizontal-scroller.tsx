"use client";

import { useEffect, useRef } from "react";

export default function HorizontalScroller({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const SPEED = 2;
  const EASE = 0.9;

  useEffect(() => {
    const el = ref.current!;
    let target = el.scrollLeft;
    let raf = 0;

    const animate = () => {
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) < 1) {
        el.scrollLeft = target;
        raf = 0;
        return;
      }
      const step = diff * EASE;
      el.scrollLeft += Math.abs(step) < 1 ? Math.sign(diff) : step;
      raf = requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();

      if (!raf) target = el.scrollLeft;
      const max = el.scrollWidth - el.clientWidth;
      target = Math.max(0, Math.min(max, target + e.deltaY * SPEED));

      if (!raf) raf = requestAnimationFrame(animate);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className={`scroll-x ${className}`}>
      {children}
    </div>
  );
}
