import React from "react";

interface SplitViewProps {
    left: React.ReactNode;                // Content for the left column
    right: React.ReactNode;               // Content for the right column
    leftWidth?: string;                   // Tailwind width classes for the left column (default: "w-1/2")
    rightWidth?: string;                  // Tailwind width classes for the right column (default: "w-1/2")
    gap?: string;                         // Tailwind spacing classes for gap (default: "gap-4")
    align?: "start" | "center" | "end";   // Vertical alignment of the columns
    className?: string;                   // Additional custom classes for the container
}

const MSMSplitView: React.FC<SplitViewProps> = ({
    left,
    right,
    leftWidth = "w-1/2",
    rightWidth = "w-1/2",
    gap = "gap-4",
    align = "start",
    className = "",
}) => {
    const verticalAlignment = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
    }[align];

    return (
        <div
            className={`flex ${verticalAlignment} ${gap} ${className}`}
        >
            <div className={`${leftWidth}`}>{left}</div>
            <div className={`${rightWidth}`}>{right}</div>
        </div>
    );
};

export default MSMSplitView;
