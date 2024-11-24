import React from 'react';
import Image from '../Image/Image'; // Adjust the import path as needed

interface IconProps {
  iconSrc: string; // Can be a full image path or a folder path
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'white' | 'black'; // Allowed color options
  size?: string; // Size of the icon in pixels (optional, default 24px)
}

const iconPath = 'src/Assets/icons'; // Adjust the path as needed


export enum IconSrcs {
    VendorManagement = '/icons/vendormanagement',
    Reporting = '/icons/reporting',
    Checkout = '/icons/checkout',
}

//const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const Icon: React.FC<IconProps> = ({ iconSrc, color, size = "1.5em" }) => {
  const isImage = iconSrc.includes('_'); // Check if it's already an image (contains '_')
  
  let iconType = "";
  for(let i = iconSrc.length - 1; i >= 0; i--){
    if(iconSrc[i] == '/'){
      iconType = iconSrc.slice(i+1);
      break;
    }
  }

  //const formattedColor = capitalize(color); // Capitalize the color
  const finalSrc = isImage
    ? iconSrc // Use the provided string as is for an image
    : `${iconSrc}/${iconType}_${color}.png`; // Build the image path for a folder

  return <Image src={finalSrc} alt={`${color} icon`} />;
};

export default Icon;
