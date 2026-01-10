
export enum StudyState {
  IDLE = 'IDLE',
  FOCUS = 'FOCUS',
  BREAK = 'BREAK',
  FAILED = 'FAILED'
}

export enum PetType {
  BUNNY = 'BUNNY',
  PIG = 'PIG',
  SLIME = 'SLIME'
}

export type UserExpression = 'neutral' | 'smile' | 'tongue_out' | 'wink';

export interface DetectionResult {
  phone_detected: boolean;
  confidence: number;
  expression: UserExpression;
  detection_method?: string;
  phone_location?: string;
  detected_objects?: DetectedObject[];
}

export interface DetectedObject {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface TrackingMetrics {
  total_detections: number;
  phone_detections: number;
  average_confidence: number;
  last_detection_time: number;
  detection_rate: number;
}
