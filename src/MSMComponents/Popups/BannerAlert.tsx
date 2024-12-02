import React from "react";
import { AlertCircle } from "lucide-react";
import {
  Alert as ShadAlert,
  AlertDescription,
  AlertTitle,
} from "@ShadcnComponents/ui/alert";

type AlertVariant = "default" | "destructive";

interface AlertComponentProps {
  variant: AlertVariant;
  title: string;
  text: string;
}

export const BannerAlert: React.FC<AlertComponentProps> = ({
  variant,
  title,
  text,
}) => {
  return (
    <ShadAlert variant={variant}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{text}</AlertDescription>
    </ShadAlert>
  );
};
