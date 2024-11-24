import { usePopupStore, AlertType } from './PopupDefnitions';
import { ReactElement } from 'react';

export const DisplayErrorAlert = (message: string, networkStatus?: number) =>
  usePopupStore.getState().displayAlert('error', message, networkStatus);

export const DisplayInfoAlert = (message: string, networkStatus?: number) =>
  usePopupStore.getState().displayAlert('info', message, networkStatus);

export const DisplayWarningAlert = (message: string, networkStatus?: number) =>
  usePopupStore.getState().displayAlert('warning', message, networkStatus);

export const DisplaySuccessAlert = (message: string, networkStatus?: number) =>
  usePopupStore.getState().displayAlert('success', message, networkStatus);

export const DisplayAlert = (type: AlertType, message: string, networkStatus?: number) =>
    usePopupStore.getState().displayAlert(type, message, networkStatus);

export const DisplayModal = (
  content: ReactElement,
  onCancel?: () => void,
  onConfirm?: () => void,
  confirmText?: string,
  cancelText?: string,
) => usePopupStore.getState().displayModal(content, onCancel, onConfirm, confirmText, cancelText);
