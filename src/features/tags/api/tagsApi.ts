import { baseApi } from "@/app/api/baseApi";
import type {
  CreateTagRequestPayload,
  CreateTagResponse,
  SearchTagsParams,
  SearchTagsResponse,
  Tag,
} from "./tagsApi.types";

export const tagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchTags: builder.query<Tag[], SearchTagsParams>({
      query: ({ search }) => ({
        url: "/tags/search",
        params: { search },
      }),

      transformResponse: (response: SearchTagsResponse) => {
        return response.data.map((tag) => ({
          id: tag.id,
          name: tag.attributes.name,
        }));
      },
    }),
    createTag: builder.mutation<CreateTagResponse, CreateTagRequestPayload>({
      query: (body) => ({
        method: "post",
        url: "tags",
        body,
      }),
    }),
  }),
});

export const { useSearchTagsQuery, useCreateTagMutation } = tagsApi;