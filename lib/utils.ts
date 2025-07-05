import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export function formatMoneyText(amount: number): string {
  if (!amount) return ""
  
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)} tỷ`
  }
  
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} triệu`
  }
  
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)} nghìn`
  }
  
  return amount.toString()
}
