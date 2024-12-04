import React from "react";
import { AlertIcon } from "./AlertIcon";
import { cn } from "@lib/utils";
import { calculateCPCStatus } from "Helpers";
import { CPCStatus, CPCStatusColors } from "@lib/Constants/Types";


interface CPCStatusBadgeProps {
  date: string; // ISO string or date format compatible with `Date`
}

export const CPCStatusBadge: React.FC<CPCStatusBadgeProps> = ({ date }) => {

  const { status, daysLeft } = calculateCPCStatus(new Date(date));
  const dueText = `CPC due in `;

  const tooltipContent = (() => {
    if (status === CPCStatus.PAST_DUE) {
      return <span className="font-bold text-destructive">{Math.abs(daysLeft)} Days Past Due</span>;
    }

    
    const dayCount = (
      <span
        className={cn(
          status === CPCStatus.URGENT ? "font-bold text-destructive" : "",
          status === CPCStatus.WARNING ? "font-bold text-warning" : ""
        )}
      >
        {daysLeft}
      </span>
    );

    return (
      <>
        {dueText}
        {dayCount}
        {status === CPCStatus.UP_TO_DATE ? "." : "!"}
      </>
    );
  })();

  return (
    <div className="flex justify-between w-28">
      <span className={CPCStatusColors[status]}>{new Date(date).toLocaleDateString()}</span>
      {status !== 'Up to Date' && 
      <AlertIcon color={CPCStatusColors[status]} tooltip={tooltipContent} /> }
    </div>
  );
};
