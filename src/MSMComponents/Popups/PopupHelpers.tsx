import { usePopupStore, AlertType, ModalData } from './PopupDefnitions';
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

export const DisplayModal = ({
  content = <></>,
  onCancel = undefined,
  onConfirm = undefined,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  title= ''
}: ModalData) => usePopupStore.getState().displayModal(content, onCancel, onConfirm, confirmText, cancelText, title);
