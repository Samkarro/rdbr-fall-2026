import z from "zod";
import { formatSchema } from "./movie.types";

export const venueSchema = z.object({
  id: z.int(),
  slug: z.string(),
  name: z.string(),
  city: z.string(),
  formats: z.array(formatSchema),
});

export const timeBandSchema = z.object({
  id: z.int(),
  label: z.string()
});

export type TimeBand = z.infer<typeof timeBandSchema>;
export type Venue = z.infer<typeof venueSchema>;