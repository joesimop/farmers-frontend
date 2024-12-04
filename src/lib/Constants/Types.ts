import { AlertColor, AlertPropsColorOverrides } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';

export enum VendorType {
    PRODUCER = "PRODUCER",
    NON_PRODUCER = "NON_PRODUCER",
    ANCILLARY = "ANCILLARY"
}

export enum FeeType {
    PERCENT_GROSS = "PERCENT_GROSS",
    FLAT_FEE = "FLAT_FEE",
    FLAT_PERCENT_COMBO = "FLAT_PERCENT_COMBO",
    MAX_OF_EITHER = "MAX_OF_EITHER",
    GOV_FEE = "GOV_FEE"
}

export enum TokenType {
  EBT = "EBT",
  MARKET_MATCH = "MARKET_MATCH",
  ATM = "ATM"
}

export interface ProducerContact {
    first_name: string,
    last_name: string,
    email: string
}

export enum FieldState {
    PRISTINE,
    VALID,
    INVALILD,
}

// Interface for CreateVendor
export interface CreateVendor {
  business_name: string;
  current_cpc: string;
  cpc_expr: Date; // Using Date for DateTime
  type: VendorType;
  producer_contacts?: ProducerContact[];
}

//NOTE: T is a value, null is empty, and undefined is untouched
export type FieldValue<T> = T | null | undefined

// Check if the field value has been modified (not untouched)
export const isModified = <T>(value: FieldValue<T>): value is T | null => {
  return value !== undefined;
};

// Check if the field has a value (not empty or untouched)
export const hasValue = <T>(value: FieldValue<T>): value is T => {
  return value !== null && value !== undefined;
};

// Check if the field is empty (null, but not untouched)
export const isEmpty = <T>(value: FieldValue<T>): value is null => {
  return value === null;
};

export type ErrorState = string | null;

export function isFieldValid(error: ErrorState): boolean{
    return !error;
}

export type fieldstatus = "active" | "disabled" | "error"

export type CPCStatus = "Past Due" | "Due Urgently" | "Due Soon" | "Up to Date"
export const CPCStatusColors: Record<CPCStatus, string> = {
  "Past Due": "text-destructive",
  "Due Urgently": "text-destructive",
  "Due Soon": "text-warning",
  "Up to Date": "text-primary",
};


export type alerttype = OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;
