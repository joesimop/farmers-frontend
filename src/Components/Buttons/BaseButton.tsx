// BaseButton.tsx
import React from 'react';
import "../../index.css";
import Button, { ButtonProps as MUIButtonProps } from '@mui/material/Button';

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
  variant?: 'contained' | 'outlined';
  sx?: MUIButtonProps['sx'];
}

const BaseButton: React.FC<BaseButtonProps> = ({
  text,
  onClick,
  size = 'medium',
  variant = 'contained',
  backgroundColor,
  color,
  hoverBackgroundColor,
  hoverColor,
  hoverOpacity = 1,
  sx,
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      size={size}
      sx={{
        backgroundColor,
        color,
        '&:hover': {
          backgroundColor: hoverBackgroundColor,
          color: hoverColor,
          opacity: hoverOpacity,
        },
        fontFamily: 'var(--app-font)',
        ...sx,
      }}
    >
      {text}
    </Button>
  );
};

export default BaseButton;
