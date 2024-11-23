// BaseButton.tsx
import React, { useState } from 'react';
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
  variant?: 'contained' | 'outlined' | 'text';
  sx?: MUIButtonProps['sx'];
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
  sx,
  isDisabled = false,
  startIcon = <></>,
  endIcon= <></>,
  fullWidth = false
}) => {

  const [disabled, setDisabled] = useState(isDisabled); 

  return (
    <Button
      variant={variant}
      onClick={disabled ? () => {} : onClick}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      sx={{
        backgroundColor,
        color,
        borderRadius: '10px',
        transform: 'scale(1.00)',
        transitionDuration: '0.25s',
        transitionProperty: 'transform',
        '&:hover': {
          backgroundColor: hoverBackgroundColor,
          color: hoverColor,
          opacity: hoverOpacity,
          transform: 'scale(1.05)',
          transitionDuration: '0.5s',
          transitionProperty: 'transform',
        },
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
        fontFamily: 'var(--app-font)',
        ...sx,
      }}
      disableElevation={true}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default BaseButton;
