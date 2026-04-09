import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Strip HTML tags and dangerous characters from user input to prevent XSS.
 * Use on plain-text fields (names, phone numbers, addresses, etc.).
 * Do NOT use on rich-text / HTML content fields — those should use DOMPurify.
 */
export function sanitizeInput(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')          // strip HTML tags
    .replace(/[<>"'`]/g, '')          // remove dangerous chars
    .replace(/javascript:/gi, '')     // strip JS protocol
    .replace(/on\w+\s*=/gi, '')       // strip inline event handlers
    .trim();
}
