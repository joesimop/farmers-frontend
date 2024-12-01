import { usePopupStore } from './PopupDefnitions';
// import { Dialog, DialogActions, DialogContent, Button, Backdrop } from '@mui/material';
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ShadcnComponents/ui/dialog"
import { Button } from '@ShadcnComponents/ui/button'
import React from 'react';
import ActionButton from '../Buttons/ActionButton';

export const PopupModal: React.FC = () => {
  const { modal, hideModal, /*confirmIsDisabledCallback*/ } = usePopupStore();

  if (!modal) return null;

  const handleCancel = () => {
    modal.onCancel?.()
    hideModal();
  };

  const handleConfirm = async () => {
    const isSuccessful = await modal.onConfirm?.()
    if (isSuccessful) {
      hideModal();
    }
  };

  return (
    <>
      <Dialog open={!!modal} onOpenChange={handleCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modal.title}</DialogTitle>
            {modal.content}
          </DialogHeader>
          <DialogFooter>
            {modal.onCancel && <Button onClick={handleCancel}>{modal.cancelText}</Button>}
            {modal.onConfirm && <Button onClick={handleConfirm} disabled={modal.isConfirmDisabled}>{modal.confirmText}</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
