// ActionButton.tsx
import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

const ActionButton: React.FC<BaseButtonProps> = (props) => {
  return (
    <BaseButton
      {...props}
      variant="contained"
      backgroundColor="var(--accent-color)"
      color="var(--white-color)"
      hoverBackgroundColor="var(--accent-color)"
      hoverOpacity={0.9}
    />
  );
};

export default ActionButton;

