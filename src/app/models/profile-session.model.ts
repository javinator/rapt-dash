export interface ProfileSession {
  name: string;
  id: string;
  start?: Date | string;
  end?: Date | string;
  originalGravity?: number;
  finalGravity?: number;
}
