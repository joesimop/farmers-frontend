import React from "react";

interface MSMHorizontalDivideLineProps {
    verticalSpacing?: number;
}

const MSMHorizontalDivideLine: React.FC<MSMHorizontalDivideLineProps> = ({ verticalSpacing = 4 }) => {
    return <hr className={`w-full my-4`} />;
};



export default MSMHorizontalDivideLine;
