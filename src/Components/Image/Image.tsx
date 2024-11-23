import React, { useState } from 'react';

interface ImageProps {
  src?: string; // Optional image source
  size?: string; // Size in pixels (applies to both width and height)
  alt?: string; // Alt text for the image
}

const Image: React.FC<ImageProps> = ({
  src,
  size = "3em",
  alt = '',
}) => {
  const [isValid, setIsValid] = useState(true);

  // Handler to check image validity
  const handleError = () => {
    setIsValid(false);
  };

  // Do not render anything if no src or the image is invalid
  if (!src || !isValid) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ width: size, height: size }}
      onError={handleError}
    />
  );
};

export default Image;
