
import { Search, Zap } from 'lucide-react';

type TabType = 'videos' | 'channels' | 'analysis' | 'favorites';

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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text-primary mb-2 sm:mb-3">
                성과 높은 영상 찾기 ✨
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium px-4 sm:px-0">AI 기반 성과 분석으로 숨겨진 보석같은 영상을 발굴하세요</p>
            </>
          )}
          {activeTab === 'channels' && (
            <>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text-primary mb-2 sm:mb-3">
                성장 가능성 채널 찾기 🚀
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium px-4 sm:px-0">데이터 분석으로 성장 잠능이 높은 채널을 발굴하세요</p>
            </>
          )}
          {activeTab === 'analysis' && (
            <>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text-secondary mb-2 sm:mb-3">
                채널 상세 분석 📊
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium px-4 sm:px-0">채널의 성과와 트렌드를 상세하게 분석합니다</p>
            </>
          )}
          {activeTab === 'favorites' && (
            <>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text-primary mb-2 sm:mb-3">
                즐겨찾기 목록 💖
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium px-4 sm:px-0">내가 저장한 소중한 영상들을 모아보세요</p>
            </>
          )}
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 gradient-primary rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
          <div className="relative glass-effect rounded-3xl shadow-lg border border-white/30 p-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
              <div className="flex items-center flex-1">
                <Search className="ml-4 sm:ml-6 w-5 h-5 sm:w-6 sm:h-6 text-pink-400 group-hover:text-pink-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'videos' 
                      ? "어떤 영상을 찾고 계신가요? ✨"
                      : activeTab === 'channels'
                      ? "어떤 채널을 찾고 계신가요? 🚀"
                      : "채널을 선택해주세요"
                  }
                  value={currentSearchQuery}
                  onChange={(e) => setCurrentSearchQuery(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-4 sm:py-5 text-base sm:text-lg bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 font-medium"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={activeTab === 'analysis'}
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loading || !currentSearchQuery.trim() || !apiKey}
                className="btn-gradient mx-2 px-6 sm:px-8 py-4 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm sm:text-base hover:scale-105 transition-all duration-300"
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
