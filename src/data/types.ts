// Types
export interface WorldRecord {
  distance: number;
  name: string;
  year: number;
  time: string;
}

export interface ProcessedRecord extends WorldRecord {
  timeSeconds: number;
  pace: number;
  logDistance: number;
  displayDistance: string;
  category: 'male' | 'female' | 'mine';
}

export interface MyRecords {
  [key: string]: string;
}

export interface DistanceLabels {
  [key: number]: string;
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ProcessedRecord;
  }>;
}