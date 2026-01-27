export interface ProfileSession {
  name: string;
  modifiedOn: Date;
  id: string;
  deleted: boolean;
  createdOn: Date;
  hydrometerId?: string;
  startDate?: Date;
  endDate?: Date;
  originalGravity?: 0;
  finalGravity?: 0;
}
