// BaseButton.tsx
import React, { useState } from 'react';
import "../../index.css";
import { Button } from '@ShadcnComponents/ui/button';

interface ButtonStyleProps {
  backgroundColor?: string;
  color?: string;
  hoverBackgroundColor?: string;
  hoverColor?: string;
  hoverOpacity?: number;
}

export interface BaseButtonProps extends ButtonStyleProps {
  text: string;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined' | 'text';
  isDisabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const BaseButton: React.FC<BaseButtonProps> = ({
  text,
  onClick,
  size = 'medium',
  variant = 'text',
  backgroundColor,
  color,
  hoverBackgroundColor,
  hoverColor,
  hoverOpacity = 1,
  isDisabled = false,
  startIcon = <></>,
  endIcon= <></>,
  fullWidth = false
}) => {

  const [disabled, setDisabled] = useState(isDisabled); 

  return (
    <Button
      onClick={disabled ? () => {} : onClick}
        // root: {
          // '& label': {
          //   color: 'red',
          // },
          // '& label.Mui-focused': {
          //   color: 'white',
          // },
          // '& .MuiButtonBase-root': {
          //   border: '2px solid white',
          // },
          // '& .MuiOutlinedInput-root': {
          //   '& fieldset': {
          //     borderColor: 'white',
          //   },
          //   '&:hover fieldset': {
          //     borderColor: 'white',
          //   },
          //   '&.Mui-focused fieldset': {
          //     borderColor: 'yellow',
          //   },
          // },
        // },
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default BaseButton;
