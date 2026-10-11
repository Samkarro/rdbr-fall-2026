// Path: (components)/checkout-summary.tsx
import type { SelectedTicket } from "@/lib/api/types/booking.types";
import { capitalize, formatTicketCounts } from "@/lib/misc/ticket-pricing";
import SubtotalBar from "./subtotal-bar";
import { Session } from "@/lib/api/types/sessions.types";
import { formatSessionDateShort } from "@/lib/utils/dates";

export default function CheckoutSummary({
  movieTitle,
  session,
  selectedTickets,
  subtotal,
  isSubmitting,
}: {
  movieTitle: string;
  session: Session;
  selectedTickets: SelectedTicket[];
  subtotal: number;
  isSubmitting: boolean;
}) {
  return (
    <div className="payment-left-container">
      <div className="summary-container">
        <div>
          <p className="summary-heading">Summary</p>
          <div className="summary-card">
            <div className="summary-card-header">
              <p className="summary-card-header-heading">{movieTitle}</p>
              <p className="summary-card-header-sub body-s">
                Hall {session.hall.name} ·{" "}
                {formatSessionDateShort(session.date)} · {session.time}
              </p>
            </div>
            <hr />

            <div className="summary-card-info-container">
              <p className="summary-card-info-label body-s">Seats</p>
              <p className="summary-card-info body-s">
                {selectedTickets.map(({ seat }) => seat.code).join(", ")}
              </p>
            </div>
            <div className="summary-card-info-container">
              <p className="summary-card-info-label body-s">Tickets</p>
              <p className="summary-card-info ticket-type-info body-s">
                {formatTicketCounts(
                  selectedTickets.map(({ type }) => capitalize(type)),
                )}
              </p>
            </div>
          </div>
        </div>

        <SubtotalBar subtotal={subtotal}>
          <button
            type="submit"
            form="checkout-form"
            className={`custom-button-large red-button clickable ${isSubmitting ? "disabled" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing…" : "Pay: Complete order"}
          </button>
        </SubtotalBar>
      </div>
    </div>
  );
}
