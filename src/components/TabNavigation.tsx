
import { Video, UserCheck, BarChart3, Heart, TrendingUp } from 'lucide-react';
import { TabType } from '@/lib/types';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedChannelId: string | null;
}

export default function TabNavigation({ activeTab, setActiveTab, selectedChannelId }: TabNavigationProps) {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="max-w-3xl mx-auto">
        <div className="relative neo-glass holographic-effect rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-blue-400/20 p-2">
          {/* Cyberpunk Border Animation */}
          <div className="absolute inset-0 rounded-3xl morphing-gradient opacity-15"></div>
          
          <div className="relative z-10 flex gap-1">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5 rounded-2xl font-black text-sm sm:text-base transition-all duration-500 group card-3d ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-[0_8px_25px_rgba(59,130,246,0.4)] transform scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/30 hover:scale-[1.01]'
              }`}
            >
              <Video className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                activeTab === 'videos' ? 'animate-pulse' : 'group-hover:rotate-12'
              }`} />
              영상 찾기
            </button>
            <button
              onClick={() => setActiveTab('channel-analysis')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-4 sm:py-5 rounded-2xl font-black text-xs sm:text-sm transition-all duration-500 group card-3d ${
                activeTab === 'channel-analysis'
                  ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-[0_8px_25px_rgba(249,115,22,0.4)] transform scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/30 hover:scale-[1.01]'
              }`}
            >
              <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                activeTab === 'channel-analysis' ? 'animate-pulse' : 'group-hover:rotate-12'
              }`} />
              <span className="hidden sm:inline">채널 분석</span>
              <span className="sm:hidden">채널</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-4 sm:py-5 rounded-2xl font-black text-xs sm:text-sm transition-all duration-500 group card-3d ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-[0_8px_25px_rgba(244,63,94,0.4)] transform scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/30 hover:scale-[1.01]'
              }`}
            >
              <Heart className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                activeTab === 'favorites' ? 'animate-pulse fill-current' : 'group-hover:rotate-12 group-hover:fill-current'
              }`} />
              <span className="hidden sm:inline">즐겨찾기</span>
              <span className="sm:hidden">즐겨</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
