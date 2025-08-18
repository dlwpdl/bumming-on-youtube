
import { TrendingUp } from 'lucide-react';
import { VideoData } from '@/lib/youtube';
import VideoCard from './VideoCard';
import Pagination from './Pagination';

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
  isFavorite,
  toggleFavorite,
  ...videoCardProps
}: VideoListProps) {
  return (
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <p className="text-sm sm:text-base text-gray-600 font-medium">{sortedVideos.length}개의 영상을 찾았습니다</p>
                <span className="text-xs sm:text-sm text-gray-500">페이지 {currentPage} / 전체 {Math.min(totalResults, 1000000).toLocaleString()}개 결과</span>
              </div>
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
              <button
                onClick={() => handleSort('publishedAt')}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                  sortField === 'publishedAt'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                업로드일 {sortField === 'publishedAt' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 영상 카드 그리드 */}
      <div className="grid gap-4 sm:gap-6">
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
