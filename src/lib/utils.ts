import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toString();
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function getDecisionColor(decision: 'BUY' | 'SELL' | 'HOLD'): string {
  switch (decision) {
    case 'BUY':
      return 'text-[#0E7E48] bg-[#0E7E48]/10 border-[#0E7E48]/25';
    case 'SELL':
      return 'text-[#B42318] bg-[#B42318]/10 border-[#B42318]/25';
    case 'HOLD':
      return 'text-[#6F6E69] bg-[#F1F0EA] border-[#E7E5DE]';
    default:
      return 'text-[#6F6E69] bg-[#F1F0EA] border-[#E7E5DE]';
  }
}

export function getRiskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case 'low':
      return 'text-[#0E7E48] bg-[#0E7E48]/10 border border-[#0E7E48]/25';
    case 'medium':
      return 'text-[#8A6A00] bg-[#8A6A00]/10 border border-[#8A6A00]/25';
    case 'high':
      return 'text-[#B42318] bg-[#B42318]/10 border border-[#B42318]/25';
    default:
      return 'text-[#6F6E69] bg-[#F1F0EA] border border-[#E7E5DE]';
  }
}
