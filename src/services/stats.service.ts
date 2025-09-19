import { listProperties, type PropertyListResult } from "./property.service";
import { listOwners } from "./owner.service";
import type { Property } from "@/models/Property";

export type DashboardStats = {
  totalProperties: number;
  totalOwners: number;
  totalValue: number;
  newThisMonth: number;
  lastUpdatedUtc: string;
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_KEY = "dashboard_stats_v1";

function readCache(): DashboardStats | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: DashboardStats; ts: number };
    if (!parsed || !parsed.data || !parsed.ts) return null;
    const isFresh = Date.now() - parsed.ts < ONE_DAY_MS;
    return isFresh ? parsed.data : null;
  } catch {
    return null;
  }
}

function writeCache(data: DashboardStats) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // ignore quota errors
  }
}

export function clearDashboardStatsCache() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

async function fetchAllProperties(): Promise<Property[]> {
  const pageSize = 100;
  let page = 1;
  let total = Infinity;
  const all: Property[] = [];

  while (all.length < total) {
    const res: PropertyListResult = await listProperties({ page, pageSize });
    total = res.total ?? res.items.length;
    all.push(...(res.items as Property[]));
    if (res.items.length < pageSize) break;
    page += 1;
  }

  return all;
}

async function fetchAllOwners(): Promise<number> {
  const take = 200;
  let skip = 0;
  let total = 0;
  // El endpoint de Owner no devuelve total; iteramos hasta que una página venga corta
  // para contar todos los registros.
  // Nota: si el backend realmente devuelve todos sin paginación, esto hará una sola llamada.
  while (true) {
    const page = await listOwners({ skip, take });
    total += page.length;
    if (page.length < take) break;
    skip += take;
  }
  return total;
}

function countNewThisMonth(properties: Property[]): number {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  return properties.filter((p) => {
    const created = (p as any).createdAtUtc as string | undefined;
    if (!created) return false;
    const d = new Date(created);
    return d.getUTCFullYear() === y && d.getUTCMonth() === m;
  }).length;
}

function sumPropertyValues(properties: Property[]): number {
  return properties.reduce((acc, p) => acc + Number((p as any).price ?? 0), 0);
}

export async function getDashboardStats(options?: { forceRefresh?: boolean }): Promise<DashboardStats> {
  const forceRefresh = options?.forceRefresh === true;
  const cached = readCache();
  if (cached && !forceRefresh) return cached;

  try {
    // 1) Total propiedades y dataset completo para agregaciones
    const properties = await fetchAllProperties();
    const totalProperties = properties.length;

    // 2) Total propietarios (backend retorna todo el listado)
    const totalOwners = await fetchAllOwners();

    // 3) Agregaciones
    const totalValue = sumPropertyValues(properties);
    const newThisMonth = countNewThisMonth(properties);

    const data: DashboardStats = {
      totalProperties,
      totalOwners,
      totalValue,
      newThisMonth,
      lastUpdatedUtc: new Date().toISOString(),
    };

    writeCache(data);
    return data;
  } catch (err) {
    if (cached) return cached; // fallback a caché vieja si existe
    // retorno seguro vacío si no hay caché
    return {
      totalProperties: 0,
      totalOwners: 0,
      totalValue: 0,
      newThisMonth: 0,
      lastUpdatedUtc: new Date().toISOString(),
    };
  }
}


