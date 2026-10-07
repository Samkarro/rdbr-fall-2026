"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "./styles/session-pagination.styles.css";

export default function SessionPagination({ meta }: { meta: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") ?? 1);

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const getVisiblePages = () => {
    const total = meta.lastPage;
    const delta = 1;
    const pages: (number | string)[] = [];

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (meta.lastPage <= 1) return <></>;

  return (
    <div className="session-data-pagination">
      <button
        type="button"
        className="session-data-pagination-button arrow left clickable"
        disabled={currentPage <= 1}
        onClick={() => goTo(currentPage - 1)}
      >
        <img src="/pagination-arrow.svg" alt="" />
      </button>

      {visiblePages.map((p, index) => {
        const page = index + 1;

        if (p === "session-data-pagination-button") {
          return (
            <div
              key={`dots ${page}`}
              className="session-data-pagination-button"
            >
              ...
            </div>
          );
        }

        return (
          <button
            key={index + 1}
            type="button"
            className={`session-data-pagination-button clickable ${
              p === currentPage ? "active" : ""
            }`}
            onClick={() => goTo(p as number)}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        className="session-data-pagination-button arrow right clickable"
        disabled={currentPage >= meta.lastPage}
        onClick={() => goTo(currentPage + 1)}
      >
        <img src="/pagination-arrow.svg" alt="" />
      </button>
    </div>
  );
}
