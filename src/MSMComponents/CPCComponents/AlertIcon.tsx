import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@lib/utils";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@ShadcnComponents/ui/hover-card";

interface AlertIconProps {
  color: string;
  tooltip?: React.ReactNode;
}

export const AlertIcon: React.FC<AlertIconProps> = ({ color, tooltip }) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <AlertCircle className={cn("w-5 h-5", color)} />
      </HoverCardTrigger>
      {tooltip && (
        <HoverCardContent className="p-2 w-fit flex justify-center max-w-36">
          <span>{tooltip}</span>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};
