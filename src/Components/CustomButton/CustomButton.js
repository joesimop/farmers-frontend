import './CustomButton.css'; // External CSS for styling and animations
import { useNavigate } from 'react-router-dom'; // For navigation
import "../../index.css"

const CustomButton = ({
  text = 'Click Me', // Button text
  color = '#6200ea', // Default button background color
  textColor = '#fff', // Default button text color
  onClick = () => {},
  to = '', // URL to navigate to
  animate = false, // Toggle animation
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to !== '') {
      navigate(to); 
    } else if (onClick != null) {
        onClick();
    }
  };

  return (
    <button
      className={`custom-button default-padding ${animate ? 'animate' : ''}`}
      style={{ backgroundColor: color, color: textColor }}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default CustomButton;