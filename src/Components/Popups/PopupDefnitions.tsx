import { create } from 'zustand';
import { ReactElement } from 'react';

export type AlertType = 'error' | 'info' | 'warning' | 'success';

interface AlertData {
  message: string;
  type: AlertType;
  networkStatus?: number;
}

interface ModalData {
  content: ReactElement;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface PopupStore {
  alert: AlertData | null;
  modal: ModalData | null;
  // confirmIsDisabledCallback: () => boolean;
  // setConfirmIsDisabledCallback: (callback: () => boolean) => void;
  displayAlert: (type: AlertType, message: string, networkStatus?: number) => void;
  hideAlert: () => void;
  displayModal: (content: ReactElement, onCancel?: () => void, onConfirm?: () => void, confirmText?: string, cancelText?: string) => void;
  hideModal: () => void;
}

export const usePopupStore = create<PopupStore>((set) => ({
  alert: null,
  modal: null,
  // confirmIsDisabledCallback: () => false,
  // setConfirmIsDisabledCallback(callback) {
  //   set({ confirmIsDisabledCallback: callback });
  // },
  displayAlert: (type, message, networkStatus) =>
    set({ alert: { type, message, networkStatus } }),
  hideAlert: () => set({ alert: null }),
  displayModal: (content, onCancel, onConfirm, confirmText, cancelText) =>
    set({ modal: { content, onCancel, onConfirm, confirmText, cancelText } }),
  hideModal: () => set({ modal: null, /*confirmIsDisabledCallback: () => false*/ }),
}));
