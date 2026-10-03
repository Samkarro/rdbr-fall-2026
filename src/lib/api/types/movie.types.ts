import { z } from "zod";

export const genreSchema = z.object({
  id: z.int(),
  slug: z.string(),
  name: z.string(),
});

export const formatSchema = z.object({
  id: z.int(),
  slug: z.string(),
  name: z.string(),
  priceUplift: z.number(),
});

export const ageRatingSchema = z.object({
  code: z.string(),
  minAge: z.int().nonnegative(),
  description: z.string(),
});

export const movieSchema = z.object({
  id: z.int(),
  slug: z.string(),
  title: z.string(),
  kind: z.enum(["film", "event"]),
  runtimeMinutes: z.int().nonnegative(),
  posterUrl: z.url().nullable(),
  backdropUrl: z.url().nullable(),
  releaseDate: z.iso.date(),
  isComingSoon: z.boolean(),
  isFeatured: z.boolean(),
  fromPrice: z.number(),
  ageRating: ageRatingSchema,
  genres: z.array(genreSchema),
  formats: z.array(formatSchema),
});

export const movieDetailSchema = movieSchema.extend({
  synopsis: z.string(),
  director: z.string().nullable(),
  cast: z.string().nullable(),
  availableDates: z.array(z.iso.date()),
});

export type Genre = z.infer<typeof genreSchema>;
export type MovieFormat = z.infer<typeof formatSchema>;
export type AgeRating = z.infer<typeof ageRatingSchema>;
export type Movie = z.infer<typeof movieSchema>;
export type MovieDetail = z.infer<typeof movieDetailSchema>;
