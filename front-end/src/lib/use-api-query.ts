'use client'

import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query'
import { api } from './api-client'

type ApiResponse<T> = { data: T; message?: string }
type ApiPaginated<T> = { data: { data: T[]; last_page: number; current_page: number; total: number } }

export function useApiQuery<T>(
  key: unknown[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> & { params?: Record<string, string> }
) {
  const params = options?.params
  const url = params
    ? endpoint + '?' + new URLSearchParams(params).toString()
    : endpoint

  return useQuery<T>({
    queryKey: key,
    queryFn: () => api.get<T>(url),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    ...options,
  })
}

export function useApiMutation<TData, TResponse = void>(
  endpoint: string,
  method: 'post' | 'put' | 'delete' = 'post',
  options?: Omit<UseMutationOptions<TResponse, Error, TData>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation<TResponse, Error, TData>({
    mutationFn: (data) =>
      api[method]<TResponse>(endpoint, data as any) as Promise<TResponse>,
    ...options,
  })
}
