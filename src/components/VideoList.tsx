
import { TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { VideoData } from '@/lib/youtube';
import VideoCard from './VideoCard';
import Pagination from './Pagination';
import { ViewSize } from './ViewControls';

interface VideoListProps {
  sortedVideos: VideoData[];
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
  isFavorite: (id: string) => boolean;
  toggleFavorite: (video: VideoData) => void;
  downloadingThumbnails: Set<string>;
  copiedUrls: Set<string>;
  downloadThumbnail: (id: string, title: string, quality: any) => void;
  copyVideoUrl: (id: string) => void;
  formatNumber: (num: number) => string;
  formatDuration: (duration: string) => string;
  formatDate: (dateString: string) => string;
  getTimeAgo: (dateString: string) => string;
  getDateColorClass: (dateString: string) => string;
  getPerformanceColor: (score: number) => { bg: string; text: string; icon: string; };
}

export default function VideoList({ 
  sortedVideos, 
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
  isFavorite,
  toggleFavorite,
  ...videoCardProps
}: VideoListProps) {
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

  // 고정된 2컬럼 그리드
  const currentCols = 2;
  
  return (
    <div className="space-y-8">
      {/* 결과 헤더 & 정렬 */}
      <div className="relative neo-glass holographic-effect rounded-xl sm:rounded-2xl border border-blue-400/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 sm:p-6">
        {/* Cyberpunk Border Animation */}
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl morphing-gradient opacity-15"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-[0_8px_25px_rgba(16,185,129,0.4)] card-3d">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">검색 결과</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <p className="text-sm sm:text-base text-gray-300 font-bold">{sortedVideos.length}개의 영상을 찾았습니다</p>
                <span className="text-xs sm:text-sm text-gray-400">페이지 {currentPage} / 전체 {Math.min(totalResults, 1000000).toLocaleString()}개 결과</span>
              </div>
            </div>
          </div>
          
          {/* 정렬 버튼들 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
            <span className="text-xs sm:text-sm font-bold text-gray-300 sm:mr-2">정렬:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSort('performanceScore')}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 card-3d ${
                  sortField === 'performanceScore'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_8px_25px_rgba(239,68,68,0.4)]'
                    : 'bg-gray-600/30 text-gray-300 hover:bg-gray-500/30 hover:text-white'
                }`}
              >
                성과율 {sortField === 'performanceScore' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSort('viewCount')}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 card-3d ${
                  sortField === 'viewCount'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_8px_25px_rgba(59,130,246,0.4)]'
                    : 'bg-gray-600/30 text-gray-300 hover:bg-gray-500/30 hover:text-white'
                }`}
              >
                조회수 {sortField === 'viewCount' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSort('subscriberCount')}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 card-3d ${
                  sortField === 'subscriberCount'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-[0_8px_25px_rgba(139,92,246,0.4)]'
                    : 'bg-gray-600/30 text-gray-300 hover:bg-gray-500/30 hover:text-white'
                }`}
              >
                구독자 {sortField === 'subscriberCount' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSort('publishedAt')}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 card-3d ${
                  sortField === 'publishedAt'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_8px_25px_rgba(16,185,129,0.4)]'
                    : 'bg-gray-600/30 text-gray-300 hover:bg-gray-500/30 hover:text-white'
                }`}
              >
                업로드일 {sortField === 'publishedAt' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 영상 카드 그리드 - 고정 2컬럼 */}
      <div 
        className="grid grid-cols-2 gap-6 max-w-6xl mx-auto"
      >
        {sortedVideos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            isFavorite={isFavorite(video.id)}
            toggleFavorite={() => toggleFavorite(video)}
            {...videoCardProps}
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
