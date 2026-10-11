"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProfileNav({ ticketAmt }: { ticketAmt: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedPage = searchParams.get("page");
  const isMyTickets = selectedPage === "my-tickets";

  return (
    <div className="profile-nav">
      <button
        className={`profile-nav-button clickable label-m ${
          !isMyTickets ? "active" : ""
        }`}
        onClick={() => router.push("/profile?page=personal-information")}
      >
        Personal Information
        <div className="profile-nav-highlight"></div>
      </button>

      <button
        className={`profile-nav-button clickable label-m ${
          isMyTickets ? "active" : ""
        }`}
        onClick={() => router.push("/profile?page=my-tickets")}
      >
        <div className="profile-nav-my-tickets-button-container">
          My Tickets
          {ticketAmt > 0 && (
            <div className="ticket-amt-label label-s">{ticketAmt}</div>
          )}
        </div>
        <div className="profile-nav-highlight"></div>
      </button>
    </div>
  );
}
