"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "./styles/booking-modal.styles.css";
import { useScrollBlock } from "@/lib/hooks/use-scroll-block";
import { useEscapeKey } from "@/lib/hooks/use-escape-key";
export default function ModalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("session");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  useScrollBlock();
  useEscapeKey(close, searchParams.get("auth") !== "true");

  return (
    <div
      className="booking-modal-overlay"
      onClick={close}
      onScroll={(e) => e.stopPropagation()}
    >
      <div
        className="booking-modal-container"
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
