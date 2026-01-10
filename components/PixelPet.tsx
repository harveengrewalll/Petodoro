
import React from 'react';
import { StudyState, PetType, UserExpression } from '../types';

interface PixelPetProps {
  state: StudyState;
  type: PetType;
  isEating?: boolean;
  expression?: UserExpression;
}

const PixelPet: React.FC<PixelPetProps> = ({ state, type, isEating = false, expression = 'neutral' }) => {
  const isDead = state === StudyState.FAILED;
  const isStudying = state === StudyState.FOCUS;
  
  const renderEars = () => {
    switch (type) {
      case PetType.BUNNY:
        return (
          <div className="flex justify-center gap-4 -mb-2">
            <div className={`w-6 h-12 bg-pink-300 rounded-full border-4 border-pink-600 origin-bottom transform ${isStudying ? '-rotate-12' : 'rotate-0'}`}>
               <div className="w-2 h-6 bg-pink-200 rounded-full mx-auto mt-2" />
            </div>
            <div className={`w-6 h-12 bg-pink-300 rounded-full border-4 border-pink-600 origin-bottom transform ${isStudying ? 'rotate-12' : 'rotate-0'}`}>
               <div className="w-2 h-6 bg-pink-200 rounded-full mx-auto mt-2" />
            </div>
          </div>
        );
      case PetType.PIG:
        return (
          <div className="flex justify-center gap-12 -mb-2">
            <div className={`w-8 h-6 bg-pink-300 border-4 border-pink-600 rounded-t-lg transform -rotate-12`} />
            <div className={`w-8 h-6 bg-pink-300 border-4 border-pink-600 rounded-t-lg transform rotate-12`} />
          </div>
        );
      case PetType.SLIME:
        return <div className="h-6" />;
      default:
        return null;
    }
  };

  const renderFeatures = () => {
    return (
      <div className="relative w-28 h-24 bg-pink-400 rounded-[50px] border-4 border-pink-700 flex flex-col items-center justify-center overflow-visible">
        {/* Eyes */}
        <div className="flex gap-8 mb-2">
          {isDead ? (
            <>
              <div className="text-pink-900 font-bold text-xl">X</div>
              <div className="text-pink-900 font-bold text-xl">X</div>
            </>
          ) : isEating || expression === 'smile' ? (
            <>
              <div className="text-pink-900 font-bold text-lg">^</div>
              <div className="text-pink-900 font-bold text-lg">^</div>
            </>
          ) : expression === 'wink' ? (
            <>
              <div className="text-pink-900 font-bold text-lg">^</div>
              <div className="w-3 h-1 bg-pink-900 mt-2" />
            </>
          ) : (
            <>
              <div className={`w-3 h-3 bg-pink-900 rounded-full ${isStudying ? 'animate-pulse' : ''}`} />
              <div className={`w-3 h-3 bg-pink-900 rounded-full ${isStudying ? 'animate-pulse' : ''}`} />
            </>
          )}
        </div>
        
        {/* Mouth/Nose/Tongue */}
        <div className="relative flex flex-col items-center">
          {type === PetType.PIG ? (
            <div className="w-10 h-6 bg-pink-300 border-2 border-pink-600 rounded-full flex justify-center items-center gap-2">
              <div className="w-1.5 h-1.5 bg-pink-700 rounded-full" />
              <div className="w-1.5 h-1.5 bg-pink-700 rounded-full" />
            </div>
          ) : isEating ? (
             <div className="w-4 h-2 bg-pink-700 rounded-full animate-pulse" />
          ) : expression === 'smile' ? (
             <div className="w-6 h-3 border-b-4 border-pink-700 rounded-full" />
          ) : (
            <div className="w-2 h-2 bg-pink-600 rounded-full" />
          )}

          {/* Tongue Mimicry */}
          {!isDead && expression === 'tongue_out' && (
            <div className="absolute -bottom-4 w-4 h-6 bg-red-400 border-2 border-red-600 rounded-b-full animate-bounce z-10" />
          )}
        </div>
        
        {/* Blush */}
        {!isDead && (
          <div className="absolute w-full flex justify-between px-4 mt-2">
            <div className="w-3 h-2 bg-pink-200 rounded-full opacity-60" />
            <div className="w-3 h-2 bg-pink-200 rounded-full opacity-60" />
          </div>
        )}

        {/* Slime specific details */}
        {type === PetType.SLIME && (
            <div className="absolute top-2 right-4 w-4 h-2 bg-white/40 rounded-full rotate-45" />
        )}

        {/* Study Accessory */}
        {isStudying && !isDead && (
          <div className="absolute -bottom-4 right-0 w-12 h-8 bg-white border-2 border-pink-700 rounded-sm transform rotate-12 flex items-center justify-center overflow-hidden">
             <div className="w-full h-[2px] bg-pink-100 my-[2px]" />
             <div className="w-full h-[2px] bg-pink-100 my-[2px]" />
          </div>
        )}

        {/* Eating Snack Animation */}
        {isEating && (
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 animate-[ping_1.5s_infinite] text-2xl">
             🥕
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative transition-all duration-500 ${isDead ? 'opacity-50 grayscale' : 'opacity-100'}`}>
      
      {/* Floating Hearts when eating or happy */}
      {(isEating || expression === 'smile') && (
        <>
          <div className="absolute -top-10 left-0 text-red-400 animate-bounce text-xl">❤️</div>
          <div className="absolute -top-16 right-0 text-red-400 animate-bounce delay-100 text-xl">❤️</div>
          <div className="absolute -top-12 left-1/2 text-red-400 animate-bounce delay-200 text-xl">❤️</div>
        </>
      )}

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-pink-900/20 rounded-full blur-sm" />
      <div className={`relative w-32 h-32 flex flex-col items-center ${!isDead && (isEating ? 'animate-ping' : 'animate-bounce')}`}>
        {renderEars()}
        {renderFeatures()}
        
        {/* Tails */}
        {type === PetType.BUNNY && <div className="absolute bottom-4 -right-2 w-6 h-6 bg-pink-400 border-4 border-pink-700 rounded-full" />}
        {type === PetType.PIG && (
          <div className="absolute bottom-6 -right-3 w-4 h-4 border-t-4 border-r-4 border-pink-700 rounded-full transform rotate-45" />
        )}
      </div>

      {isDead && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-pink-700 font-bold text-2xl animate-bounce whitespace-nowrap">
          GHOST MODE
        </div>
      )}
    </div>
  );
};

export default PixelPet;
