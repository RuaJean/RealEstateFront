"use client";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, type DashboardStats } from "@/services/stats.service";

export function useDashboardStats() {
  const query = useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: () => getDashboardStats(),
    staleTime: 24 * 60 * 60 * 1000, // 24h
    gcTime: 24 * 60 * 60 * 1000, // mantener en caché 24h
    refetchOnWindowFocus: false,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as Error) ?? null,
    refetch: query.refetch,
  };
}


