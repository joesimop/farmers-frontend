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

// Interface for CreateVendor
export interface CreateVendor {
  business_name: string;
  current_cpc: string;
  cpc_expr: Date; // Using Date for DateTime
  type: VendorType;
  producer_contacts?: ProducerContact[];
}

export enum CPCStatus {
  PAST_DUE = "Past Due",
  URGENT = "Due Urgently",
  WARNING = "Due Soon",
  UP_TO_DATE = "Up to Date"
}

export const CPCStatusColors: Record<CPCStatus, string> = {
  [CPCStatus.PAST_DUE]: "text-destructive",
  [CPCStatus.URGENT]: "text-warning",
  [CPCStatus.WARNING]: "text-accent",
  [CPCStatus.UP_TO_DATE]: "text-success",
};


export type alerttype = OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;
