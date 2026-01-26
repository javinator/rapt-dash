export type AlertType = 'info' | 'success' | 'error';

export interface Message {
  type: AlertType;
  text: string;
}
