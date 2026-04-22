import { baseApi } from "@/app/api/baseApi";
import type { LoginArgs, LoginResponse, MeResponse } from "./authApi.types";
import { AUTH_KEYS } from "@/common/constants";
import { withZodCatch } from "@/common/utils";
import { loginResponseSchema, meResponseSchema } from "../model/auth.schemas";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
      providesTags: ["Auth"],
      ...withZodCatch(meResponseSchema),
    }),
    login: build.mutation<LoginResponse, LoginArgs>({
      query: (payload) => ({
        url: `auth/login`,
        method: "post",
        body: { ...payload, accessTokenTTL: "3m" },
      }),
      ...withZodCatch(loginResponseSchema),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken);
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken);

        dispatch(authApi.util.invalidateTags(["Auth"]));
      },
    }),
    logout: build.mutation<void, void>({
      query: () => {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken);
        return { url: "auth/logout", method: "post", body: { refreshToken } };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        await queryFulfilled;
        localStorage.removeItem(AUTH_KEYS.accessToken);
        localStorage.removeItem(AUTH_KEYS.refreshToken);
        dispatch(baseApi.util.resetApiState());
      },
    }),
  }),
});

export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi;
