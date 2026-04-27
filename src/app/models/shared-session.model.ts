import { Telemetry } from './telemetry.model';

export interface SharedSession {
  name: string;
  start?: Date | string;
  end?: Date | string;
  originalGravity?: number;
  finalGravity?: number;
  telemetry: Telemetry[];
}
