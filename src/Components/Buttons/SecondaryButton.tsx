// SecondaryButton.tsx
import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

const SecondaryButton: React.FC<BaseButtonProps> = (props) => {
  return (
    <BaseButton
      {...props}
      variant="outlined"
      color="var(--secondary-color)"
      hoverBackgroundColor="var(--secondary-color)"
      hoverColor="var(--white-color)"
    />
  );
};

export default SecondaryButton;
