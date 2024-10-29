export interface BaseDialogProp {
  loading?: boolean;
  disable?: boolean;
  overline?: string;
  title: string;
  okBtnTxt?: string;
  color?: string;
  onOkClick?: () => void;
  onClose?: () => void;
}

export interface CheckDialogProp {
  title: string;
  message: string;
  okTxt: string;
  cancelTxt: string;
}

export type ShowingDetail = { title: string; desc: string };
export interface InfoDialogProp {
  showingDetails: ShowingDetail[];
}
