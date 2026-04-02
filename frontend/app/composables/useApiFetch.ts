import type { UseFetchOptions } from 'nuxt/app'

/**
 * useApiFetch - Wrapper around useFetch specifically for our API.
 * Uses the intercepted $api instance for all network calls to ensure
 * consistency (Authorization header, 401 Logout handling, etc).
 */
export function useApiFetch<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
  const { $api } = useNuxtApp()
  
  return useFetch(url, {
    ...options,
    $fetch: $api as any,
  })
}
