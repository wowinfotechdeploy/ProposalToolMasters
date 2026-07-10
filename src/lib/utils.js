import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const PLATFORMS = {
  XERO: "Xero",
  QUICKBOOKS: "QuickBooks",
};

export const getActivePlatform = () => {
  try {
    const data = JSON.parse(localStorage.getItem("persist:Bookkeeping"));
    const bookkeeping = JSON.parse(data?.bookkeeping || "{}");

    if (bookkeeping?.Xero) return PLATFORMS.XERO;
    if (bookkeeping?.QuickBooks) return PLATFORMS.QUICKBOOKS;

    return null;
  } catch (err) {
    console.error("Error reading platform from localStorage", err);
    return null;
  }
};
