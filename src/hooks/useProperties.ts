"use client";
import { useQuery } from "@tanstack/react-query";
import type { Property } from "@/models/Property";
import { listProperties, type PropertyListParams, type PropertyListResult } from "@/services/property.service";

export function useProperties(params: PropertyListParams) {
  const query = useQuery<PropertyListResult>({
    queryKey: ["properties", params],
    queryFn: () => listProperties(params),
    staleTime: 60_000,
    keepPreviousData: true,
  });

  return {
    properties: (query.data?.items ?? []) as Property[],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? (params.page ?? 1),
    pageSize: query.data?.pageSize ?? (params.pageSize ?? 10),
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}


