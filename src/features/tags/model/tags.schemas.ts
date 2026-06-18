import { z } from "zod"

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const searchTagsResponseSchema = z.object({
  data: z.array(tagSchema),
  totalCount: z.number(),
})

export type Tag = z.infer<typeof tagSchema>
export type SearchTagsResponse = z.infer<typeof searchTagsResponseSchema>
