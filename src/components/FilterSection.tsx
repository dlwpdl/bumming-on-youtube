
import { Filter, ChevronDown } from 'lucide-react';
import { TabType } from '@/lib/types';

interface FilterSectionProps {
  activeTab: TabType;
  filters: any;
  setFilters: (filters: any) => void;
}

export default function FilterSection({ activeTab, filters, setFilters }: FilterSectionProps) {
  return (
    <div className="neo-glass holographic-effect rounded-2xl sm:rounded-3xl border border-blue-400/30 shadow-xl p-4 sm:p-8 mb-6 sm:mb-8">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white">필터 옵션</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        {activeTab === 'videos' && (
          <>
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300">영상 길이</label>
              <div className="relative">
                <select
                  value={filters.videoDuration}
                  onChange={(e) => setFilters({...filters, videoDuration: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-800 border border-gray-600 text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="any">전체</option>
                  <option value="short">짧은 영상</option>
                  <option value="medium">보통 영상</option>
                  <option value="long">긴 영상</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300">최소 조회수</label>
              <input
                type="number"
                placeholder="예: 1000"
                value={filters.minViews}
                onChange={(e) => setFilters({...filters, minViews: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-800 border border-gray-600 text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300">카테고리</label>
              <div className="relative">
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters({...filters, categoryId: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-800 border border-gray-600 text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="">전체</option>
                  <option value="10">음악</option>
                  <option value="20">게임</option>
                  <option value="24">엔터테인먼트</option>
                  <option value="27">교육</option>
                  <option value="28">과학/기술</option>
                  <option value="26">스타일</option>
                  <option value="17">스포츠</option>
                  <option value="19">여행</option>
                  <option value="22">브이로그</option>
                  <option value="25">뉴스</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300">정렬 방식</label>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-800 border border-gray-600 text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="relevance">관련성</option>
                  <option value="date">업로드 날짜</option>
                  <option value="viewCount">조회수</option>
                  <option value="rating">평점</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300">업로드 날짜</label>
              <div className="relative">
                <select
                  value={filters.dateFilterType}
                  onChange={(e) => {
                    const newFilters = {...filters, dateFilterType: e.target.value};
                    if (e.target.value === 'none') {
                      newFilters.publishedAfter = '';
                      newFilters.publishedBefore = '';
                    }
                    setFilters(newFilters);
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-800 border border-gray-600 text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="none">전체 기간</option>
                  <option value="after">이후</option>
                  <option value="before">이전</option>
                  <option value="between">기간 범위</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'channel-analysis' && (
          <>
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300">최소 구독자수</label>
              <input
                type="number"
                placeholder="예: 1000"
                value={filters.minSubscribers}
                onChange={(e) => setFilters({...filters, minSubscribers: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-800 border border-gray-600 text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300">국가</label>
              <div className="relative">
                <select
                  value={filters.country}
                  onChange={(e) => setFilters({...filters, country: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-800 border border-gray-600 text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="">전체</option>
                  <option value="KR">한국</option>
                  <option value="US">미국</option>
                  <option value="JP">일본</option>
                  <option value="GB">영국</option>
                  <option value="CA">캐나다</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-gray-300">최대 구독자수</label>
          <input
            type="number"
            placeholder="예: 100000"
            value={filters.maxSubscribers}
            onChange={(e) => setFilters({...filters, maxSubscribers: e.target.value})}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-800 border border-gray-600 text-white rounded-lg sm:rounded-xl focus:ring-2 transition-all font-medium ${
              activeTab === 'videos' 
                ? 'focus:ring-blue-500 focus:border-blue-500' 
                : 'focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-gray-300">결과 개수</label>
          <div className="relative">
            <select
              value={filters.maxResults}
              onChange={(e) => setFilters({...filters, maxResults: e.target.value})}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-800 border border-gray-600 text-white rounded-lg sm:rounded-xl focus:ring-2 transition-all appearance-none cursor-pointer font-medium ${
                activeTab === 'videos' 
                  ? 'focus:ring-blue-500 focus:border-blue-500' 
                  : 'focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="10">10개</option>
              <option value="25">25개</option>
              <option value="50">50개</option>
            </select>
            <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      {/* 날짜 입력 필드 */}
      {activeTab === 'videos' && filters.dateFilterType !== 'none' && (
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(filters.dateFilterType === 'after' || filters.dateFilterType === 'between') && (
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300">
                {filters.dateFilterType === 'after' ? '이후 날짜' : '시작 날짜'}
              </label>
              <input
                type="date"
                value={filters.publishedAfter}
                onChange={(e) => setFilters({...filters, publishedAfter: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-800 border border-gray-600 text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          )}
          
          {(filters.dateFilterType === 'before' || filters.dateFilterType === 'between') && (
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300">
                {filters.dateFilterType === 'before' ? '이전 날짜' : '종료 날짜'}
              </label>
              <input
                type="date"
                value={filters.publishedBefore}
                onChange={(e) => setFilters({...filters, publishedBefore: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-800 border border-gray-600 text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
