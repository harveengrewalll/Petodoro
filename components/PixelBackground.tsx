
import React from 'react';

const PixelBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#fce4ec] overflow-hidden">
      {/* Floor */}
      <div className="absolute bottom-0 w-full h-1/3 bg-[#f8bbd0] border-t-8 border-[#f48fb1]" />
      
      {/* Window */}
      <div className="absolute top-20 right-20 w-48 h-64 bg-[#b3e5fc] border-8 border-[#f48fb1] pixel-border">
        {/* Sky gradient/pixel clouds */}
        <div className="relative w-full h-full overflow-hidden">
           <div className="absolute top-4 left-4 w-12 h-4 bg-white opacity-80" />
           <div className="absolute top-10 right-4 w-16 h-6 bg-white opacity-60" />
        </div>
      </div>

      {/* Desk */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-[#8d6e63] border-4 border-[#5d4037] pixel-border" />
      
      {/* Lamp */}
      <div className="absolute bottom-[28%] left-[20%] w-16 h-40 flex flex-col items-center">
         <div className="w-12 h-8 bg-pink-100 border-4 border-pink-300 rounded-t-lg" />
         <div className="w-2 h-24 bg-gray-400" />
         <div className="w-12 h-4 bg-gray-500 rounded-full" />
      </div>

      {/* Aesthetic Dots */}
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-2 h-2 bg-pink-200" 
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            opacity: 0.3
          }} 
        />
      ))}
    </div>
  );
};

export default PixelBackground;
