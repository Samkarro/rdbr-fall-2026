import z from "zod";
import { formatSchema } from "./movie.types";

export const venueSchema = z.object({
  id: z.int(),
  slug: z.string(),
  name: z.string(),
  city: z.string(),
  formats: z.array(formatSchema),
});

export type Venue = z.infer<typeof venueSchema>;