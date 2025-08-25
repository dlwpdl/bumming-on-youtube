import { useState } from 'react';
import { AdvancedChannelData, ChannelSortField, SortOrder, SearchType, ChannelGrade } from '@/lib/types';
import { enhanceChannelData } from '@/lib/channelUtils';
import AdvancedChannelTable from './AdvancedChannelTable';
import AdvancedChannelFilters from './AdvancedChannelFilters';
import LoadingSkeleton from './LoadingSkeleton';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { AlertCircle, TrendingUp, RefreshCw, Filter, SlidersHorizontal } from 'lucide-react';

interface AdvancedChannelAnalysisProps {
  apiKey: string;
  channels: AdvancedChannelData[];
  loading: boolean;
  searchQuery: string;
  setChannels: (channels: AdvancedChannelData[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  onSearchChannelVideos?: (channelId: string, channelTitle: string) => void;
}

export default function AdvancedChannelAnalysis({ 
  apiKey, 
  channels, 
  loading, 
  searchQuery, 
  setChannels, 
  setLoading, 
  setSearchQuery, 
  onSearchChannelVideos 
}: AdvancedChannelAnalysisProps) {
  const { error, handleApiError, handleNetworkError, clearError, retry } = useErrorHandler();
  const [searchType, setSearchType] = useState<SearchType>('channel');
  
  // 필터 관련 상태
  const [countryFilter, setCountryFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('');
  const [minSubscribers, setMinSubscribers] = useState('');
  const [maxSubscribers, setMaxSubscribers] = useState('');
  
  // 정렬 관련 상태
  const [sortField, setSortField] = useState<ChannelSortField>('subscriberCount');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [totalResults, setTotalResults] = useState(0);

  // 새로운 필터 상태들
  const [gradeFilter, setGradeFilter] = useState<ChannelGrade[]>([]);
  const [tableSize, setTableSize] = useState<'compact' | 'normal' | 'spacious'>('compact');
  const [maxChannelsPerPage, setMaxChannelsPerPage] = useState(50);
  const [totalFetchedChannels, setTotalFetchedChannels] = useState(0);
  
  // 캐싱을 위한 상태
  const [cachedSearchResults, setCachedSearchResults] = useState<Map<string, { channels: AdvancedChannelData[], nextPageToken?: string, timestamp: number }>>(new Map());

  const handleSearch = async (pageToken?: string) => {
    if (!searchQuery.trim()) {
      handleApiError({ status: 400 } as Response, { error: '검색 키워드를 입력해주세요.' });
      return;
    }

    if (!apiKey) {
      handleApiError({ status: 401 } as Response, { error: 'YouTube API 키가 설정되지 않았습니다.' });
      return;
    }

    const isFirstSearch = !pageToken;
    
    // 캐시 키 생성 (검색 쿼리와 필터 조합)
    const cacheKey = `${searchQuery.trim()}_${countryFilter}_${minSubscribers}_${maxSubscribers}_${pageToken || 'first'}`;
    const CACHE_DURATION = 5 * 60 * 1000; // 5분간 캐시 유지
    
    // 캐시된 결과가 있고 유효한지 확인
    if (isFirstSearch) {
      const cached = cachedSearchResults.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log('캐시된 결과 사용:', cached.channels.length, '개 채널');
        setLoading(false);
        setChannels(cached.channels);
        setTotalFetchedChannels(cached.channels.length);
        setNextPageToken(cached.nextPageToken);
        setTotalResults(cached.channels.length);
        setCurrentPage(1);
        return;
      }
    }
    
    if (isFirstSearch) {
      setLoading(true);
      setChannels([]);
      setCurrentPage(1);
      setNextPageToken(undefined);
      setTotalResults(0);
      setTotalFetchedChannels(0);
    }
    
    clearError();

    try {
      if (isFirstSearch) {
        // 대용량 검색: 처음 검색 시 여러 배치를 순차적으로 가져와서 더 많은 데이터를 확보
        console.log('대용량 채널 검색 시작...');
        const batchSize = 50;
        const maxInitialBatches = 200; // 처음에 최대 10,000개 데이터를 가져와서 대용량 채널 검색 지원 (50 * 200 = 10,000개)
        const allChannels: any[] = [];
        let currentToken: string | undefined = undefined;
        
        for (let i = 0; i < maxInitialBatches; i++) {
          try {
            const response = await fetch('/api/search-channels', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: searchQuery,
                country: countryFilter,
                minSubscribers,
                maxSubscribers,
                maxResults: batchSize.toString(),
                pageToken: currentToken,
                apiKey,
              }),
            });

            const data = await response.json();
            
            if (response.ok && data.channels?.length > 0) {
              const enhancedChannels = data.channels.map((channel: any) => enhanceChannelData(channel));
              allChannels.push(...enhancedChannels);
              currentToken = data.nextPageToken;
              
              console.log(`배치 ${i + 1} 완료: ${enhancedChannels.length}개 채널 추가 (총 ${allChannels.length}개)`);
              
              if (!currentToken) break; // 더 이상 데이터가 없으면 종료
            } else {
              console.log(`배치 ${i + 1}: 데이터 없음 또는 오류`);
              break;
            }
            
            // API 호출 간격 조정 (rate limiting 방지) - 대용량 검색을 위해 간격을 더 짧게
            if (i < maxInitialBatches - 1) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          } catch (batchError) {
            console.error(`배치 ${i + 1} 오류:`, batchError);
            break;
          }
        }
        
        if (allChannels.length > 0) {
          setChannels(allChannels);
          setTotalFetchedChannels(allChannels.length);
          setNextPageToken(currentToken);
          setTotalResults(allChannels.length); 
          console.log(`초기 대용량 검색 완료: ${allChannels.length}개 채널 로드 (목표: ${maxInitialBatches * batchSize}개)`);
          
          // 결과를 캐시에 저장
          const newCached = new Map(cachedSearchResults);
          newCached.set(cacheKey, {
            channels: allChannels,
            nextPageToken: currentToken,
            timestamp: Date.now()
          });
          setCachedSearchResults(newCached);
          console.log(`검색 결과를 캐시에 저장: ${allChannels.length}개 채널`);
        } else {
          handleApiError({ status: 404 } as Response, { error: '검색 결과가 없습니다.' });
        }
      } else {
        // 추가 페이지 로딩
        const response = await fetch('/api/search-channels', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: searchQuery,
            country: countryFilter,
            minSubscribers,
            maxSubscribers,
            maxResults: '50',
            pageToken,
            apiKey,
          }),
        });

        const data = await response.json();

        if (response.ok && data.channels?.length > 0) {
          const enhancedChannels = data.channels.map((channel: any) => enhanceChannelData(channel));
          setChannels(prev => [...prev, ...enhancedChannels]);
          setTotalFetchedChannels(prev => prev + enhancedChannels.length);
          setNextPageToken(data.nextPageToken);
        } else {
          handleApiError(response, data);
        }
      }
    } catch (error) {
      console.error('채널 검색 오류:', error);
      if (error instanceof Error) {
        handleNetworkError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // 페이지 크기 변경 시 추가 데이터 로드
  const handlePageSizeChange = async (newSize: number) => {
    const currentSize = channels.length;
    console.log(`페이지 크기 변경: ${currentSize} -> ${newSize}`);
    console.log(`검색쿼리: "${searchQuery}", nextToken: ${nextPageToken}`);
    console.log(`필터 - 국가: "${countryFilter}", 최소구독자: "${minSubscribers}", 최대구독자: "${maxSubscribers}"`);
    
    // 검색이 이루어진 상태이고, 더 많은 데이터가 필요하고, 더 가져올 데이터가 있는 경우
    if (searchQuery.trim() && newSize > currentSize && nextPageToken) {
      console.log(`추가 데이터 로드 시작: ${newSize - currentSize}개 더 필요`);
      
      const needMoreChannels = newSize - currentSize;
      const additionalBatches = Math.ceil(needMoreChannels / 50);
      
      setLoading(true);
      let currentToken = nextPageToken;
      
      for (let i = 0; i < additionalBatches && currentToken; i++) {
        try {
          console.log(`배치 ${i + 1}/${additionalBatches} 로딩 중... (토큰: ${currentToken.substring(0, 20)}...)`);
          
          const response = await fetch('/api/search-channels', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: searchQuery.trim(),
              country: countryFilter,
              minSubscribers,
              maxSubscribers,
              maxResults: '50',
              pageToken: currentToken,
              apiKey,
            }),
          });

          const data = await response.json();
          console.log(`배치 ${i + 1} 응답:`, response.ok, data.channels?.length, '개 채널');
          
          if (response.ok && data.channels?.length > 0) {
            const enhancedChannels = data.channels.map((channel: any) => enhanceChannelData(channel));
            setChannels(prev => {
              console.log(`채널 추가: ${prev.length} + ${enhancedChannels.length} = ${prev.length + enhancedChannels.length}`);
              return [...prev, ...enhancedChannels];
            });
            setTotalFetchedChannels(prev => prev + enhancedChannels.length);
            currentToken = data.nextPageToken;
            
            // API 호출 간격 조정 (rate limiting 방지)
            if (i < additionalBatches - 1 && currentToken) {
              await new Promise(resolve => setTimeout(resolve, 200));
            }
          } else {
            console.log(`배치 ${i + 1} 완료: 더 이상 데이터 없음`);
            break;
          }
        } catch (error) {
          console.error(`배치 ${i + 1} 오류:`, error);
          break;
        }
      }
      
      setNextPageToken(currentToken);
      setLoading(false);
      console.log(`페이지 크기 변경 완료: 현재 ${channels.length + (newSize - currentSize)}개 채널`);
    } else {
      console.log('추가 데이터 로드 조건 미충족:', {
        hasSearchQuery: !!searchQuery.trim(),
        needsMoreData: newSize > currentSize,
        hasNextToken: !!nextPageToken
      });
    }
    
    setMaxChannelsPerPage(newSize);
    setCurrentPage(1);
  };

  // 다음 페이지 로드
  const handleNextPage = async () => {
    if (!nextPageToken || loading) return;
    
    setLoading(true);
    try {
      await handleSearch(nextPageToken);
      setCurrentPage(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: ChannelSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // 채널 필터링
  const filteredChannels = channels.filter(channel => {
    // 등급 필터
    if (gradeFilter.length > 0 && !gradeFilter.includes(channel.grade)) {
      return false;
    }
    
    // 국가 필터
    if (countryFilter && channel.country !== countryFilter) {
      return false;
    }
    
    // 구독자 수 필터
    if (minSubscribers && channel.subscriberCount < parseInt(minSubscribers)) {
      return false;
    }
    
    if (maxSubscribers && channel.subscriberCount > parseInt(maxSubscribers)) {
      return false;
    }
    
    return true;
  });

  // 채널 정렬
  const sortedChannels = [...filteredChannels].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortField) {
      case 'grade':
        const gradeOrder = { 'S': 10, 'A': 9, 'B+': 8, 'B': 7, 'B-': 6, 'C+': 5, 'C': 4, 'C-': 3, 'D+': 2, 'D': 1 };
        aValue = gradeOrder[a.grade];
        bValue = gradeOrder[b.grade];
        break;
      case 'subscriberCount':
        aValue = a.subscriberCount;
        bValue = b.subscriberCount;
        break;
      case 'viewCount':
        aValue = a.viewCount;
        bValue = b.viewCount;
        break;
      case 'videoCount':
        aValue = a.videoCount;
        bValue = b.videoCount;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'publishedAt':
        aValue = new Date(a.publishedAt).getTime();
        bValue = new Date(b.publishedAt).getTime();
        break;
      case 'growthRate':
        aValue = a.growthData.yearlyGrowth;
        bValue = b.growthData.yearlyGrowth;
        break;
      default:
        aValue = a.subscriberCount;
        bValue = b.subscriberCount;
    }

    if (sortOrder === 'desc') {
      return bValue > aValue ? 1 : -1;
    } else {
      return aValue > bValue ? 1 : -1;
    }
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedChannels.length / maxChannelsPerPage);
  const startIndex = (currentPage - 1) * maxChannelsPerPage;
  const endIndex = startIndex + maxChannelsPerPage;
  const paginatedChannels = sortedChannels.slice(startIndex, endIndex);

  const getStats = () => {
    if (filteredChannels.length === 0) return null;

    const totalSubscribers = filteredChannels.reduce((sum, ch) => sum + ch.subscriberCount, 0);
    const avgSubscribers = Math.round(totalSubscribers / filteredChannels.length);
    const topGrades = filteredChannels.filter(ch => ['S', 'A'].includes(ch.grade)).length;
    const koreanChannels = filteredChannels.filter(ch => ch.isKoreanChannel).length;

    return {
      totalChannels: filteredChannels.length,
      avgSubscribers,
      topGrades,
      koreanChannels
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-white rounded-2xl p-6 backdrop-blur-sm border border-cyan-400/20">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6" />
          <h2 className="text-2xl font-bold">고급 채널 분석</h2>
        </div>
        <p className="text-cyan-100">
          채널명, 카테고리, 제목으로 검색하여 채널의 성과와 성장률을 상세히 분석하세요.
        </p>
      </div>

      {/* 필터 */}
      <AdvancedChannelFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchType={searchType}
        setSearchType={setSearchType}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        dateRangeFilter={dateRangeFilter}
        setDateRangeFilter={setDateRangeFilter}
        minSubscribers={minSubscribers}
        setMinSubscribers={setMinSubscribers}
        maxSubscribers={maxSubscribers}
        setMaxSubscribers={setMaxSubscribers}
        onSearch={() => handleSearch()}
        loading={loading}
      />

      {/* 통계 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="neo-glass cyber-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{stats.totalChannels}</div>
            <div className="text-sm text-gray-300">검색된 채널</div>
          </div>
          <div className="neo-glass cyber-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {stats.avgSubscribers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">평균 구독자</div>
          </div>
          <div className="neo-glass cyber-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.topGrades}</div>
            <div className="text-sm text-gray-300">S/A 등급</div>
          </div>
          <div className="neo-glass cyber-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.koreanChannels}</div>
            <div className="text-sm text-gray-300">한국 채널</div>
          </div>
        </div>
      )}

      {/* 추가 필터 및 컨트롤 */}
      {channels.length > 0 && (
        <div className="neo-glass cyber-border rounded-xl p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* 등급 필터 */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-gray-300">등급 필터:</span>
              <div className="flex gap-2">
                {(['S', 'A', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D'] as ChannelGrade[]).map(grade => (
                  <button
                    key={grade}
                    onClick={() => {
                      setGradeFilter(prev => 
                        prev.includes(grade) 
                          ? prev.filter(g => g !== grade)
                          : [...prev, grade]
                      );
                    }}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                      gradeFilter.includes(grade)
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    title={`${grade}등급: ${
                      grade === 'S' ? '1천만+ 구독자' :
                      grade === 'A' ? '500만+ 구독자' :
                      grade === 'B+' ? '100만+ 구독자' :
                      grade === 'B' ? '50만+ 구독자' :
                      grade === 'B-' ? '10만+ 구독자' :
                      grade === 'C+' ? '5만+ 구독자' :
                      grade === 'C' ? '1만+ 구독자' :
                      grade === 'C-' ? '5천+ 구독자' :
                      grade === 'D+' ? '1천+ 구독자' :
                      '1천 미만 구독자'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              {gradeFilter.length > 0 && (
                <button
                  onClick={() => setGradeFilter([])}
                  className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded-lg transition-colors"
                >
                  초기화
                </button>
              )}
            </div>
            
            {/* 페이지당 결과 수 */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-300">페이지당:</span>
              <select
                value={maxChannelsPerPage}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-2 py-1 text-sm font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="25">25개</option>
                <option value="50">50개</option>
                <option value="100">100개</option>
                <option value="200">200개</option>
                <option value="500">500개</option>
                <option value="1000">1,000개</option>
                <option value="2000">2,000개</option>
                <option value="5000">5,000개</option>
                <option value="10000">10,000개</option>
              </select>
            </div>
            
            {/* 테이블 크기 조절 슬라이더 */}
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-gray-300">테이블 크기:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">좁음</span>
                <input
                  type="range"
                  min="0"
                  max="2"
                  value={tableSize === 'compact' ? 0 : tableSize === 'normal' ? 1 : 2}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setTableSize(value === 0 ? 'compact' : value === 1 ? 'normal' : 'spacious');
                  }}
                  className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-gray-400">넓음</span>
              </div>
            </div>
            
            {/* 등급 기준 설명 */}
            <div className="col-span-full">
              <div className="text-xs text-gray-500 mt-2">
                <strong>등급 기준:</strong> S(1천만+), A(500만+), B+(100만+), B(50만+), B-(10만+), C+(5만+), C(1만+), C-(5천+), D+(1천+), D(1천 미만)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="neo-glass bg-red-900/20 border-red-500/30 text-red-200 px-4 py-3 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium">{error.message}</div>
              {error.details && (
                <div className="text-sm text-red-300 mt-1">{error.details}</div>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => retry(() => handleSearch())}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  다시 시도
                </button>
                <button
                  onClick={clearError}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 테이블 */}
      {loading ? (
        <LoadingSkeleton type="analysis" />
      ) : (
        <>
          <AdvancedChannelTable
            channels={paginatedChannels}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onSearchChannelVideos={onSearchChannelVideos}
            loading={loading}
            tableSize={tableSize}
          />
          
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
                >
                  이전
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
                >
                  다음
                </button>
              </div>
              
              <div className="text-sm text-gray-400">
                {startIndex + 1}-{Math.min(endIndex, sortedChannels.length)} / {sortedChannels.length}개
              </div>
            </div>
          )}
        </>
      )}

      {/* 안내 메시지 */}
      {!loading && !error && channels.length === 0 && !searchQuery && (
        <div className="neo-glass cyber-border rounded-2xl p-8 text-center">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-200 mb-2">채널 분석을 시작하세요</h3>
          <p className="text-gray-400 mb-4">
            위의 검색창에 채널명, 카테고리, 또는 키워드를 입력하여<br />
            상세한 채널 분석 데이터를 확인해보세요.
          </p>
          <div className="neo-glass bg-cyan-900/20 border-cyan-400/30 rounded-xl p-4 text-sm text-cyan-200">
            <strong>💡 팁:</strong> 신생 채널 발굴을 위해 개설 기간 필터를 활용해보세요!
          </div>
        </div>
      )}
    </div>
  );
}