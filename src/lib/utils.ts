import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// CSS کلاسز کو merge کرنے کے لیے
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// URL-friendly slug بنانے کے لیے
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF\-]+/g, "") // Urdu support
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// تاریخ کو خوبصورت فارمیٹ میں (English)
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

// تاریخ کو اردو میں
export function formatDateUrdu(date: Date | string): string {
  return new Intl.DateTimeFormat("ur-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

// تاریخ کو مختصر فارمیٹ میں
export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

// وقت کے ساتھ تاریخ
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// Relative وقت (e.g., "2 hours ago", "3 days ago")
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffWeek < 4) return `${diffWeek} weeks ago`;
  if (diffMonth < 12) return `${diffMonth} months ago`;
  return `${diffYear} years ago`;
}

// ٹیکسٹ کو مختصر کرنا
export function truncate(text: string, length: number): string {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

// الفاظ کی تعداد کے حساب سے truncate
export function truncateWords(text: string, words: number): string {
  if (!text) return "";
  const wordArray = text.trim().split(/\s+/);
  if (wordArray.length <= words) return text;
  return wordArray.slice(0, words).join(" ") + "...";
}

// ریڈنگ ٹائم کیلکولیٹ کرنا
export function readingTime(text: string): number {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// نمبر کو خوبصورت فارمیٹ میں (e.g., 1.2K, 3.4M)
export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// فون نمبر کو خوبصورت فارمیٹ میں
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

// پہلا لفظ capital
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ہر لفظ کا پہلا حرف capital
export function capitalizeWords(str: string): string {
  if (!str) return "";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

// رینڈم سٹرنگ جنریٹر (ID کے لیے)
export function generateId(length = 12): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// URL سے پیرامیٹر حاصل کرنا
export function getUrlParam(param: string): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

// JSON کو safely parse کرنا
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Array کو chunks میں تقسیم کرنا
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Delay function
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// کلپ بورڈ میں کاپی کرنا
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ای میل ویلڈیشن
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// پاکستانی فون نمبر ویلڈیشن
export function isValidPakPhone(phone: string): boolean {
  const regex = /^(\+92|0)?3\d{2}\d{7}$/;
  return regex.test(phone.replace(/\s|-/g, ""));
}

// فائل سائز کو human readable بنانا
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Greeting message
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}