
import { BarChart3, ExternalLink, Users, Eye, Video } from 'lucide-react';
import { ChannelData } from '@/lib/youtube';

interface ChannelCardProps {
  channel: ChannelData;
  selectedChannelId: string | null;
  setSelectedChannelId: (id: string | null) => void;
  loadChannelAnalysis: (id: string) => void;
  setActiveTab: (tab: any) => void;
  formatNumber: (num: number) => string;
}

export default function ChannelCard({ 
  channel, 
  selectedChannelId, 
  setSelectedChannelId, 
  loadChannelAnalysis, 
  setActiveTab,
  formatNumber
}: ChannelCardProps) {
  return (
    <div className="group bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-[1.01]">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* 채널 썸네일 */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={channel.thumbnail}
                alt={channel.title}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full shadow-md group-hover:shadow-lg transition-shadow"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-full transition-colors"></div>
            </div>
          </div>
          
          {/* 채널 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 mr-3 sm:mr-4">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {channel.title}
                </h4>
                <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{channel.description || '설명이 없습니다.'}</p>
                {channel.customUrl && (
                  <p className="text-xs sm:text-sm text-blue-600 font-medium">@{channel.customUrl}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // 이미 선택된 채널과 다른 경우에만 새로 로드
                    if (selectedChannelId !== channel.id) {
                      setSelectedChannelId(channel.id);
                      loadChannelAnalysis(channel.id);
                    }
                    setActiveTab('analysis');
                  }}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm font-semibold"
                >
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">분석</span>
                </button>
                <a
                  href={`https://youtube.com/channel/${channel.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm font-semibold"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">방문</span>
                </a>
              </div>
            </div>
            
            {/* 채널 통계 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-200/50">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">구독자</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-blue-900">{formatNumber(channel.subscriberCount)}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-green-200/50">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">조회수</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-green-900">{formatNumber(channel.viewCount)}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-200/50">
                <div className="flex items-center gap-2 mb-1">
                  <Video className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">영상수</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-purple-900">{formatNumber(channel.videoCount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
