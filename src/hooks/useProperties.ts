"use client";
import { useQuery } from "@tanstack/react-query";
import type { Property } from "@/models/Property";
import { listProperties, type PropertyListParams, type PropertyListResult } from "@/services/property.service";

export function useProperties(params: PropertyListParams) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  const query = useQuery<PropertyListResult>({
    queryKey: ["properties", { ...params, page, pageSize }],
    queryFn: () => listProperties({ ...params, page, pageSize }),
    staleTime: 60_000,
    keepPreviousData: true,
  });

  const result = query.data;
  const items = (result?.items ?? []) as Property[];
  const effectivePage = result?.page ?? page;
  const effectivePageSize = result?.pageSize ?? pageSize;
  const hasNext = items.length >= effectivePageSize;

  return {
    properties: items,
    total: result?.total ?? 0,
    page: effectivePage,
    pageSize: effectivePageSize,
    hasNext,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}


