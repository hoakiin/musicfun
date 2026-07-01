import { z } from "zod";

export const trackFormSchema = z.object({
  title: z.string().min(3, "Minimum 3 characters"),
  description: z.string().max(1000).optional(),
  playlistId: z.string().min(1, "Select a playlist"),
});

export type TrackFormValues = z.infer<typeof trackFormSchema>;
