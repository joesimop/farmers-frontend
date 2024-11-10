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
}

interface PopupStore {
  alert: AlertData | null;
  modal: ModalData | null;
  displayAlert: (type: AlertType, message: string, networkStatus?: number) => void;
  hideAlert: () => void;
  displayModal: (content: ReactElement, onCancel?: () => void, onConfirm?: () => void) => void;
  hideModal: () => void;
}

export const usePopupStore = create<PopupStore>((set) => ({
  alert: null,
  modal: null,
  displayAlert: (type, message, networkStatus) =>
    set({ alert: { type, message, networkStatus } }),
  hideAlert: () => set({ alert: null }),
  displayModal: (content, onCancel, onConfirm) =>
    set({ modal: { content, onCancel, onConfirm } }),
  hideModal: () => set({ modal: null }),
}));
