import { usePage } from "@inertiajs/react";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toProperCase(str: string) {
  return str.split(' ').map((word) => word.slice(0, 1).toUpperCase() + word.slice(1)).join(' ');
}

export function userHasPermission(permissionCheck: RegExp): boolean {
  const permissions = usePage().props.auth.permissions;

  return permissions.reduce((hasPermission, permission) => {
    return hasPermission || permissionCheck.test(permission);
  }, false);
}

export function getOrdinalSuffix(n: number) {
  const suffix = ["th", "st", "nd", "rd"];
  const lastTwoDigits = n % 100;
  return n + (suffix[(lastTwoDigits - 20) % 10] || suffix[lastTwoDigits] || suffix[0]);
}