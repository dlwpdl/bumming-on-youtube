import { useState } from 'react';
import { X, Search, Filter, Calendar, Clock, Eye, Users, Video, Hash } from 'lucide-react';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (params: any) => void;
  initialQuery?: string;
}

export default function AdvancedSearchModal({ 
  isOpen, 
  onClose, 
  onSearch, 
  initialQuery = '' 
}: AdvancedSearchModalProps) {
  const { 
    filters, 
    updateFilter, 
    resetFilters, 
    buildApiParams, 
    hasActiveFilters 
  } = useAdvancedSearch();

  const [includeKeyword, setIncludeKeyword] = useState('');
  const [excludeKeyword, setExcludeKeyword] = useState('');

  // 초기 쿼리 설정
  if (initialQuery && filters.query !== initialQuery) {
    updateFilter('query', initialQuery);
  }

  const handleSearch = () => {
    const params = buildApiParams();
    onSearch(params);
    onClose();
  };

  const addIncludeKeyword = () => {
    if (includeKeyword.trim()) {
      updateFilter('includeKeywords', [...filters.includeKeywords, includeKeyword.trim()]);
      setIncludeKeyword('');
    }
  };

  const addExcludeKeyword = () => {
    if (excludeKeyword.trim()) {
      updateFilter('excludeKeywords', [...filters.excludeKeywords, excludeKeyword.trim()]);
      setExcludeKeyword('');
    }
  };

  const removeIncludeKeyword = (index: number) => {
    const newKeywords = filters.includeKeywords.filter((_, i) => i !== index);
    updateFilter('includeKeywords', newKeywords);
  };

  const removeExcludeKeyword = (index: number) => {
    const newKeywords = filters.excludeKeywords.filter((_, i) => i !== index);
    updateFilter('excludeKeywords', newKeywords);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto neo-glass cyber-border">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">고급 검색</h2>
            {hasActiveFilters && (
              <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full text-xs">
                필터 활성화
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 기본 검색 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              기본 검색
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  검색어
                </label>
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => updateFilter('query', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="검색할 키워드를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  정확한 구문
                </label>
                <input
                  type="text"
                  value={filters.exactPhrase}
                  onChange={(e) => updateFilter('exactPhrase', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="정확한 구문을 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 키워드 관리 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-green-400" />
              키워드 관리
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  포함할 키워드 추가
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={includeKeyword}
                    onChange={(e) => setIncludeKeyword(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="필수 키워드"
                    onKeyPress={(e) => e.key === 'Enter' && addIncludeKeyword()}
                  />
                  <button
                    onClick={addIncludeKeyword}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.includeKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    >
                      +{keyword}
                      <button
                        onClick={() => removeIncludeKeyword(index)}
                        className="hover:bg-green-500/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  제외할 키워드 추가
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={excludeKeyword}
                    onChange={(e) => setExcludeKeyword(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="제외할 키워드"
                    onKeyPress={(e) => e.key === 'Enter' && addExcludeKeyword()}
                  />
                  <button
                    onClick={addExcludeKeyword}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.excludeKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-red-600/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    >
                      -{keyword}
                      <button
                        onClick={() => removeExcludeKeyword(index)}
                        className="hover:bg-red-500/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 날짜 및 시간 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              날짜 및 시간
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  업로드 시기
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => updateFilter('dateRange', e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="any">전체 기간</option>
                  <option value="hour">1시간 이내</option>
                  <option value="today">오늘</option>
                  <option value="week">이번 주</option>
                  <option value="month">이번 달</option>
                  <option value="year">올해</option>
                  <option value="custom">사용자 지정</option>
                </select>
              </div>

              {filters.dateRange === 'custom' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      시작 날짜
                    </label>
                    <input
                      type="date"
                      value={filters.publishedAfter}
                      onChange={(e) => updateFilter('publishedAfter', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      종료 날짜
                    </label>
                    <input
                      type="date"
                      value={filters.publishedBefore}
                      onChange={(e) => updateFilter('publishedBefore', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 영상 속성 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-orange-400" />
              영상 속성
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  영상 길이
                </label>
                <select
                  value={filters.duration}
                  onChange={(e) => updateFilter('duration', e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="any">전체</option>
                  <option value="short">4분 미만</option>
                  <option value="medium">4-20분</option>
                  <option value="long">20분 초과</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  영상 품질
                </label>
                <select
                  value={filters.quality}
                  onChange={(e) => updateFilter('quality', e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="any">전체</option>
                  <option value="hd">HD</option>
                  <option value="4k">4K</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  id="captions"
                  type="checkbox"
                  checked={filters.captions}
                  onChange={(e) => updateFilter('captions', e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="captions" className="ml-2 text-sm text-gray-300">
                  자막 있는 영상만
                </label>
              </div>
            </div>
          </div>

          {/* 성과 지표 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              성과 지표
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  최소 조회수
                </label>
                <input
                  type="number"
                  value={filters.minViews || ''}
                  onChange={(e) => updateFilter('minViews', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="예: 1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  최대 조회수
                </label>
                <input
                  type="number"
                  value={filters.maxViews || ''}
                  onChange={(e) => updateFilter('maxViews', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="예: 1000000"
                />
              </div>
            </div>
          </div>

          {/* 채널 필터 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              채널 필터
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  최소 구독자 수
                </label>
                <input
                  type="number"
                  value={filters.minSubscribers || ''}
                  onChange={(e) => updateFilter('minSubscribers', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="예: 1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  최대 구독자 수
                </label>
                <input
                  type="number"
                  value={filters.maxSubscribers || ''}
                  onChange={(e) => updateFilter('maxSubscribers', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="예: 1000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            필터 초기화
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              검색
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}