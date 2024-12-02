import React from "react";
import { AlertIcon } from "./AlertIcon";
import { cn } from "@lib/utils";
import { calculateCPCStatus } from "Helpers";
import { CPCStatusColors } from "@lib/Constants/Types";


export type CPCStatus = "Past Due" | "Due Urgently" | "Due Soon" | "Up to Date";

interface CPCStatusBadgeProps {
  date: string; // ISO string or date format compatible with `Date`
}

export const CPCStatusBadge: React.FC<CPCStatusBadgeProps> = ({ date }) => {

  const { status, daysLeft } = calculateCPCStatus(new Date(date));

  const tooltipContent = (() => {
    if (status === "Past Due") {
      return <span className="font-bold text-destructive">Past Due</span>;
    }

    const dueText = `CPC due in `;
    const dayCount = (
      <span
        className={cn(
          status === "Due Urgently" ? "font-bold text-destructive" : "",
          status === "Due Soon" ? "font-bold text-warning" : ""
        )}
      >
        {daysLeft}
      </span>
    );

    return (
      <>
        {dueText}
        {dayCount}
        {status === "Up to Date" ? "." : "!"}
      </>
    );
  })();

  return (
    <div className="flex justify-between w-28">
      <span className={CPCStatusColors[status]}>{new Date(date).toLocaleDateString()}</span>
      <AlertIcon color={CPCStatusColors[status]} tooltip={tooltipContent} />
    </div>
  );
};
