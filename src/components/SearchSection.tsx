
import { Search, Zap } from 'lucide-react';
import { TabType } from '@/lib/types';

interface SearchSectionProps {
  activeTab: TabType;
  currentSearchQuery: string;
  setCurrentSearchQuery: (query: string) => void;
  handleSearch: () => void;
  loading: boolean;
  apiKey: string;
}

export default function SearchSection({ activeTab, currentSearchQuery, setCurrentSearchQuery, handleSearch, loading, apiKey }: SearchSectionProps) {
  return (
    <div className="text-center mb-8 sm:mb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          {activeTab === 'videos' && (
            <>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text mb-2 sm:mb-3">
                성과 높은 영상 찾기 ✨
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 font-bold px-4 sm:px-0">AI 기반 성과 분석으로 숨겨진 보석같은 영상을 발굴하세요</p>
            </>
          )}
          {activeTab === 'channel-analysis' && (
            <>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text mb-2 sm:mb-3">
                채널 전체 분석 🚀
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 font-bold px-4 sm:px-0">데이터 분석으로 성장 가능성이 높은 채널을 발굴하세요</p>
            </>
          )}
          {activeTab === 'favorites' && (
            <>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text mb-2 sm:mb-3">
                즐겨찾기 목록 💖
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 font-bold px-4 sm:px-0">내가 저장한 소중한 영상들을 모아보세요</p>
            </>
          )}
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 morphing-gradient rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500 pointer-events-none"></div>
          <div className="relative neo-glass holographic-effect rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-blue-400/30 p-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
              <div className="flex items-center flex-1">
                <Search className="ml-4 sm:ml-6 w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'videos' 
                      ? "어떤 영상을 찾고 계신가요? ✨"
                      : "어떤 채널을 찾고 계신가요? 🚀"
                  }
                  value={currentSearchQuery}
                  onChange={(e) => setCurrentSearchQuery(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-4 sm:py-5 text-base sm:text-lg bg-transparent focus:outline-none text-white placeholder-gray-400 font-bold"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loading || !currentSearchQuery.trim() || !apiKey}
                className="mx-2 px-6 sm:px-8 py-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed font-black text-sm sm:text-base hover:scale-105 transition-all duration-300 shadow-[0_8px_25px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_35px_rgba(59,130,246,0.6)] card-3d"
              >
                {loading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">검색중...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    검색
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
