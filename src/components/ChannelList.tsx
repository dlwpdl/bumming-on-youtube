
import { UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChannelData } from '@/lib/youtube';
import ChannelCard from './ChannelCard';
import Pagination from './Pagination';
import { ViewSize } from './ViewControls';

interface ChannelListProps {
  sortedChannels: ChannelData[];
  currentPage: number;
  totalResults: number;
  filters: any;
  sortField: string;
  sortOrder: string;
  handleSort: (field: any) => void;
  nextPageToken?: string;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  loadingPage: boolean;
  viewSize?: ViewSize;
  cardScale?: number;
  selectedChannelId: string | null;
  setSelectedChannelId: (id: string | null) => void;
  loadChannelAnalysis: (id: string) => void;
  setActiveTab: (tab: any) => void;
  formatNumber: (num: number) => string;
}

export default function ChannelList({ 
  sortedChannels, 
  currentPage, 
  totalResults, 
  filters, 
  sortField, 
  sortOrder, 
  handleSort, 
  nextPageToken, 
  handlePrevPage, 
  handleNextPage, 
  loadingPage,
  viewSize = 'medium',
  cardScale = 1.0,
  selectedChannelId,
  setSelectedChannelId,
  loadChannelAnalysis,
  setActiveTab,
  formatNumber
}: ChannelListProps) {
  // 화면 크기 감지
  const [screenSize, setScreenSize] = useState('desktop');
  
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else if (width < 1280) {
        setScreenSize('desktop');
      } else {
        setScreenSize('large');
      }
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // cardScale에 따른 동적 그리드 계산
  const getDynamicGridCols = () => {
    // cardScale: 0.7(작음) ~ 1.3(큼)
    // 역비례: 작을수록 많은 컬럼, 클수록 적은 컬럼
    const baseScale = 1.0;
    const scaleFactor = baseScale / cardScale; // 0.77 ~ 1.43
    
    // 모바일
    const mobile = Math.max(1, Math.min(3, Math.round(1.5 * scaleFactor)));
    // 태블릿 
    const tablet = Math.max(1, Math.min(4, Math.round(2 * scaleFactor)));
    // 데스크탑
    const desktop = Math.max(2, Math.min(6, Math.round(3 * scaleFactor)));
    // 대형화면
    const large = Math.max(2, Math.min(8, Math.round(4 * scaleFactor)));
    
    return {
      mobile,
      tablet, 
      desktop,
      large
    };
  };

  const gridCols = getDynamicGridCols();
  
  // 현재 화면 크기에 맞는 컬럼 수 선택
  const currentCols = screenSize === 'mobile' ? gridCols.mobile :
                     screenSize === 'tablet' ? gridCols.tablet :
                     screenSize === 'desktop' ? gridCols.desktop :
                     gridCols.large;

  return (
    <div className="space-y-8">
      {/* 채널 결과 헤더 & 정렬 */}
      <div className="neo-glass holographic-effect rounded-xl sm:rounded-2xl border border-blue-400/30 shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">채널 검색 결과</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <p className="text-sm sm:text-base text-gray-300 font-medium">{sortedChannels.length}개의 채널을 찾았습니다</p>
                <span className="text-xs sm:text-sm text-gray-400">페이지 {currentPage} / 전체 {Math.min(totalResults, 1000000).toLocaleString()}개 결과</span>
              </div>
            </div>
          </div>
          
          {/* 정렬 버튼들 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-300 sm:mr-2">정렬:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSort('subscriberCount')}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                  sortField === 'subscriberCount'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-gray-600/30 text-gray-300 hover:bg-gray-500/30 hover:text-white'
                }`}
              >
                구독자 {sortField === 'subscriberCount' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSort('viewCount')}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                  sortField === 'viewCount'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-600/30 text-gray-300 hover:bg-gray-500/30 hover:text-white'
                }`}
              >
                조회수 {sortField === 'viewCount' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSort('title')}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                  sortField === 'title'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'bg-gray-600/30 text-gray-300 hover:bg-gray-500/30 hover:text-white'
                }`}
              >
                이름 {sortField === 'title' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 채널 카드 그리드 */}
      <div 
        className="grid gap-4 sm:gap-6"
        style={{ 
          transform: `scale(${cardScale})`, 
          transformOrigin: 'top center',
          gridTemplateColumns: `repeat(${currentCols}, minmax(0, 1fr))`,
        }}
      >
        {sortedChannels.map((channel) => (
          <ChannelCard 
            key={channel.id} 
            channel={channel} 
            selectedChannelId={selectedChannelId}
            setSelectedChannelId={setSelectedChannelId}
            loadChannelAnalysis={loadChannelAnalysis}
            setActiveTab={setActiveTab}
            formatNumber={formatNumber}
          />
        ))}
      </div>
      
      {/* 페이지네이션 */}
      {(nextPageToken || currentPage > 1) && (
        <Pagination 
          currentPage={currentPage}
          totalResults={totalResults}
          filters={filters}
          nextPageToken={nextPageToken}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          loadingPage={loadingPage}
        />
      )}
    </div>
  );
}
