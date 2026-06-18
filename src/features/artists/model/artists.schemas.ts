import { z } from "zod"

export const artistRefSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const createArtistAttributesSchema = z.object({
  name: z.string().min(2).max(30),
})

export const createArtistDataSchema = z.object({
  type: z.literal("artists"),
  attributes: createArtistAttributesSchema,
})

export const createArtistRequestPayloadSchema = z.object({
  data: createArtistDataSchema,
})

export type ArtistRef = z.infer<typeof artistRefSchema>
