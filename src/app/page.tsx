'use client';

import { useState, useEffect } from 'react';
import { Search, Play, Youtube, Settings, Key, CheckCircle, XCircle, X, TrendingUp, Clock, Eye, Users, Filter, Sparkles, ArrowUpDown, ChevronDown, Zap } from 'lucide-react';
import { VideoData } from '@/lib/youtube';

type SortField = 'performanceScore' | 'viewCount' | 'subscriberCount' | 'title';
type SortOrder = 'asc' | 'desc';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [sortedVideos, setSortedVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState<SortField>('performanceScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState({
    videoDuration: 'any',
    maxSubscribers: '',
    minViews: '',
    categoryId: '',
    maxResults: '50',
  });

  // API 키 관련 상태
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'none' | 'valid' | 'invalid'>('none');
  const [testingApiKey, setTestingApiKey] = useState(false);

  // 로컬 스토리지에서 API 키 로드
  useEffect(() => {
    const savedApiKey = localStorage.getItem('youtube-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setApiKeyStatus('valid'); // 저장된 키가 있으면 유효하다고 가정
    }
  }, []);

  // 비디오 정렬 처리
  useEffect(() => {
    const sorted = [...videos].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    setSortedVideos(sorted);
  }, [videos, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    if (!apiKey) {
      setError('YouTube API 키가 설정되지 않았습니다. 설정 버튼을 눌러 API 키를 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setError('');
    setVideos([]);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          apiKey: apiKey,
          ...filters,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setVideos(data.videos || []);
        if (data.videos?.length === 0) {
          setError('검색 결과가 없습니다. 다른 키워드를 시도해보세요.');
        }
      } else {
        setError(data.error || '검색 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
    setLoading(false);
  };

  const testApiKey = async () => {
    if (!tempApiKey.trim()) return;
    
    setTestingApiKey(true);
    try {
      const response = await fetch('/api/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: tempApiKey.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setApiKeyStatus('valid');
      } else {
        setApiKeyStatus('invalid');
        setError(data.error);
      }
    } catch (error) {
      console.error('API 키 테스트 오류:', error);
      setApiKeyStatus('invalid');
      setError('API 키 테스트 중 오류가 발생했습니다.');
    }
    setTestingApiKey(false);
  };

  const saveApiKey = () => {
    if (apiKeyStatus === 'valid' && tempApiKey.trim()) {
      localStorage.setItem('youtube-api-key', tempApiKey.trim());
      setApiKey(tempApiKey.trim());
      setShowApiKeyModal(false);
      setTempApiKey('');
      setError('');
    }
  };

  const openApiKeyModal = () => {
    setShowApiKeyModal(true);
    setTempApiKey(apiKey);
    setApiKeyStatus(apiKey ? 'valid' : 'none');
    setError('');
  };

  const closeApiKeyModal = () => {
    setShowApiKeyModal(false);
    setTempApiKey('');
    setApiKeyStatus('none');
    setError('');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 50) return { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-700', icon: '🔥' };
    if (score >= 20) return { bg: 'from-green-500 to-emerald-600', text: 'text-green-700', icon: '✨' };
    if (score >= 10) return { bg: 'from-blue-500 to-blue-600', text: 'text-blue-700', icon: '👍' };
    if (score >= 5) return { bg: 'from-yellow-500 to-amber-500', text: 'text-yellow-700', icon: '⚡' };
    if (score >= 1) return { bg: 'from-orange-500 to-orange-600', text: 'text-orange-700', icon: '📊' };
    return { bg: 'from-gray-400 to-gray-500', text: 'text-gray-700', icon: '📉' };
  };

  const getPerformanceLabel = (score: number) => {
    if (score > 10) return '🔥 HOT';
    if (score > 1) return '👍 양호';
    return '📉 저조';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* 상단 헤더 - 애플 스타일 */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                <Youtube className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">유튜브 분석기</h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">고성능 영상 발굴 도구</p>
            </div>
          </div>
          
          {/* API 키 상태 */}
          <div className="flex items-center gap-2 sm:gap-3">
            {apiKeyStatus === 'valid' ? (
              <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">연결됨</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
                <XCircle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">API 키 필요</span>
              </div>
            )}
            
            {/* 모바일용 상태 아이콘 */}
            <div className="sm:hidden">
              {apiKeyStatus === 'valid' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-600" />
              )}
            </div>
            
            <button
              onClick={openApiKeyModal}
              className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
                apiKeyStatus === 'valid' 
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
              } hover:shadow-md`}
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* 메인 검색 섹션 */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-2 sm:mb-3">
                성과 높은 영상 찾기
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium px-4 sm:px-0">AI 기반 성과 분석으로 숨겨진 보석같은 영상을 발굴하세요</p>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-2">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <div className="flex items-center flex-1">
                    <Search className="ml-4 sm:ml-6 w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    <input
                      type="text"
                      placeholder="어떤 영상을 찾고 계신가요?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg bg-transparent focus:outline-none text-gray-900 placeholder-gray-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading || !searchQuery.trim() || !apiKey}
                    className="mx-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl sm:rounded-2xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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

        {/* 필터 섹션 - 애플스러운 카드 디자인 */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-200/50 shadow-xl p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">필터 옵션</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">영상 길이</label>
              <div className="relative">
                <select
                  value={filters.videoDuration}
                  onChange={(e) => setFilters({...filters, videoDuration: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all appearance-none cursor-pointer font-medium"
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
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">최대 구독자수</label>
              <input
                type="number"
                placeholder="예: 10000"
                value={filters.maxSubscribers}
                onChange={(e) => setFilters({...filters, maxSubscribers: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">최소 조회수</label>
              <input
                type="number"
                placeholder="예: 1000"
                value={filters.minViews}
                onChange={(e) => setFilters({...filters, minViews: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">카테고리</label>
              <div className="relative">
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters({...filters, categoryId: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all appearance-none cursor-pointer font-medium"
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
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">결과 개수</label>
              <div className="relative">
                <select
                  value={filters.maxResults}
                  onChange={(e) => setFilters({...filters, maxResults: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="10">10개</option>
                  <option value="25">25개</option>
                  <option value="50">50개</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 p-4 sm:p-6 mb-6 sm:mb-8 rounded-xl sm:rounded-2xl shadow-lg">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl flex-shrink-0">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <p className="text-sm sm:text-base text-red-800 font-semibold leading-snug">{error}</p>
            </div>
          </div>
        )}

        {/* 결과 섹션 - 애플스러운 카드 그리드 */}
        {sortedVideos.length > 0 && (
          <div className="space-y-8">
            {/* 결과 헤더 & 정렬 */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">검색 결과</h3>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">{sortedVideos.length}개의 영상을 찾았습니다</p>
                  </div>
                </div>
                
                {/* 정렬 버튼들 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-600 sm:mr-2">정렬:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSort('performanceScore')}
                      className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                        sortField === 'performanceScore'
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      성과율 {sortField === 'performanceScore' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </button>
                    <button
                      onClick={() => handleSort('viewCount')}
                      className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                        sortField === 'viewCount'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      조회수 {sortField === 'viewCount' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </button>
                    <button
                      onClick={() => handleSort('subscriberCount')}
                      className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                        sortField === 'subscriberCount'
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      구독자 {sortField === 'subscriberCount' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 영상 카드 그리드 */}
            <div className="grid gap-4 sm:gap-6">
              {sortedVideos.map((video, index) => (
                <div key={video.id} className="group bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-[1.01]">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* 썸네일 */}
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <div className="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full sm:w-48 h-48 sm:h-28 object-cover rounded-xl sm:rounded-2xl shadow-md group-hover:shadow-lg transition-shadow"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl sm:rounded-2xl transition-colors"></div>
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded-lg">
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                      </div>
                      
                      {/* 콘텐츠 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 mr-3 sm:mr-4">
                            <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                              {video.title}
                            </h4>
                            <p className="text-sm sm:text-base text-gray-600 font-medium mb-3">{video.channelTitle}</p>
                          </div>
                          <a
                            href={`https://youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-2 sm:p-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl sm:rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                          </a>
                        </div>
                        
                        {/* 통계 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-200/50">
                            <div className="flex items-center gap-2 mb-1">
                              <Eye className="w-4 h-4 text-blue-600" />
                              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">조회수</span>
                            </div>
                            <p className="text-base sm:text-lg font-bold text-blue-900">{formatNumber(video.viewCount)}</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-200/50">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-4 h-4 text-purple-600" />
                              <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">구독자</span>
                            </div>
                            <p className="text-base sm:text-lg font-bold text-purple-900">{formatNumber(video.subscriberCount)}</p>
                          </div>
                          
                          <div className={`bg-gradient-to-br ${getPerformanceColor(video.performanceScore).bg} rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg sm:col-span-1 col-span-1`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="w-4 h-4 text-white" />
                              <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">성과율</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-base sm:text-lg font-bold text-white">
                                {video.performanceScore.toFixed(1)}%
                              </p>
                              <span className="text-base sm:text-lg">
                                {getPerformanceColor(video.performanceScore).icon}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && !error && videos.length === 0 && searchQuery && (
          <div className="text-center py-12 sm:py-20">
            <div className="max-w-md mx-auto px-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg">
                <Search className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">검색 결과가 없습니다</h3>
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">다른 검색어나 필터 조건을 시도해보세요</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h4 className="font-semibold text-blue-900 mb-2">💡 검색 팁</h4>
                <ul className="text-xs sm:text-sm text-blue-800 text-left space-y-1">
                  <li>• 더 일반적인 키워드를 사용해보세요</li>
                  <li>• 필터 조건을 완화해보세요</li>
                  <li>• 영어 키워드도 시도해보세요</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* API 키 설정 모달 - 애플스러운 디자인 */}
        {showApiKeyModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 max-w-lg w-full p-4 sm:p-8 animate-in fade-in-0 zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl shadow-lg">
                    <Key className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">API 키 설정</h2>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">YouTube Data API 연결</p>
                  </div>
                </div>
                <button
                  onClick={closeApiKeyModal}
                  className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 sm:mb-3">
                    API 키 입력
                  </label>
                  <input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="YouTube Data API v3 키를 입력하세요"
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all text-base sm:text-lg font-medium"
                  />
                </div>

                {/* API 키 상태 표시 */}
                {apiKeyStatus === 'valid' && (
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl sm:rounded-2xl">
                    <div className="p-2 bg-emerald-100 rounded-xl">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-emerald-800">API 키가 유효합니다! ✨</span>
                  </div>
                )}

                {apiKeyStatus === 'invalid' && (
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl sm:rounded-2xl">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-red-800">API 키가 유효하지 않습니다</span>
                  </div>
                )}

                {/* API 키 발급 안내 */}
                <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 rounded-xl sm:rounded-2xl">
                  <h3 className="font-bold text-blue-900 mb-3 sm:mb-4 text-base sm:text-lg">📋 API 키 발급 가이드</h3>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                      <span className="font-semibold text-blue-900">
                        <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">
                          Google Cloud Console
                        </a> 접속
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                      <span className="font-semibold text-blue-900">프로젝트 생성 또는 선택</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                      <span className="font-semibold text-blue-900">YouTube Data API v3 활성화</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                      <span className="font-semibold text-blue-900">API 키 생성 후 복사하여 붙여넣기</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={testApiKey}
                    disabled={!tempApiKey.trim() || testingApiKey}
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {testingApiKey ? (
                      <>
                        <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                        테스트 중...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                        테스트
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={saveApiKey}
                    disabled={apiKeyStatus !== 'valid'}
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl sm:rounded-2xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}