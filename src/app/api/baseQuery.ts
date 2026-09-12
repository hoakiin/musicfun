import { AUTH_KEYS } from '@/common/constants'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
 
export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  headers: {
    ...(import.meta.env.VITE_API_KEY ? { 'API-KEY': import.meta.env.VITE_API_KEY } : {}),
  },
  prepareHeaders: headers => {
    const accessToken = localStorage.getItem(AUTH_KEYS.accessToken)
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
    return headers
  },
})