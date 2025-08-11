'use client';

import { useState, useEffect } from 'react';
import { Search, Play, Youtube, Filter, TrendingUp, Eye, Users, Settings, Key, CheckCircle, XCircle, X } from 'lucide-react';
import { VideoData } from '@/lib/youtube';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    if (score > 10) return 'text-emerald-600 bg-emerald-50';
    if (score > 1) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getPerformanceLabel = (score: number) => {
    if (score > 10) return '🔥 HOT';
    if (score > 1) return '👍 양호';
    return '📉 저조';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 헤더 */}
        <div className="text-center mb-12 relative">
          {/* API 키 설정 버튼 */}
          <div className="absolute top-0 right-0">
            <button
              onClick={openApiKeyModal}
              className={`p-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 ${
                apiKeyStatus === 'valid' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-500 hover:bg-gray-600'
              } text-white`}
              title={apiKeyStatus === 'valid' ? 'API 키 설정됨' : 'API 키 설정 필요'}
            >
              {apiKeyStatus === 'valid' ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Settings className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-500 rounded-xl">
              <Youtube className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              YouTube 영상 필터 검색
            </h1>
          </div>
          <p className="text-gray-600 text-lg">원하는 조건으로 유튜브 영상을 찾고 성과를 분석해보세요</p>
          
          {/* API 키 상태 표시 */}
          <div className="mt-4">
            {apiKeyStatus === 'valid' ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                API 키 연결됨
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm">
                <XCircle className="w-4 h-4" />
                API 키 설정 필요
              </div>
            )}
          </div>
        </div>

        {/* 검색 및 필터 영역 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          {/* 검색창 */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="검색 키워드를 입력하세요 (예: 코딩, 여행, 요리)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim() || !apiKey}
              className="px-8 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 transform hover:scale-105 text-lg font-medium shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  검색중...
                </>
              ) : (
                <>
                  <Search size={20} />
                  검색하기
                </>
              )}
            </button>
          </div>

          {/* 필터 옵션 */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">상세 필터</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📹 영상 길이</label>
                <select
                  value={filters.videoDuration}
                  onChange={(e) => setFilters({...filters, videoDuration: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                >
                  <option value="any">전체</option>
                  <option value="short">숏폼 (60초 이하)</option>
                  <option value="medium">롱폼 (1-10분)</option>
                  <option value="long">핵심폼 (10분 이상)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">👥 최대 구독자수</label>
                <input
                  type="number"
                  placeholder="예: 10000"
                  value={filters.maxSubscribers}
                  onChange={(e) => setFilters({...filters, maxSubscribers: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">👁️ 최소 조회수</label>
                <input
                  type="number"
                  placeholder="예: 1000"
                  value={filters.minViews}
                  onChange={(e) => setFilters({...filters, minViews: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🎯 카테고리</label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters({...filters, categoryId: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                >
                  <option value="">전체</option>
                  <option value="10">🎵 음악</option>
                  <option value="20">🎮 게임</option>
                  <option value="24">🎬 엔터테인먼트</option>
                  <option value="27">🎓 교육</option>
                  <option value="28">💻 과학/기술</option>
                  <option value="26">💄 스타일</option>
                  <option value="17">⚽ 스포츠</option>
                  <option value="19">✈️ 여행</option>
                  <option value="22">👤 브이로그</option>
                  <option value="25">📺 뉴스/정치</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📊 결과 개수</label>
                <select
                  value={filters.maxResults}
                  onChange={(e) => setFilters({...filters, maxResults: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                >
                  <option value="10">10개</option>
                  <option value="25">25개</option>
                  <option value="50">50개</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
            <div className="flex">
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 검색 결과 */}
        {videos.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                검색 결과 ({videos.length}개)
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {videos.map((video) => (
                <div key={video.id} className="p-6 hover:bg-gray-50/50 transition-all duration-200 group">
                  <div className="flex gap-6">
                    {/* 썸네일 */}
                    <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-48 h-28 rounded-lg object-cover shadow-md"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded-md font-medium">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                    
                    {/* 콘텐츠 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg line-clamp-2 group-hover:text-red-600 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 mb-3 font-medium">{video.channelTitle}</p>
                      
                      {/* 통계 정보 */}
                      <div className="flex flex-wrap gap-4 mb-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span className="font-medium">{formatNumber(video.viewCount)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{formatNumber(video.subscriberCount)}</span>
                        </div>
                      </div>

                      {/* 성과율 */}
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${getPerformanceColor(video.performanceScore)}`}>
                          {getPerformanceLabel(video.performanceScore)} {video.performanceScore.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    {/* 액션 버튼 */}
                    <div className="flex items-center">
                      <a
                        href={`https://youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                        title="YouTube에서 보기"
                      >
                        <Play size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && !error && videos.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 키워드로 검색해보세요</p>
          </div>
        )}

        {/* API 키 설정 모달 */}
        {showApiKeyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Key className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">YouTube API 키 설정</h2>
                </div>
                <button
                  onClick={closeApiKeyModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API 키
                  </label>
                  <input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="YouTube Data API v3 키를 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>

                {/* API 키 상태 표시 */}
                {apiKeyStatus === 'valid' && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">API 키가 유효합니다!</span>
                  </div>
                )}

                {apiKeyStatus === 'invalid' && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">API 키가 유효하지 않습니다</span>
                  </div>
                )}

                {/* API 키 발급 안내 */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">📝 API 키 발급 방법</h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li><a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a> 접속</li>
                    <li>새 프로젝트 생성 또는 기존 프로젝트 선택</li>
                    <li>YouTube Data API v3 활성화</li>
                    <li>API 키 생성 후 복사하여 붙여넣기</li>
                  </ol>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={testApiKey}
                    disabled={!tempApiKey.trim() || testingApiKey}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                  >
                    {testingApiKey ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        테스트 중...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        테스트
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={saveApiKey}
                    disabled={apiKeyStatus !== 'valid'}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
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