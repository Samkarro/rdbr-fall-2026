import z from "zod";
import { formatSchema, movieSchema } from "./movie.types";

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

export const languageSchema = z.object({
  id: z.int(),
  slug: z.string(),
  name: z.string(),
  code: z.string(),
});

export const hallSchema = z.object({
  id: z.int(),
  name: z.string(),
});

export const sessionSchema = z.object({
  id: z.int(),
  startsAt: z.iso.datetime({ offset: true }),
  date: z.iso.date(),
  time: z.string(),
  timeBand: z.enum(["morning", "afternoon", "evening"]),
  price: z.number(),
  seatsLeft: z.int().nonnegative(),
  isSoldOut: z.boolean(),
  hall: hallSchema,
  venue: venueSchema,
  format: formatSchema,
  language: languageSchema,
  movie: movieSchema,
});

export const orderSessionSchema = z.object({
  id: z.int(),
  startsAt: z.iso.datetime({ offset: true }),
  date: z.string(),
  time: z.string(),
  price: z.number(),
  hall: z.object({ id: z.int(), name: z.string() }),
  venue: z.object({
    id: z.int(),
    slug: z.string(),
    name: z.string(),
    city: z.string(),
  }),
  format: z.object({ id: z.int(), slug: z.string(), name: z.string() }),
  language: z.object({
    id: z.int(),
    slug: z.string(),
    name: z.string(),
    code: z.string(),
  }),
  movie: z.object({
    id: z.int(),
    slug: z.string(),
    title: z.string(),
    runtimeMinutes: z.number(),
    posterUrl: z.string().nullable(),
    ageRating: z.object({ code: z.string(), minAge: z.number() }),
  }),
});

export type TimeBand = z.infer<typeof timeBandSchema>;
export type Venue = z.infer<typeof venueSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Hall = z.infer<typeof hallSchema>;
export type Session = z.infer<typeof sessionSchema>;