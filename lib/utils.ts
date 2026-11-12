import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { environment } from "./environment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLKR(amount: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("LKR", "Rs.");
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatAmount(num: number, decimals: number = 2): string {
  const val = Number(num || 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function getImageUrl(path?: string | null, fallback: string = "/placeholder.png"): string {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.replace(/^\//, '');
  const baseUrl = environment.IMAGE_BASE_URL || environment.aws || 'https://storage.googleapis.com/oneticket';
  return `${baseUrl}/${cleanPath}`;
}
