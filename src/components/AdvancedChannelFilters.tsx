import { SearchType } from '@/lib/types';
import { Search, Filter, Calendar } from 'lucide-react';

interface AdvancedChannelFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  countryFilter: string;
  setCountryFilter: (country: string) => void;
  dateRangeFilter: string;
  setDateRangeFilter: (range: string) => void;
  minSubscribers: string;
  setMinSubscribers: (min: string) => void;
  maxSubscribers: string;
  setMaxSubscribers: (max: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export default function AdvancedChannelFilters({
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  countryFilter,
  setCountryFilter,
  dateRangeFilter,
  setDateRangeFilter,
  minSubscribers,
  setMinSubscribers,
  maxSubscribers,
  setMaxSubscribers,
  onSearch,
  loading = false
}: AdvancedChannelFiltersProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const countries = [
    { code: '', name: '모든 국가', flag: '🌍' },
    { code: 'KR', name: '대한민국', flag: '🇰🇷' },
    { code: 'US', name: '미국', flag: '🇺🇸' },
    { code: 'JP', name: '일본', flag: '🇯🇵' },
    { code: 'CN', name: '중국', flag: '🇨🇳' },
    { code: 'GB', name: '영국', flag: '🇬🇧' },
    { code: 'DE', name: '독일', flag: '🇩🇪' },
    { code: 'FR', name: '프랑스', flag: '🇫🇷' },
    { code: 'IN', name: '인도', flag: '🇮🇳' },
    { code: 'BR', name: '브라질', flag: '🇧🇷' },
    { code: 'CA', name: '캐나다', flag: '🇨🇦' },
  ];

  const dateRanges = [
    { value: '', label: '전체 기간' },
    { value: '1m', label: '1개월 이내' },
    { value: '3m', label: '3개월 이내' },
    { value: '6m', label: '6개월 이내' },
    { value: '1y', label: '1년 이내' },
    { value: '2y', label: '2년 이내' },
    { value: '3y', label: '3년 이내' },
  ];

  return (
    <div className="neo-glass cyber-border rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] p-6 mb-6 backdrop-blur-xl">
      {/* 검색 섹션 */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="채널명, 카테고리, 제목으로 검색..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as SearchType)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white text-sm min-w-24"
          >
            <option value="channel">채널명</option>
            <option value="category">카테고리</option>
            <option value="title">제목</option>
          </select>
          
          <button
            onClick={onSearch}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-cyan-400/20"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                검색중...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                검색
              </>
            )}
          </button>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="border-t border-gray-600/30 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-cyan-200">고급 필터</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* 국가 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              국가
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white text-sm"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* 개설 기간 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-3 h-3 inline mr-1" />
              개설 기간
            </label>
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white text-sm"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* 최소 구독자 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              최소 구독자
            </label>
            <input
              type="number"
              value={minSubscribers}
              onChange={(e) => setMinSubscribers(e.target.value)}
              placeholder="1000"
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white text-sm"
            />
          </div>

          {/* 최대 구독자 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              최대 구독자
            </label>
            <input
              type="number"
              value={maxSubscribers}
              onChange={(e) => setMaxSubscribers(e.target.value)}
              placeholder="1000000"
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white text-sm"
            />
          </div>

          {/* 초기화 버튼 */}
          <div className="sm:col-span-2 lg:col-span-2 flex items-end">
            <button
              onClick={() => {
                setCountryFilter('');
                setDateRangeFilter('');
                setMinSubscribers('');
                setMaxSubscribers('');
              }}
              className="w-full bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600/50 transition-colors text-sm border border-gray-600/50"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}