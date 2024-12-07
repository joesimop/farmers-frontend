import { CPCStatus } from "@lib/Constants/Types";
import { format, formatDate } from "date-fns";

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
  const dateObject = date instanceof Date ? date : new Date(date);
  const dateOnly = new Date(dateObject.valueOf() + dateObject.getTimezoneOffset() * 60 * 1000);
  return formatDate(dateOnly, "MM-dd-yyyy");
};


export const toISOStringForSending = (date: Date | string): string =>{
  const dateString = date instanceof Date ? date.toISOString() : date
  return dateString.split('T')[0];
}

export const calculateCPCStatus = (givenDate: Date): { status: CPCStatus; daysLeft: number } => {
  const today = new Date();
  const targetDate = new Date(givenDate);
  const daysLeft = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { status: CPCStatus.PAST_DUE, daysLeft };
  if (daysLeft <= 14) return { status: CPCStatus.URGENT, daysLeft };
  if (daysLeft <= 30) return { status: CPCStatus.WARNING, daysLeft };
  return { status: CPCStatus.UP_TO_DATE, daysLeft };
};