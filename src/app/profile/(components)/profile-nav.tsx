"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProfileNav() {
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
        My Tickets
        <div className="profile-nav-highlight"></div>
      </button>
    </div>
  );
}
