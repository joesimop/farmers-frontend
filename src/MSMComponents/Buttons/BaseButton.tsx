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
  size?: 'lg' | 'sm' | 'default' | 'icon' | 'xxl' | null | undefined;
  variant?: 'default' | 'destructive' | 'ghost' | 'outline' | 'secondary' | 'link';
  isDisabled?: boolean;
  Icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const BaseButton: React.FC<BaseButtonProps> = ({
  text,
  onClick,
  size: btnSize = 'default',
  variant: btnVariant = 'default',
  isDisabled = false,
  Icon = null,
  iconPosition = 'left',
  fullWidth = false
}) => {

  const [disabled, setDisabled] = useState(isDisabled); 
  
  return (
    <Button
      className='m-2'
      variant={btnVariant}
      size={btnSize}
      onClick={disabled ? () => {} : onClick}
      disabled={disabled}
      >
      {Icon != null && iconPosition === 'left' && Icon}
      {text}
      {Icon != null && iconPosition === 'right' && Icon}
    </Button>
  );
};

export default BaseButton;
