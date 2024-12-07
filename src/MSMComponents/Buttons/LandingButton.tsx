import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';
import Icon from '../MSMIcon/Icon';

export interface LandingButtonProps extends BaseButtonProps {
  imageSrc?: string;
  imagePosition?: 'left' | 'right';
}


const LandingButton: React.FC<LandingButtonProps> = (props) => {
  return (
    <div style={{display: "flex"}}>
        <BaseButton
        {...props}
        variant="outlined"
        backgroundColor="var(--primary-color)"
        color="var(--white-color)"
        hoverBackgroundColor="var(--primary-color)"
        hoverOpacity={0.9}
        fullWidth={true}
        startIcon={props.imageSrc && <Icon iconSrc={props.imageSrc} color='accent' size="2em" />}
        />
    </div>
  );
};

export default LandingButton;
