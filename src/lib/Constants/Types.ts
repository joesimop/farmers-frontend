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

export interface ProducerContact {
    first_name: string,
    last_name: string,
    email: string
}

export type fieldstatus = "active" | "disabled" | "error"

export type alerttype = OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;
