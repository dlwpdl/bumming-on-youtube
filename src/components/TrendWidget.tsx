'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, ChevronDown, Loader, X, BarChart3, Flame, Eye, Grid, Maximize2, Minimize2 } from 'lucide-react';
import { cache, cacheKeys } from '@/lib/cache';

interface Trend {
  title: string;
  views: string;
  growth: string;
  category?: string;
}

interface TrendWidgetProps {
  variant: 'sidebar';
  apiKey: string;
  onSearchTrend?: (keyword: string) => void;
  cardScale: number;
  setCardScale: (scale: number) => void;
}

export default function TrendWidget({ variant, apiKey, onSearchTrend, cardScale, setCardScale }: TrendWidgetProps) {
  const [selectedCountry, setSelectedCountry] = useState('KR');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 사이즈 슬라이더 관련 state
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // 사이즈 슬라이더 함수들
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    updateScale(e);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateScale(e);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const updateScale = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, 1 - (y / rect.height)));
    const newScale = 0.7 + (percentage * 0.6); // 0.7 to 1.3
    setCardScale(Number(newScale.toFixed(2)));
  };

  const getSliderPosition = () => {
    const percentage = (cardScale - 0.7) / 0.6;
    return `${(1 - percentage) * 100}%`;
  };

  // Mouse event listeners for slider
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  const [trends, setTrends] = useState<Trend[]>([
    { title: '게임 리뷰', views: '1.2M', growth: '+23%', category: '게임' },
    { title: '먹방 챌린지', views: '890K', growth: '+18%', category: '푸드' },
    { title: '뷰티 루틴', views: '670K', growth: '+15%', category: '뷰티' },
    { title: 'ASMR 영상', views: '520K', growth: '+12%', category: '라이프' },
    { title: '운동 루틴', views: '430K', growth: '+10%', category: '헬스' }
  ]);

  const countries = [
    { code: 'KR', flag: '🇰🇷', name: '한국' },
    { code: 'US', flag: '🇺🇸', name: '미국' },
    { code: 'JP', flag: '🇯🇵', name: '일본' },
    { code: 'GB', flag: '🇬🇧', name: '영국' },
    { code: 'DE', flag: '🇩🇪', name: '독일' },
    { code: 'CA', flag: '🇨🇦', name: '캐나다' },
    { code: 'AU', flag: '🇦🇺', name: '호주' },
    { code: 'NL', flag: '🇳🇱', name: '네덜란드' },
    { code: 'NO', flag: '🇳🇴', name: '노르웨이' },
    { code: 'SE', flag: '🇸🇪', name: '스웨덴' }
  ];

  const categories = [
    { id: 'all', name: '전체', icon: '🔥' },
    { id: '1', name: '영화/애니', icon: '🎬' },
    { id: '2', name: '자동차', icon: '🚗' },
    { id: '10', name: '음악', icon: '🎵' },
    { id: '15', name: '반려동물', icon: '🐱' },
    { id: '17', name: '스포츠', icon: '⚽' },
    { id: '19', name: '여행', icon: '✈️' },
    { id: '20', name: '게임', icon: '🎮' },
    { id: '22', name: '브이로그', icon: '📹' },
    { id: '23', name: '코미디', icon: '😂' },
    { id: '24', name: '엔터테인', icon: '🎭' },
    { id: '25', name: '뉴스', icon: '📰' },
    { id: '26', name: '라이프', icon: '💄' },
    { id: '27', name: '교육', icon: '📚' },
    { id: '28', name: '테크', icon: '💻' },
  ];

  const debouncedFetchTrends = (countryCode: string, categoryId: string, delay: number = 1000) => {
    // 기존 타이머가 있으면 취소
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // 새 타이머 설정
    const newTimer = setTimeout(() => {
      fetchTrends(countryCode, categoryId);
    }, delay);

    setDebounceTimer(newTimer);
  };

  const handleCountryChange = async (countryCode: string) => {
    setSelectedCountry(countryCode);
    setIsCountryDropdownOpen(false);
    
    // 즉시 로딩 상태로 변경하여 UI 반응성 향상
    setIsLoading(true);
    
    // 디바운스된 API 호출
    debouncedFetchTrends(countryCode, selectedCategory, 800);
  };

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsCategoryDropdownOpen(false);
    
    // 즉시 로딩 상태로 변경하여 UI 반응성 향상  
    setIsLoading(true);
    
    // 디바운스된 API 호출
    debouncedFetchTrends(selectedCountry, categoryId, 800);
  };

  const fetchTrends = async (countryCode: string = selectedCountry, categoryId: string = selectedCategory, skipLoadingState: boolean = false) => {
    if (!skipLoadingState) {
      setIsLoading(true);
    }

    try {
      if (!apiKey) {
        console.warn('API 키가 없습니다. 목 데이터를 사용합니다.');
        // API 키가 없으면 목 데이터 사용
        setTimeout(() => {
          const mockTrends: Trend[] = [
            { title: '🔥 실제 트렌드 보려면 API 키 설정', views: '0', growth: '+0%', category: '설정' },
            { title: '게임 리뷰 (예시)', views: '1.2M', growth: '+23%', category: '게임' },
            { title: '먹방 챌린지 (예시)', views: '890K', growth: '+18%', category: '푸드' },
            { title: '뷰티 루틴 (예시)', views: '670K', growth: '+15%', category: '뷰티' },
            { title: 'ASMR 영상 (예시)', views: '520K', growth: '+12%', category: '라이프' }
          ];
          setTrends(mockTrends);
          setLastUpdated(new Date());
          setIsLoading(false);
        }, 500);
        return;
      }

      // 캐시 키 생성
      const cacheKey = cacheKeys.trending(countryCode, categoryId === 'all' ? undefined : categoryId);
      
      // 캐시된 데이터 확인
      const cachedData = cache.get(cacheKey) as any;
      if (cachedData && cachedData.trends) {
        console.log('트렌드 캐시에서 로드:', cacheKey);
        
        const trendData = cachedData.trends.slice(0, 5).map((item: any) => ({
          title: item.title || '',
          views: (item.viewCount || 0).toLocaleString(),
          growth: `${item.performanceScore?.toFixed(1) || 0}%`,
          category: item.category || '기타'
        }));
        
        setTrends(trendData);
        setLastUpdated(new Date(cachedData.updatedAt || Date.now()));
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/trending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKey,
          regionCode: countryCode,
          categoryId: categoryId === 'all' ? undefined : categoryId,
          maxResults: 50,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 성공한 응답을 캐시에 저장
        cache.set(cacheKey, data, { ttl: 600 }); // 10분간 캐시
        
        // API 응답을 Trend 형식으로 변환
        const apiTrends: Trend[] = data.trends.slice(0, 5).map((trend: any) => ({
          title: trend.title,
          views: formatNumber(trend.viewCount),
          growth: `+${Math.round(trend.performanceScore)}%`,
          category: trend.category,
        }));

        setTrends(apiTrends);
        setLastUpdated(new Date());
      } else {
        console.error('트렌드 API 오류:', data.error);
        // 오류 시 에러 메시지 표시
        setTrends([
          { title: `❌ ${data.error}`, views: '0', growth: '+0%', category: '오류' },
          { title: 'API 키를 확인해주세요', views: '0', growth: '+0%', category: '도움말' },
          { title: '설정에서 유효한 키 입력', views: '0', growth: '+0%', category: '도움말' },
          { title: '할당량 초과 시 나중에 재시도', views: '0', growth: '+0%', category: '도움말' },
          { title: '문제 지속 시 새 API 키 생성', views: '0', growth: '+0%', category: '도움말' }
        ]);
      }
    } catch (error) {
      console.error('트렌드 가져오기 실패:', error);
      // 네트워크 오류 등
      setTrends([
        { title: '🌐 네트워크 오류가 발생했습니다', views: '0', growth: '+0%', category: '오류' },
        { title: '인터넷 연결을 확인해주세요', views: '0', growth: '+0%', category: '도움말' },
        { title: '잠시 후 다시 시도해보세요', views: '0', growth: '+0%', category: '도움말' },
        { title: '문제가 지속되면 새로고침', views: '0', growth: '+0%', category: '도움말' },
        { title: 'API 상태를 확인해보세요', views: '0', growth: '+0%', category: '도움말' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleSidebarMouseEnter = () => {
    setIsSidebarOpen(true);
    
    // 사이드바가 열릴 때 데이터 갱신 확인
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdated.getTime();
    const updateInterval = 30 * 1000; // 30초 (테스트용)
    
    // 30초 이상 지났으면 갱신 프로세스 시작
    if (timeDiff > updateInterval) {
      // 즉시 로딩 상태로 전환
      setIsLoading(true);
      
      // 1초 후에 실제 갱신 실행
      const timer = setTimeout(() => {
        fetchTrends(selectedCountry, selectedCategory, true);
      }, 1000);
      
      setHoverTimer(timer);
    }
  };

  const handleSidebarMouseLeave = () => {
    setIsSidebarOpen(false);
    
    // 마우스가 벗어나면 타이머 취소하고 로딩 상태도 취소
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
      setIsLoading(false);
    }
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}시간 전`;
  };

  const isUpdateAvailable = () => {
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdated.getTime();
    const updateInterval = 30 * 1000; // 30초
    return timeDiff > updateInterval;
  };

  const handleTrendClick = (trend: Trend) => {
    if (onSearchTrend) {
      // 트렌드 제목에서 검색에 적합한 키워드 추출
      let searchKeyword = trend.title;
      
      // 불필요한 문구 제거
      searchKeyword = searchKeyword
        .replace(/\(예시\)/g, '')
        .replace(/🔥|❌|🌐/g, '')
        .replace(/실제 트렌드 보려면 API 키 설정/g, '')
        .replace(/네트워크 오류가 발생했습니다/g, '')
        .trim();
      
      if (searchKeyword && searchKeyword.length > 0) {
        onSearchTrend(searchKeyword);
      }
    }
  };

  // cleanup 함수
  useEffect(() => {
    return () => {
      if (hoverTimer) clearTimeout(hoverTimer);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [hoverTimer, debounceTimer]);



  // Sidebar 스타일
  if (variant === 'sidebar') {
    return (
      <div 
        className="fixed right-0 top-20 h-[calc(100vh-5rem)] z-40"
        style={{ transform: 'scale(var(--scale-factor))', transformOrigin: 'right top' }}
      >
        <div className="relative h-full">
          {/* 사이드바 힌트 탭 - 항상 보이는 부분 */}
          <div 
            className="absolute -right-2 top-16 bg-gradient-to-l from-purple-500 to-purple-600 text-white px-2 py-6 rounded-l-xl shadow-[0_8px_25px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_35px_rgba(139,92,246,0.6)] hover:bg-gradient-to-l hover:from-purple-600 hover:to-purple-700 transition-all duration-300 cursor-pointer card-3d"
            onMouseEnter={handleSidebarMouseEnter}
            onMouseLeave={handleSidebarMouseLeave}
          >
            <div className="flex flex-col items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <div className="writing-mode-vertical text-xs font-black tracking-wider" style={{writingMode: 'vertical-rl'}}>
                트렌드
              </div>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isUpdateAvailable() 
                  ? 'bg-orange-400' 
                  : 'bg-green-400'
              }`}></div>
            </div>
          </div>
          
          {/* 사이즈 슬라이더 힌트 탭 */}
          <div 
            className="absolute -right-2 top-64 bg-gradient-to-l from-emerald-500 to-blue-600 text-white px-2 py-6 rounded-l-xl shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_8px_35px_rgba(16,185,129,0.6)] transition-all duration-300 cursor-pointer card-3d"
            onMouseEnter={() => setIsSliderVisible(true)}
            onMouseLeave={() => setIsSliderVisible(false)}
          >
            <div className="flex flex-col items-center gap-2">
              <Grid className="w-4 h-4" />
              <div className="writing-mode-vertical text-xs font-black tracking-wider" style={{writingMode: 'vertical-rl'}}>
                사이즈
              </div>
            </div>
          </div>
          
          {/* 사이즈 슬라이더 */}
          <div
            className={`absolute -right-12 top-56 w-12 h-80 transition-all duration-300 ${
              isSliderVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            onMouseEnter={() => setIsSliderVisible(true)}
            onMouseLeave={() => setIsSliderVisible(false)}
          >
            <div className="relative w-full h-full neo-glass holographic-effect rounded-2xl border border-emerald-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3">
              {/* Cyberpunk Border Animation */}
              <div className="absolute inset-0 rounded-2xl morphing-gradient opacity-20"></div>
              
              <div className="relative z-10 h-full flex flex-col items-center">
                {/* 상단 아이콘 */}
                <Maximize2 className="w-4 h-4 text-emerald-400 mb-2" />
                
                {/* 슬라이더 트랙 */}
                <div 
                  ref={sliderRef}
                  className="flex-1 w-2 bg-gray-600/30 rounded-full relative cursor-pointer"
                  onMouseDown={handleMouseDown}
                >
                  {/* 슬라이더 그라디언트 배경 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-full opacity-30"></div>
                  
                  {/* 슬라이더 핸들 */}
                  <div
                    className="absolute w-6 h-6 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-full shadow-[0_4px_15px_rgba(16,185,129,0.6)] border-2 border-white/20 transform -translate-x-2 -translate-y-3 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform duration-200"
                    style={{ top: getSliderPosition() }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 to-blue-500 animate-pulse"></div>
                  </div>
                </div>
                
                {/* 하단 아이콘 */}
                <Minimize2 className="w-4 h-4 text-emerald-400 mt-2" />
                
                {/* 스케일 표시 */}
                <div className="mt-3 px-2 py-1 bg-gray-800/80 rounded-lg border border-emerald-400/30">
                  <span className="text-xs font-bold text-emerald-300">
                    {Math.round(cardScale * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 사이드바 */}
          <div className={`absolute right-0 top-0 w-96 h-full neo-glass border-l border-blue-400/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform transition-transform duration-300 ease-out ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
            onMouseEnter={handleSidebarMouseEnter}
            onMouseLeave={handleSidebarMouseLeave}
          >
            <div className="p-4 h-full overflow-y-auto">
              {/* 헤더 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-black text-white">글로벌 트렌드</h3>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-orange-500 font-medium">
                      <Loader className="w-3 h-3 animate-spin" />
                      <span>새 트렌드 가져오는 중...</span>
                    </div>
                  ) : (
                    <span>마지막 업데이트: {formatLastUpdated()}</span>
                  )}
                  {hoverTimer && !isLoading && (
                    <span className="text-orange-500 font-medium">
                      (준비 중...)
                    </span>
                  )}
                  {debounceTimer && (
                    <span className="text-blue-500 font-medium text-xs">
                      (잠시 후 갱신...)
                    </span>
                  )}
                </div>
              </div>
              
              {/* 국가 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">국가 선택</label>
                <div className="relative">
                  <button
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl transition-all duration-200 ${
                      isLoading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{countries.find(c => c.code === selectedCountry)?.flag}</span>
                      <span className="font-medium">{countries.find(c => c.code === selectedCountry)?.name}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-purple-600 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-gray-800 border border-gray-600 rounded-xl shadow-lg py-2 z-10 max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleCountryChange(country.code)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white flex items-center gap-3 transition-colors"
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="font-medium">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* 카테고리 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 선택</label>
                <div className="relative">
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl transition-all duration-200 ${
                      isLoading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{categories.find(c => c.id === selectedCategory)?.icon}</span>
                      <span className="font-medium">{categories.find(c => c.id === selectedCategory)?.name}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-blue-600 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-gray-800 border border-gray-600 rounded-xl shadow-lg py-2 z-10 max-h-60 overflow-y-auto">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryChange(category.id)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white flex items-center gap-3 transition-colors"
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* 트렌드 리스트 */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  인기 급상승
                </h4>
                
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Loader className="w-8 h-8 animate-spin text-orange-500 mb-3" />
                    <p className="text-sm text-gray-600 font-medium">최신 트렌드 업데이트 중...</p>
                    <p className="text-xs text-gray-400 mt-1">잠시만 기다려주세요</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {trends.slice(0, 5).map((trend, index) => (
                      <div
                        key={index}
                        onClick={() => handleTrendClick(trend)}
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 group/item hover:shadow-md border-2 border-transparent hover:border-blue-200"
                        title={`"${trend.title}" 검색하기`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold flex-shrink-0 group-hover/item:from-blue-500 group-hover/item:to-purple-500 transition-all">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-white group-hover/item:text-blue-300 transition-colors text-sm leading-tight" title={trend.title}>
                              {trend.title.length > 35 ? `${trend.title.substring(0, 35)}...` : trend.title}
                            </h5>
                            <div className="mt-1 flex items-center gap-1 text-xs flex-wrap">
                              <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium text-xs group-hover/item:bg-blue-200 flex-shrink-0" title={trend.category || '기타'}>
                                {(trend.category || '기타').length > 8 ? `${(trend.category || '기타').substring(0, 8)}` : (trend.category || '기타')}
                              </span>
                              <span className="flex items-center gap-1 text-gray-600 group-hover/item:text-blue-600">
                                <Eye className="w-3 h-3" />
                                {trend.views}
                              </span>
                              <span className="text-green-600 font-bold group-hover/item:text-green-700">{trend.growth}</span>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <div className="text-blue-500 text-xs font-medium bg-blue-100 px-2 py-1 rounded-full">
                              검색
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}