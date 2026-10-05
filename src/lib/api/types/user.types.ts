import { z } from "zod";
import { formatSchema } from "./movie.types";

export const userSchema = z.object({
  id: z.int(),
  username: z.string(),
  email: z.email(),
  avatar: z.url().nullable(),
  fullName: z.string().nullable(),
  mobileNumber: z.string().nullable(),
  dateOfBirth: z.iso.date().nullable(),
  age: z.int().nullable(),
  preferredVenue: z
    .object({
      id: z.int(),
      slug: z.string(),
      name: z.string(),
      city: z.string(),
      formats: z.array(formatSchema),
    })
    .nullable(),
  profileComplete: z.boolean(),
});

export type User = z.infer<typeof userSchema>;