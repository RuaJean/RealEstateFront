"use client";
import { useQuery } from "@tanstack/react-query";
import type { Owner } from "@/models/Owner";
import { listOwners } from "@/services/owner.service";

export type OwnerListParams = {
  name?: string;
  page?: number;
  pageSize?: number;
};

export function useOwners(params: OwnerListParams) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const query = useQuery<{ items: Owner[]; hasNext: boolean; page: number; pageSize: number } | undefined>({
    queryKey: ["owners", { name: params.name ?? "", page, pageSize }],
    queryFn: async () => {
      const items = await listOwners({ name: params.name, skip, take });
      const hasNext = items.length >= pageSize; // heurística sin total
      return { items, hasNext, page, pageSize };
    },
    staleTime: 30_000,
    keepPreviousData: true,
  });

  return {
    owners: query.data?.items ?? [],
    page: query.data?.page ?? page,
    pageSize: query.data?.pageSize ?? pageSize,
    hasNext: query.data?.hasNext ?? false,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as Error) ?? null,
    refetch: query.refetch,
  };
}


