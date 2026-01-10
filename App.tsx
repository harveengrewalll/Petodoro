
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PixelBackground from './components/PixelBackground';
import PixelPet from './components/PixelPet';
import { StudyState, PetType, UserExpression } from './types';
//import { detectPhoneUsage } from './services/geminiService';
import { detectObjectsInVideo, preloadModels } from './services/tensorflowDetection';

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;
const TF_DETECTION_INTERVAL_MS = 500; // Fast real-time detection with TensorFlow
//const GEMINI_EXPRESSION_INTERVAL_MS = 8000; // Slower expression detection with Gemini

const App: React.FC = () => {
  const [state, setState] = useState<StudyState>(StudyState.IDLE);
  const [selectedPet, setSelectedPet] = useState<PetType>(PetType.BUNNY);
  const [timeLeft, setTimeLeft] = useState(FOCUS_MINUTES * 60);
  const [showWarning, setShowWarning] = useState(false);
  const [foodCount, setFoodCount] = useState(0);
  const [isEating, setIsEating] = useState(false);
  const [expression, setExpression] = useState<UserExpression>('neutral');
  const [detectionConfidence, setDetectionConfidence] = useState(0);
  const [trackingMethod, setTrackingMethod] = useState<string>('TensorFlow.js + COCO-SSD');
  const [phoneDetectionCount, setPhoneDetectionCount] = useState(0);
  const [totalDetections, setTotalDetections] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<any>(null);
  const tfDetectionRef = useRef<any>(null);
  //const geminiExpressionRef = useRef<any>(null);
  const detectionHistoryRef = useRef<number[]>([]);
  const [detectedObjects, setDetectedObjects] = useState<any[]>([
    {
      type: 'face',
      x: 0.15,
      y: 0.1,
      width: 0.7,
      height: 0.8,
      confidence: 0.95,
    }
  ]);

  useEffect(() => {
    if (state === StudyState.FOCUS || state === StudyState.BREAK) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  const handleTimerComplete = () => {
    if (state === StudyState.FOCUS) {
      setState(StudyState.BREAK);
      setTimeLeft(BREAK_MINUTES * 60);
      setFoodCount(prev => prev + 1);
    } else {
      setState(StudyState.IDLE);
      setTimeLeft(FOCUS_MINUTES * 60);
    }
  };

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Preload TensorFlow models
          await preloadModels();
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };
    setupCamera();
  }, []);

  // TensorFlow detection for real-time bounding boxes
  const performTFDetection = useCallback(async () => {
    if (!videoRef.current || state === StudyState.FAILED) return;

    const video = videoRef.current;
    
    // Wait for video to have dimensions
    if (!video.videoWidth || !video.videoHeight) {
      console.log('Video not ready yet');
      return;
    }

    try {
      const objects = await detectObjectsInVideo(video);
      
      console.log('Detected objects:', objects.length, objects);
      
      // Only update if we got objects, otherwise keep previous
      if (objects.length > 0) {
        setDetectedObjects(objects);
        setTotalDetections(prev => prev + 1);
      } else {
        console.log('No objects detected this frame, keeping previous');
      }

      // Check for phones
      const phoneDetected = objects.some(obj => obj.type === 'mobile_device');
      if (phoneDetected && state === StudyState.FOCUS) {
        setPhoneDetectionCount(prev => prev + 1);
        setDetectionConfidence(Math.max(...objects.filter(o => o.type === 'mobile_device').map(o => o.confidence), 0));
        
        console.log('PHONE DETECTED! Pet dying...');
        
        // PET DIES ON PHONE DETECTION
        setState(StudyState.FAILED);
        if (timerRef.current) clearInterval(timerRef.current);
        if (tfDetectionRef.current) clearInterval(tfDetectionRef.current);
        //if (geminiExpressionRef.current) clearInterval(geminiExpressionRef.current);
      }
    } catch (error) {
      console.error('TensorFlow detection error:', error);
      // Keep boxes even on error
    }
  }, [state]);

  // Gemini expression detection (less frequent)
  const performExpressionDetection = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || state === StudyState.FAILED) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    
    try {
      const result = await detectPhoneUsage(base64Image);
      setExpression(result.expression);
    } catch (error) {
      console.error('Expression detection error:', error);
    }
  }, [state]);

  // TensorFlow real-time detection loop (fast bounding boxes)
  useEffect(() => {
    if (state !== StudyState.FAILED) {
      tfDetectionRef.current = setInterval(performTFDetection, TF_DETECTION_INTERVAL_MS);
    } else {
      if (tfDetectionRef.current) clearInterval(tfDetectionRef.current);
    }
    return () => {
      if (tfDetectionRef.current) clearInterval(tfDetectionRef.current);
    };
  }, [state, performTFDetection]);

  
  const toggleStudy = () => {
    if (state === StudyState.IDLE || state === StudyState.FAILED) {
      setState(StudyState.FOCUS);
      setTimeLeft(FOCUS_MINUTES * 60);
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
      setExpression('neutral');
      // Reset detection counters for new session
      setPhoneDetectionCount(0);
      setTotalDetections(0);
      detectionHistoryRef.current = [];
    } else {
      setState(StudyState.IDLE);
      setTimeLeft(FOCUS_MINUTES * 60);
      setExpression('neutral');
    }
  };

  const feedPet = () => {
    if (foodCount > 0 && !isEating && state !== StudyState.FAILED) {
      setFoodCount(prev => prev - 1);
      setIsEating(true);
      setTimeout(() => setIsEating(false), 3000);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <PixelBackground />

      {showWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-4 pixel-border z-50 text-2xl animate-pulse text-center">
          DO NOT LOOK AT YOUR PHONE!<br/>YOUR PET'S LIFE DEPENDS ON IT.
        </div>
      )}

      {/* Food Inventory Display */}
      <div className="fixed top-4 left-4 bg-white/80 p-4 pixel-border flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center bg-orange-200 border-2 border-orange-500 rounded-sm">
           <span className="text-xl">🥕</span>
        </div>
        <div className="text-2xl font-bold text-pink-800">x{foodCount}</div>
        <div className="text-xs text-pink-500 ml-2 uppercase">Study more to get snacks!</div>
      </div>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md p-8 rounded-xl pixel-border flex flex-col items-center gap-6 relative">
        
        <h1 className="text-4xl font-bold text-pink-700 tracking-widest uppercase text-center">
          {state === StudyState.IDLE && 'Choose Your Companion'}
          {state === StudyState.FOCUS && 'Focus Session Active'}
          {state === StudyState.BREAK && 'Well Deserved Break'}
          {state === StudyState.FAILED && 'NOOOO! YOU FAILED THEM'}
        </h1>

        {/* Pet Selection - Only visible in IDLE */}
        {state === StudyState.IDLE && (
          <div className="flex gap-4 w-full justify-center py-4">
            {[PetType.BUNNY, PetType.PIG, PetType.SLIME].map((pet) => (
              <button
                key={pet}
                onClick={() => setSelectedPet(pet)}
                className={`p-4 rounded-lg transition-all border-4 ${
                  selectedPet === pet 
                  ? 'border-pink-600 bg-pink-100 scale-110 shadow-lg' 
                  : 'border-transparent bg-white/50 hover:bg-pink-50 opacity-60'
                }`}
              >
                <div className="scale-75 origin-center">
                  <PixelPet state={StudyState.IDLE} type={pet} isEating={false} expression={expression} />
                </div>
                <div className="mt-2 text-center font-bold text-pink-800 text-lg uppercase">{pet}</div>
              </button>
            ))}
          </div>
        )}

        {/* Primary Focus Area */}
        <div className="flex flex-col items-center gap-8 py-4 relative">
          <PixelPet state={state} type={selectedPet} isEating={isEating} expression={expression} />
          
          <div className="text-8xl font-black text-pink-900 bg-pink-50 px-10 py-4 rounded-lg border-4 border-pink-200">
            {formatTime(timeLeft)}
          </div>
          
          {expression !== 'neutral' && state !== StudyState.FAILED && (
            <div className="absolute -bottom-2 text-pink-600 animate-pulse uppercase font-bold text-sm">
              MIMICKING YOU: {expression.replace('_', ' ')}
            </div>
          )}
        </div>

        <div className="flex gap-4 w-full">
          <button 
            onClick={toggleStudy}
            className={`flex-1 py-4 text-2xl font-bold text-white pixel-btn ${state === StudyState.FOCUS ? 'bg-red-500 border-red-800' : 'bg-pink-500'}`}
          >
            {state === StudyState.IDLE ? `START WITH ${selectedPet}` : 
             state === StudyState.FAILED ? 'RESURRECT & RESTART' : 
             'END SESSION'}
          </button>
          
          {state !== StudyState.FOCUS && state !== StudyState.FAILED && (
            <button 
              onClick={feedPet}
              disabled={foodCount === 0 || isEating}
              className={`flex-1 py-4 text-2xl font-bold text-white pixel-btn bg-orange-500 border-orange-800 ${ (foodCount === 0 || isEating) ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              FEED SNACK
            </button>
          )}
        </div>

        <div className="absolute top-4 right-4 group">
            <div className="relative inline-block w-32 h-24">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                className={`absolute inset-0 w-32 h-24 rounded-lg border-2 ${detectionConfidence > 0.6 && state === StudyState.FOCUS ? 'border-red-500 animate-pulse shadow-lg shadow-red-500' : 'border-pink-300'} object-cover transform transition-all hover:scale-125 origin-top-right ${state === StudyState.FAILED ? 'grayscale opacity-30' : ''}`} 
              />
              {/* Detection visualization using HTML divs */}
              {detectedObjects.map((obj: any, idx: number) => {
                const videoWidth = 128; // matches w-32
                const videoHeight = 96; // matches h-24
                
                return (
                  <div
                    key={idx}
                    className="absolute border-2 pointer-events-none"
                    style={{
                      left: `${obj.x * videoWidth}px`,
                      top: `${obj.y * videoHeight}px`,
                      width: `${obj.width * videoWidth}px`,
                      height: `${obj.height * videoHeight}px`,
                      borderColor: obj.type === 'mobile_device' ? '#ff0000' : '#00ff00',
                      backgroundColor: obj.type === 'mobile_device' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)',
                    }}
                  >
                  <div className="absolute -top-4 left-0 text-[8px] font-bold px-1" style={{
                    backgroundColor: obj.type === 'mobile_device' ? '#ff0000' : '#00ff00',
                    color: '#000',
                  }}>
                    {obj.type.replace('mobile_device', 'PHONE').replace('_', ' ')} {(obj.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                );
              })}
              {/* Debug info */}
              <div className="absolute bottom-0 left-0 text-[8px] bg-black text-white p-1 font-mono z-30">
                Objects: {detectedObjects.length}
              </div>
              {/* Camera box overlay with tracking info */}
              <div className="absolute inset-0 rounded-lg p-1 flex flex-col justify-between text-[6px] bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="text-white font-bold leading-tight">
                  <div className="text-[7px]">{trackingMethod}</div>
                </div>
                <div className="text-white/80 font-mono leading-tight text-right">
                  <div>Conf: {(detectionConfidence * 100).toFixed(0)}%</div>
                  <div>T: {totalDetections}</div>
                  <div>P: {phoneDetectionCount}</div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-1 text-[8px] bg-pink-200 text-pink-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{trackingMethod.split(' ')[0]}</div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="fixed bottom-4 left-0 right-0 text-center text-pink-600 font-bold text-lg opacity-60">
        FOCUS TO KEEP THEM ALIVE • PIXEL PET ACADEMY
      </div>
    </div>
  );
};

export default App;
