import { usePopupStore } from './PopupDefnitions';
import { Dialog, DialogActions, DialogContent, Button, Backdrop } from '@mui/material';
import React from 'react';
import ActionButton from '../Buttons/ActionButton';

export const PopupModal: React.FC = () => {
  const { modal, hideModal, /*confirmIsDisabledCallback*/ } = usePopupStore();

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
        className='z-10'
        style={{
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // dim effect
        }}
      />

      <Dialog open={!!modal} onClose={handleCancel} maxWidth="sm" fullWidth className='z-10'>
        <DialogContent>{modal.content}</DialogContent>
        <DialogActions>
          <ActionButton
            text={modal.cancelText ? modal.cancelText : "Cancel"}
            onClick={handleCancel} />

          <ActionButton
            text={modal.confirmText ? modal.confirmText : "Confirm"}
            onClick={handleConfirm}
            isDisabled={false} />
        </DialogActions>
      </Dialog>
    </>
  );
};
