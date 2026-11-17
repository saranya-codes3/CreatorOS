import type { CurrencyCode } from '../types/creatorOs';

const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; rateFromInr: number; locale: string }> = {
  INR: { symbol: '₹', rateFromInr: 1, locale: 'en-IN' },
  USD: { symbol: '$', rateFromInr: 0.012, locale: 'en-US' },
  EUR: { symbol: '€', rateFromInr: 0.011, locale: 'de-DE' },
  GBP: { symbol: '£', rateFromInr: 0.0095, locale: 'en-GB' },
};

export function formatCurrency(amountInInr: number, currency: CurrencyCode = 'INR'): string {
  const cfg = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  const converted = Math.round(amountInInr * cfg.rateFromInr);
  const absFormatted = Math.abs(converted).toLocaleString(cfg.locale);
  return `${converted < 0 ? '-' : ''}${cfg.symbol}${absFormatted}`;
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString('en-IN');
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatPct(val: number | null, showPlus = true): string {
  if (val === null || Number.isNaN(val)) return '—';
  const rounded = Math.round(val * 10) / 10;
  return `${showPlus && rounded > 0 ? '+' : ''}${rounded}%`;
}

export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number>>): void {
  const escapeCell = (cell: string | number) => {
    const str = String(cell ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csvContent = [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
