export interface Telemetry {
  id: string;
  date: Date;
  temperature?: number;
  gravity?: number;
  gravityVelocity?: number;
  battery?: number;
  rssi?: number;
}
