import * as React from "react";
import { Badge } from "@ShadcnComponents/ui/badge";
import { cn } from "@lib/utils";
import { toReadableString } from "Helpers";
import { VendorType } from "@lib/Constants/Types";


export interface MSMVendorBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    vendorType: VendorType | undefined;
}

const vendorColors: Record<VendorType, string> = {
    [VendorType.PRODUCER]: "bg-purple-700 text-white",
    [VendorType.NON_PRODUCER]: "bg-blue-700 text-white",
    [VendorType.ANCILLARY]: "bg-red-700 text-white",
};

function MSMVendorBadge({ vendorType, className, ...props }: MSMVendorBadgeProps) {


    const vendorClass = vendorColors[vendorType ?? VendorType.PRODUCER];

    return vendorType ? (
        <Badge className={cn(vendorClass, className)} {...props}>
            {toReadableString(vendorType)}
        </Badge>
    ) : null;

}

export { MSMVendorBadge };
