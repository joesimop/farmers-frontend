import { CPCStatus } from "@lib/Constants/Types";
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

export const calculateCPCStatus = (givenDate: Date): { status: CPCStatus; daysLeft: number } => {
  const today = new Date();
  const targetDate = new Date(givenDate);
  const daysLeft = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { status: "Past Due", daysLeft };
  if (daysLeft <= 14) return { status: "Due Urgently", daysLeft };
  if (daysLeft <= 30) return { status: "Due Soon", daysLeft };
  return { status: "Up to Date", daysLeft };
};