// ActionButton.tsx
import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

const ActionButton: React.FC<BaseButtonProps> = (props) => {
  return (
    <BaseButton
      {...props}
      variant="contained"
      backgroundColor="var(--secondary-color)"
      color="var(--white-color)"
      hoverBackgroundColor="var(--secondary-color)"
      hoverOpacity={0.9}
    />
  );
};

export default ActionButton;

