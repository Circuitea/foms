import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toProperCase(str: string) {
  return str.split(' ').map((word) => word.slice(0, 1).toUpperCase() + word.slice(1)).join(' ');
}