"use client";
import "@/lib/components/styles/sessions.styles.css";

export default function SessionSorter({
  sorts,
  meta,
}: {
  sorts: any;
  meta: any;
}) {
  return (
    <div className="session-sorter-heading">
      <p className="session-amt label-m">
        Showing {meta.totalSessions} sessions
      </p>
      <div className="session-sorting-selector-container">
        <label className="body-m" htmlFor="session-sorting-selector">
          Sort:
        </label>
        <select name="session-sorting-selector">
          {sorts.map((sortOption: { id: string; label: string }) => {
            return <option value={sortOption.id}>{sortOption.label}</option>;
          })}
        </select>
        <img className="" src="/dropdown-arrow.svg" alt="" />
      </div>
    </div>
  );
}
