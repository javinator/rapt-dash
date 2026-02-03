export interface ProfileSession {
  name: string;
  id: string;
  start?: Date | string;
  end?: Date | string;
  originalGravity?: 0;
  finalGravity?: 0;
}
