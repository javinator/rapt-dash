export interface Telemetry {
  id: string;
  createdOn: Date;
  temperature?: number;
  gravity?: number;
  gravityVelocity?: number;
  battery?: number;
  rssi?: number;
}
