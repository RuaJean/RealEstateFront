export function formatCurrency(amount: number, currency: string = "USD", locale: string = "es-CO"): string {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount || 0);
  } catch {
    return `$${Math.round(amount || 0).toLocaleString(locale)}`;
  }
}

export function formatNumberCompact(value: number, locale: string = "es"): string {
  try {
    return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
  } catch {
    return String(value || 0);
  }
}

