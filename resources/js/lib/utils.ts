import { usePage } from "@inertiajs/react";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Personnel } from "@/types";

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

export function formatName(personnel: Personnel): string {
  const { first_name, middle_name, surname, name_extension } = personnel;
  
  const nameParts = [
    toProperCase(first_name),
    middle_name ? `${toProperCase(middle_name)[0]}.` : null,
    toProperCase(surname),
    name_extension ? name_extension.toUpperCase() : null
  ];

  return nameParts.filter(Boolean).join(' ');
}

export function getMonthName(monthNumber: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return months[monthNumber - 1] ?? "";
}
