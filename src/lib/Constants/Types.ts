import { AlertColor, AlertPropsColorOverrides } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';

export type vendortype = "PRODUCER" | "NON_PRODUCER" | "ANCILLARY";
export type feetype = "PERCENT_GROSS" | "FLAT_FEE" | "FLAT_PERCENT_COMBO" | "MAX_OF_EITHER" | "GOV_FEE";
export type fieldstatus = "active" | "disabled" | "error"

export type alerttype = OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;
