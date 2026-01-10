
import React from 'react';
import { StudyState } from '../types';

interface BunnyPetProps {
  state: StudyState;
}

const BunnyPet: React.FC<BunnyPetProps> = ({ state }) => {
  const isDead = state === StudyState.FAILED;
  const isStudying = state === StudyState.FOCUS;
  
  return (
    <div className={`relative transition-all duration-500 ${isDead ? 'opacity-50 grayscale' : 'opacity-100'}`}>
      {/* Bunny Shadow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-pink-900/20 rounded-full blur-sm" />
      
      {/* Bunny Body */}
      <div className={`relative w-32 h-32 flex flex-col items-center ${!isDead && 'animate-bounce'}`}>
        {/* Ears */}
        <div className="flex justify-center gap-4 -mb-2">
          <div className={`w-6 h-12 bg-pink-300 rounded-full border-4 border-pink-600 origin-bottom transform ${isStudying ? '-rotate-12' : 'rotate-0'}`}>
             <div className="w-2 h-6 bg-pink-200 rounded-full mx-auto mt-2" />
          </div>
          <div className={`w-6 h-12 bg-pink-300 rounded-full border-4 border-pink-600 origin-bottom transform ${isStudying ? 'rotate-12' : 'rotate-0'}`}>
             <div className="w-2 h-6 bg-pink-200 rounded-full mx-auto mt-2" />
          </div>
        </div>
        
        {/* Main Body (Jelly Circle) */}
        <div className="relative w-28 h-24 bg-pink-400 rounded-[50px] border-4 border-pink-700 flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex gap-8 mb-2">
            {isDead ? (
              <>
                <div className="text-pink-900 font-bold text-xl">X</div>
                <div className="text-pink-900 font-bold text-xl">X</div>
              </>
            ) : (
              <>
                <div className={`w-3 h-3 bg-pink-900 rounded-full ${isStudying ? 'animate-pulse' : ''}`} />
                <div className={`w-3 h-3 bg-pink-900 rounded-full ${isStudying ? 'animate-pulse' : ''}`} />
              </>
            )}
          </div>
          
          {/* Mouth/Nose */}
          <div className="w-2 h-2 bg-pink-600 rounded-full" />
          
          {/* Blush */}
          {!isDead && (
            <div className="absolute w-full flex justify-between px-4 mt-2">
              <div className="w-3 h-2 bg-pink-200 rounded-full opacity-60" />
              <div className="w-3 h-2 bg-pink-200 rounded-full opacity-60" />
            </div>
          )}

          {/* If studying, show a little book */}
          {isStudying && !isDead && (
            <div className="absolute -bottom-4 right-0 w-12 h-8 bg-white border-2 border-pink-700 rounded-sm transform rotate-12 flex items-center justify-center overflow-hidden">
               <div className="w-full h-[2px] bg-pink-100 my-[2px]" />
               <div className="w-full h-[2px] bg-pink-100 my-[2px]" />
            </div>
          )}
        </div>

        {/* Tail (invisible from front mostly) */}
        <div className="absolute bottom-4 -right-2 w-6 h-6 bg-pink-400 border-4 border-pink-700 rounded-full" />
      </div>

      {isDead && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-pink-700 font-bold text-2xl animate-bounce">
          GHOST MODE
        </div>
      )}
    </div>
  );
};

export default BunnyPet;
