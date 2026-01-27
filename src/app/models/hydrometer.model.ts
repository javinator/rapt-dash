import { ProfileSession } from './profile-session.model';
import { Telemetry } from './telemetry.model';

export interface Hydrometer {
  id: string;
  name: string;
  macAddress: string;
  deleted: boolean;
  lastActivityTime?: Date;
  temperature?: number;
  gravity?: number;
  gravityVelocity?: number;
  battery?: number;
  rssi?: number;
  firmwareVersion?: string;
  isLatestFirmware?: boolean;
  activeProfileSession: ProfileSession;
  telemetry: Telemetry[];
}
