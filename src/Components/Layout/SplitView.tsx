import React from 'react';

interface SplitViewProps {
    left: React.ReactNode;
    right: React.ReactNode;
}

const SplitView: React.FC<SplitViewProps> = ({ left, right }) => {
    return (
        <div className="two-column-container">
            <div className="column">{left}</div>
            <div className="column">{right}</div>
        </div>
    );
};
export default SplitView;