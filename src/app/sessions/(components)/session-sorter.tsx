"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "../styles/sessions.styles.css";
import "./styles/session-sorter.styles.css";

export default function SessionSorter({
  sorts,
  meta,
}: {
  sorts: { id: string; label: string }[];
  meta: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedId = searchParams.get("sort") ?? "time_asc";
  const selected = sorts.find((s) => s.id === selectedId) ?? sorts[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", id);
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: true });
    setIsOpen(false);
  };

  return (
    <div className="session-sorter-heading">
      <p className="session-amt label-m">
        Showing {meta.totalSessions} sessions
      </p>
      <div className="session-sorting-selector-container" ref={containerRef}>
        <span className="body-m session-sorting-label">Sort:</span>

        <button
          type="button"
          className="session-sorting-trigger clickable label-m"
          onClick={() => setIsOpen((o) => !o)}
        >
          {selected?.label}
          <img
            className={isOpen ? "open" : ""}
            src="/dropdown-arrow.svg"
            alt=""
          />
        </button>
        {isOpen && (
          <ul className="session-sorting-menu">
            {sorts.map((sort) => (
              <li
                key={sort.id}
                className={`session-sorting-option clickable label-m ${
                  sort.id === selectedId ? "selected" : ""
                }`}
                onClick={() => choose(sort.id)}
              >
                {sort.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
