
import { UserCheck } from 'lucide-react';
import { ChannelData } from '@/lib/youtube';
import ChannelCard from './ChannelCard';
import Pagination from './Pagination';

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
  selectedChannelId,
  setSelectedChannelId,
  loadChannelAnalysis,
  setActiveTab,
  formatNumber
}: ChannelListProps) {
  return (
    <div className="space-y-8">
      {/* 채널 결과 헤더 & 정렬 */}
      <div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">채널 검색 결과</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <p className="text-sm sm:text-base text-gray-600 font-medium">{sortedChannels.length}개의 채널을 찾았습니다</p>
                <span className="text-xs sm:text-sm text-gray-500">페이지 {currentPage} / 전체 {Math.min(totalResults, 1000000).toLocaleString()}개 결과</span>
              </div>
            </div>
          </div>
          
          {/* 정렬 버튼들 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-600 sm:mr-2">정렬:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSort('subscriberCount')}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                  sortField === 'subscriberCount'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                구독자 {sortField === 'subscriberCount' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSort('viewCount')}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                  sortField === 'viewCount'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                조회수 {sortField === 'viewCount' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSort('title')}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                  sortField === 'title'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                이름 {sortField === 'title' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 채널 카드 그리드 */}
      <div className="grid gap-4 sm:gap-6">
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
