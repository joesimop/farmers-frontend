import React from "react";

interface MSMHorizontalDivideLineProps {
    verticalSpacing?: number;
}

const MSMHorizontalDivideLine: React.FC<MSMHorizontalDivideLineProps> = ({ verticalSpacing = 4 }) => {
    const spacingClass = `my-${verticalSpacing}`;
    return <hr className={`w-full ${spacingClass}`} />;
};



export default MSMHorizontalDivideLine;
