import React from "react";

interface MSMRowProps {
    children: React.ReactNode[];
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly"; // Justify content
    align?: "start" | "center" | "end" | "baseline" | "stretch"; // Align items
    lastElementRight?: boolean; // Place the last element on the right
    className?: string; // Additional custom classes
}

const MSMRow: React.FC<MSMRowProps> = ({
    children,
    justify = "start",
    align = "center",
    lastElementRight = false,
    className = "",
}) => {

    // Normalize children into an array
    const childArray = React.Children.toArray(children);

    return (
        <div
            className={`flex items-${align} justify-${justify} ${className}`}
        >
            {lastElementRight ? (
                <>
                    {childArray.slice(0, -1).map((child, index) => (
                        <div key={index} className="flex-grow mr-4 last:mr-0">
                            {child}
                        </div>
                    ))}
                    <div>{children[children.length - 1]}</div>
                </>
            ) : (
                childArray.map((child, index) => (
                    <div key={index} className="mr-4 last:mr-0">
                        {child}
                    </div>
                ))
            )}
        </div>
    );
};

export default MSMRow;
