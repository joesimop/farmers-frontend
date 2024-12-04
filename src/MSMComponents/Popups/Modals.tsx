import { usePopupStore } from './PopupDefnitions';
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

// Expose a function to close the modal
export const closeModal = () => {
  usePopupStore.getState().hideModal()
}

export const PopupModal: React.FC = () => {

  const { modal, hideModal } = usePopupStore();

  if (!modal) return null;

  console.log(modal.onConfirm)
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
    <Dialog open={!!modal} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modal.title}</DialogTitle>
          {modal.content}
        </DialogHeader>
        <DialogFooter>
          {modal.onCancel && <Button variant={"outline"} onClick={handleCancel}>{modal.cancelText}</Button>}

          {modal.onConfirm &&
            <>
              <div className='sm:mt-3' />
              <Button onClick={handleConfirm} disabled={modal.isConfirmDisabled}>{modal.confirmText}</Button>
            </>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
