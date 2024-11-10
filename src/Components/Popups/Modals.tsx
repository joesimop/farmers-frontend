import { usePopupStore } from './PopupDefnitions';
import { Dialog, DialogActions, DialogContent, Button, Backdrop } from '@mui/material';
import React from 'react';

export const PopupModal: React.FC = () => {
  const { modal, hideModal } = usePopupStore();

  if (!modal) return null;

  const handleCancel = () => {
    if (modal.onCancel) modal.onCancel();
    hideModal();
  };

  const handleConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    hideModal();
  };

  return (
    <>
      <Backdrop
        open={!!modal}
        style={{
          zIndex: 1300,
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // dim effect
        }}
      />

      <Dialog open={!!modal} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogContent>{modal.content}</DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
