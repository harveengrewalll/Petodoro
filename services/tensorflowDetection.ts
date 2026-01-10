import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';


let cocoModel: any = null;
let modelsLoading = false;

const initializeModels = async () => {
  if (modelsLoading || cocoModel) return;
  modelsLoading = true;

  try {
    // 🔥 FORCE BACKEND
    await tf.setBackend('webgl');
    await tf.ready();

    console.log('TF backend:', tf.getBackend());

    cocoModel = await cocoSsd.load();
    console.log('COCO-SSD loaded');
  } catch (error) {
    console.error('Model loading error:', error);
  }

  modelsLoading = false;
};


export interface DetectedObjectTF {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export const detectObjectsInVideo = async (videoElement: HTMLVideoElement): Promise<DetectedObjectTF[]> => {
  try {
    await initializeModels();
    
    if (!cocoModel) {
      console.warn('Models not loaded yet');
      return [];
    }

    const detectedObjects: DetectedObjectTF[] = [];

    // Detect objects (phones, people, etc.)
    const cocoDetections = await cocoModel.detect(videoElement);
    
    console.log('COCO detections:', cocoDetections);
    
    cocoDetections.forEach((detection: any) => {
      const [x, y, width, height] = detection.bbox;
      
      // Normalize coordinates to 0-1
      const normalizedX = x / videoElement.videoWidth;
      const normalizedY = y / videoElement.videoHeight;
      const normalizedWidth = width / videoElement.videoWidth;
      const normalizedHeight = height / videoElement.videoHeight;
      
      // Detect phones
      if (
        detection.class === 'cell phone' ||
        detection.class === 'laptop' ||
        detection.class === 'keyboard'
      ) {
        detectedObjects.push({
          type: 'mobile_device',
          x: normalizedX,
          y: normalizedY,
          width: normalizedWidth,
          height: normalizedHeight,
          confidence: detection.score,
        });
      }
      
      // Detect person as face
      if (detection.class === 'person') {
        detectedObjects.push({
          type: 'face',
          x: normalizedX,
          y: normalizedY,
          width: normalizedWidth,
          height: normalizedHeight,
          confidence: detection.score,
        });
      }
    });

    return detectedObjects;
  } catch (error) {
    console.error('Detection error:', error);
    return [];
  }
};

export const preloadModels = async () => {
  await initializeModels();
};