'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Maximize2, Minimize2, Grid } from 'lucide-react';

interface ResponsiveViewSliderProps {
  cardScale: number;
  setCardScale: (scale: number) => void;
}

export default function ResponsiveViewSlider({ cardScale, setCardScale }: ResponsiveViewSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    updateScale(e);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateScale(e);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const updateScale = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, 1 - (y / rect.height)));
    const newScale = 0.7 + (percentage * 0.6); // 0.7 to 1.3
    setCardScale(Number(newScale.toFixed(2)));
  };

  // Mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getSliderPosition = () => {
    const percentage = (cardScale - 0.7) / 0.6;
    return `${(1 - percentage) * 100}%`;
  };

  return (
    <div
      className="fixed left-2 top-1/2 transform -translate-y-1/2 z-[9999]"
      style={{ transform: 'translateY(-50%) scale(1)', transformOrigin: 'left center' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* 슬라이더 힌트 탭 */}
      <div 
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-2 py-6 rounded-r-xl shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_8px_35px_rgba(16,185,129,0.6)] transition-all duration-300 cursor-pointer card-3d ${
          isVisible ? 'translate-x-0' : '-translate-x-6'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <Grid className="w-4 h-4" />
          <div className="writing-mode-vertical text-xs font-black tracking-wider" style={{writingMode: 'vertical-rl'}}>
            사이즈
          </div>
        </div>
      </div>

      {/* 메인 슬라이더 */}
      <div
        className={`absolute left-12 top-1/2 transform -translate-y-1/2 w-12 h-80 transition-all duration-300 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
        }`}
      >
        <div className="relative w-full h-full neo-glass holographic-effect rounded-2xl border border-emerald-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3">
          {/* Cyberpunk Border Animation */}
          <div className="absolute inset-0 rounded-2xl morphing-gradient opacity-20"></div>
          
          <div className="relative z-10 h-full flex flex-col items-center">
            {/* 상단 아이콘 */}
            <Maximize2 className="w-4 h-4 text-emerald-400 mb-2" />
            
            {/* 슬라이더 트랙 */}
            <div 
              ref={sliderRef}
              className="flex-1 w-2 bg-gray-600/30 rounded-full relative cursor-pointer"
              onMouseDown={handleMouseDown}
            >
              {/* 슬라이더 그라디언트 배경 */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-full opacity-30"></div>
              
              {/* 슬라이더 핸들 */}
              <div
                className="absolute w-6 h-6 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-full shadow-[0_4px_15px_rgba(16,185,129,0.6)] border-2 border-white/20 transform -translate-x-2 -translate-y-3 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform duration-200"
                style={{ top: getSliderPosition() }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 to-blue-500 animate-pulse"></div>
              </div>
            </div>
            
            {/* 하단 아이콘 */}
            <Minimize2 className="w-4 h-4 text-emerald-400 mt-2" />
            
            {/* 스케일 표시 */}
            <div className="mt-3 px-2 py-1 bg-gray-800/80 rounded-lg border border-emerald-400/30">
              <span className="text-xs font-bold text-emerald-300">
                {Math.round(cardScale * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}