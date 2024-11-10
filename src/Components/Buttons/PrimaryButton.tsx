// PrimaryButton.tsx
import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

const PrimaryButton: React.FC<BaseButtonProps> = (props) => {
  return (
    <BaseButton
      {...props}
      variant="contained"
      backgroundColor="var(--primary-color)"
      color="var(--white-color)"
      hoverBackgroundColor="var(--primary-color)"
      hoverOpacity={0.9}
    />
  );
};

export default PrimaryButton;