import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime(); // Milisaniye farkı
  const diffInSec = Math.floor(diffInMs / 1000); // Saniye farkı

  if (diffInSec < 60) {
    return `${diffInSec} seconds ago`;
  } else if (diffInSec < 3600) {
    const minutes = Math.floor(diffInSec / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSec < 86400) {
    const hours = Math.floor(diffInSec / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSec / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);
