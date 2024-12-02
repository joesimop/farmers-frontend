import { formatDate } from "date-fns";

// Utility type to check if T is an array type
export function isEmptyList<T>(data: T): boolean {
    return Array.isArray(data) && data.length === 0;
  }

export const toReadableString = (str: string): string => 
  str
    .replace(/_/g, " ")                        // Replace all underscores with spaces
    .toLowerCase()     
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize the first letter of each word


export const toReadableDate = (date: Date | string): string => {
  return formatDate(date, "MM-dd-yyy")
}