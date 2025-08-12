
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 p-2">
          <div className="flex">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              영상 찾기
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'channels'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              채널 찾기
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base transition-all duration-300 ${
                activeTab === 'analysis'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              disabled={!selectedChannelId}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">채널 분석</span>
              <span className="sm:hidden">분석</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base transition-all duration-300 ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">즐겨찾기</span>
              <span className="sm:hidden">즐겨</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
