import { z } from "zod";
import { sessionSchema } from "./sessions.types";

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

export type Order = z.infer<typeof orderSchema>;
export type OrderTicket = z.infer<typeof orderTicketSchema>;