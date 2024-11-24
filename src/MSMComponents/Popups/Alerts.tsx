import { usePopupStore } from './PopupDefnitions';
import { Alert, Snackbar } from '@mui/material';

export const AlertBanner: React.FC = () => {
  const { alert, hideAlert } = usePopupStore();

  if (!alert) return null;

  return (
    <Snackbar
      open={!!alert}
      autoHideDuration={6000}
      onClose={hideAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={hideAlert} severity={alert.type}>
        {alert.message}
        {alert.networkStatus && <span> (Status: {alert.networkStatus})</span>}
      </Alert>
    </Snackbar>
  );
};

export {};
