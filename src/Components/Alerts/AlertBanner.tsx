import React from 'react';
import './AlertBanner.css'; // Optional: Create some basic styles
import { useAlert } from './AlertContext'; // Use the alert context
import Alert from '@mui/material/Alert'; // Material UI Alert component

const AlertBanner = () => {
  const { alert, hideAlert } = useAlert(); // Get alert state and hide function from context

  if (!alert.visible) return null; // Don't render if not visible

  return (
    <div>
      <Alert sx = {{zIndex: "100"}} severity={alert.type}>{alert.message}</Alert>
      <button onClick={() => hideAlert()} className="close-btn">
        &times;
      </button>
    </div>
  );
};

export default AlertBanner;