
import { Video, UserCheck, BarChart3, Heart } from 'lucide-react';

type TabType = 'videos' | 'channels' | 'analysis' | 'favorites';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedChannelId: string | null;
}

export default function TabNavigation({ activeTab, setActiveTab, selectedChannelId }: TabNavigationProps) {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="max-w-3xl mx-auto">
        <div className="glass-effect rounded-3xl shadow-lg border border-white/30 p-2">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-base transition-all duration-500 group ${
                activeTab === 'videos'
                  ? 'gradient-primary text-white shadow-lg transform scale-[1.02] shadow-pink-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50 hover:scale-[1.01]'
              }`}
            >
              <Video className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                activeTab === 'videos' ? 'animate-pulse' : 'group-hover:rotate-12'
              }`} />
              영상 찾기
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-base transition-all duration-500 group ${
                activeTab === 'channels'
                  ? 'gradient-primary text-white shadow-lg transform scale-[1.02] shadow-pink-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50 hover:scale-[1.01]'
              }`}
            >
              <UserCheck className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                activeTab === 'channels' ? 'animate-pulse' : 'group-hover:rotate-12'
              }`} />
              채널 찾기
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-4 sm:py-5 rounded-2xl font-bold text-xs sm:text-base transition-all duration-500 group ${
                activeTab === 'analysis'
                  ? 'gradient-primary text-white shadow-lg transform scale-[1.02] shadow-pink-200'
                  : selectedChannelId
                    ? 'text-gray-600 hover:text-gray-800 hover:bg-white/50 hover:scale-[1.01]'
                    : 'text-gray-400 cursor-not-allowed opacity-50'
              }`}
              disabled={!selectedChannelId}
            >
              <BarChart3 className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                activeTab === 'analysis' ? 'animate-pulse' : selectedChannelId ? 'group-hover:rotate-12' : ''
              }`} />
              <span className="hidden sm:inline">채널 분석</span>
              <span className="sm:hidden">분석</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-4 sm:py-5 rounded-2xl font-bold text-xs sm:text-base transition-all duration-500 group ${
                activeTab === 'favorites'
                  ? 'gradient-primary text-white shadow-lg transform scale-[1.02] shadow-pink-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50 hover:scale-[1.01]'
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
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
