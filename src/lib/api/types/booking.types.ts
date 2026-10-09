import { z } from "zod";
import { sessionSchema, venueSchema } from "./sessions.types";

// Order ticket types
export const orderTicketSchema = z.object({
  id: z.int(),
  seatCode: z.string(),
  ticketType: z.object({
    slug: z.string(),
    name: z.string(),
  }),
  price: z.number(),
});

export const orderSchema = z.object({
  id: z.int(),
  reference: z.string(),
  status: z.enum(["paid", "refunded"]),
  totalPrice: z.number(),
  paidAt: z.iso.datetime({ offset: true }),
  refundedAt: z.iso.datetime({ offset: true }).nullable(),
  isUpcoming: z.boolean(),
  isRefundable: z.boolean(),
  cardLastFour: z.string(),
  contact: z.object({
    fullName: z.string(),
    email: z.email(),
    mobileNumber: z.string(),
  }),
  session: sessionSchema,
  tickets: z.array(orderTicketSchema),
});

//  Seat map types
export const seatStateSchema = z.enum(["available", "sold", "held", "unavailable"]);

export const seatSchema = z.object({
  id: z.int(),
  code: z.string(),
  label: z.string(),
  state: seatStateSchema,
  aisleAfter: z.boolean(),
  isMine: z.boolean(),
});

export const seatRowSchema = z.object({
  label: z.string(),
  seats: z.array(seatSchema),
});

export const seatSectionSchema = z.object({
  name: z.string(),
  rows: z.array(seatRowSchema),
});

export const seatMapSchema = z.object({
  sessionId: z.int(),
  hall: z.object({
    id: z.int(),
    name: z.string(),
    venue: venueSchema,
  }),
  sections: z.array(seatSectionSchema),
});

export type Order = z.infer<typeof orderSchema>;
export type OrderTicket = z.infer<typeof orderTicketSchema>;

export type SeatState = z.infer<typeof seatStateSchema>;
export type Seat = z.infer<typeof seatSchema>;
export type SeatRow = z.infer<typeof seatRowSchema>;
export type SeatSection = z.infer<typeof seatSectionSchema>;
export type SeatMap = z.infer<typeof seatMapSchema>;

