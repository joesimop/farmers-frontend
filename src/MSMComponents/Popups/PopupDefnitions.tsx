import { create } from 'zustand';
import { ReactElement } from 'react';

export type AlertType = 'error' | 'info' | 'warning' | 'success';

interface AlertData {
  message: string;
  type: AlertType;
  networkStatus?: number;
}

export interface ModalData {
  content?: ReactElement;
  onCancel?: () => void;
  onConfirm?: () => Promise<boolean | undefined>;
  confirmText?: string;
  cancelText?: string;
  title?: string;
  isConfirmDisabled?: boolean;
}

interface PopupStore {
  alert: AlertData | null;
  modal: ModalData | null;
  // confirmIsDisabledCallback: () => boolean;
  // setConfirmIsDisabledCallback: (callback: () => boolean) => void;
  displayAlert: (type: AlertType, message: string, networkStatus?: number) => void;
  hideAlert: () => void;

  displayModal: (content?: ReactElement, onCancel?: () => void, onConfirm?: () => Promise<boolean | undefined>, confirmText?: string, cancelText?: string, title?: string, isConfirmDisabled?: boolean) => void;

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

  displayModal: (content, onCancel, onConfirm, confirmText, cancelText, title, isConfirmDisabled) =>
    set({ modal: { content, onCancel, onConfirm, confirmText, cancelText, title, isConfirmDisabled } }),

  hideModal: () => set({ modal: null, /*confirmIsDisabledCallback: () => false*/ }),
}));
