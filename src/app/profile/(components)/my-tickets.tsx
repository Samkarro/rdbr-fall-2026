"use client";
import { getMyTickets } from "@/lib/api/booking.api";
import { Order } from "@/lib/api/types/booking.types";
import { useEffect, useState } from "react";
import "./styles/my-tickets.styles.css";

export default function MyTickets() {
  const [activeTimeframe, setActiveTimeframe] = useState<"upcoming" | "past">(
    "upcoming",
  );
  const [upcoming, setUpcoming] = useState<Order[]>([]);
  const [past, setPast] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchTickets() {
      const [upcomingTickets, pastTickets] = await Promise.all([
        getMyTickets("upcoming"),
        getMyTickets("past"),
      ]);

      setUpcoming(upcomingTickets ?? []);
      setPast(pastTickets ?? []);
    }

    fetchTickets();
  }, []);

  return (
    <div className="my-tickets-section-container">
      <div className="my-tickets-timeframe-selector">
        <button
          className={`my-tickets-timeframe-button label-m clickable ${activeTimeframe === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTimeframe("upcoming")}
        >
          Upcoming {upcoming.length}
        </button>
        <button
          className={`my-tickets-timeframe-button label-m clickable ${activeTimeframe === "past" ? "active" : ""}`}
          onClick={() => setActiveTimeframe("past")}
        >
          Past {past.length}
        </button>
      </div>
    </div>
  );
}
