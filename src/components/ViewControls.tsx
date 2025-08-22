'use client';

import { useState } from 'react';
import { Grid3x3, Grid2x2, LayoutGrid, ArrowUpDown, Sliders, Maximize2, Minimize2 } from 'lucide-react';
import { SortField, SortOrder } from '@/lib/types';

export type ViewSize = 'small' | 'medium' | 'large';

interface ViewControlsProps {
  viewSize: ViewSize;
  setViewSize: (size: ViewSize) => void;
  cardScale: number;
  setCardScale: (scale: number) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  handleSort: (field: SortField) => void;
  activeTab: string;
}

export default function ViewControls({
  viewSize,
  setViewSize,
  cardScale,
  setCardScale,
  sortField,
  sortOrder,
  handleSort,
  activeTab
}: ViewControlsProps) {
  const [showControls, setShowControls] = useState(false);

  const viewSizes = [
    { id: 'small' as ViewSize, icon: Grid3x3, label: '작게' },
    { id: 'medium' as ViewSize, icon: Grid2x2, label: '중간' },
    { id: 'large' as ViewSize, icon: LayoutGrid, label: '크게' }
  ];

  const sortOptions = activeTab === 'videos' ? [
    { field: 'performanceScore' as SortField, label: '성과율' },
    { field: 'viewCount' as SortField, label: '조회수' },
    { field: 'publishedAt' as SortField, label: '날짜' },
    { field: 'title' as SortField, label: '제목' }
  ] : [
    { field: 'subscriberCount' as SortField, label: '구독자' },
    { field: 'viewCount' as SortField, label: '조회수' },
    { field: 'title' as SortField, label: '제목' }
  ];

  return (
    <>
      {/* Floating Control Toggle Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => {
            console.log('ViewControls button clicked!', showControls);
            setShowControls(!showControls);
          }}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-[0_12px_40px_rgba(59,130,246,0.6)] hover:shadow-[0_16px_50px_rgba(59,130,246,0.8)] transition-all duration-300 hover:scale-110 flex items-center justify-center pulse-glow border-2 border-white/20 cursor-pointer"
        >
          <Sliders className="w-7 h-7 pointer-events-none" />
        </button>
        
        {/* 툴팁 */}
        <div className="absolute bottom-full right-0 mb-3 px-3 py-1 bg-black/90 text-white text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          뷰 컨트롤
        </div>
      </div>

      {/* Floating Control Panel */}
      {showControls && (
        <div className="fixed bottom-24 right-6 z-[9998] neo-glass holographic-effect rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] min-w-80 border border-blue-400/30">
          {/* Cyberpunk Border Animation */}
          <div className="absolute inset-0 rounded-3xl morphing-gradient opacity-20"></div>
          
          <div className="relative z-10 space-y-6">
            {/* View Size Controls */}
            <div>
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                뷰 사이즈
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {viewSizes.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setViewSize(id)}
                    className={`p-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${
                      viewSize === id
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-[0_8px_25px_rgba(59,130,246,0.4)]'
                        : 'bg-gray-600/30 text-gray-300 hover:bg-gray-500/30 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fine Scale Control */}
            <div>
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                미세 조절
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Minimize2 className="w-4 h-4 text-gray-400" />
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.05"
                    value={cardScale}
                    onChange={(e) => setCardScale(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3B82F6 0%, #8B5CF6 ${((cardScale - 0.7) / 0.6) * 100}%, #374151 ${((cardScale - 0.7) / 0.6) * 100}%, #374151 100%)`
                    }}
                  />
                  <Maximize2 className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full">
                    {Math.round(cardScale * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Sort Controls */}
            <div>
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                정렬
              </h4>
              <div className="space-y-2">
                {sortOptions.map(({ field, label }) => (
                  <button
                    key={field}
                    onClick={() => handleSort(field)}
                    className={`w-full p-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
                      sortField === field
                        ? 'bg-gradient-to-br from-emerald-500 to-blue-600 text-white shadow-[0_8px_25px_rgba(16,185,129,0.4)]'
                        : 'bg-gray-600/30 text-gray-300 hover:bg-gray-500/30 hover:text-white'
                    }`}
                  >
                    <span className="font-medium">{label}</span>
                    {sortField === field && (
                      <ArrowUpDown className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform duration-300`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showControls && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9997]"
          onClick={() => setShowControls(false)}
        />
      )}
    </>
  );
}