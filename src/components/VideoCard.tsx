
import { Play, Clock, Eye, Users, Zap, Heart, Download, Copy, Check, Link, Loader, ChevronDown, Info, Subtitles } from 'lucide-react';
import { VideoData } from '@/lib/youtube';
import { useEffect, useState } from 'react';

interface VideoCardProps {
  video: VideoData;
  isFavorite: boolean;
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

export default function VideoCard({ 
  video, 
  isFavorite, 
  toggleFavorite, 
  downloadingThumbnails, 
  copiedUrls, 
  downloadThumbnail, 
  copyVideoUrl,
  formatNumber,
  formatDuration,
  formatDate,
  getTimeAgo,
  getDateColorClass,
  getPerformanceColor
}: VideoCardProps) {
  const [downloadingVideo, setDownloadingVideo] = useState(false);
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  
  const handleVideoDownload = async () => {
    setDownloadingVideo(true);
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: video.id,
          format: 'video',
          quality: '720p',
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setDownloadCompleted(true);
        setTimeout(() => setDownloadCompleted(false), 3000);
      } else {
        alert(`다운로드 오류: ${result.error}`);
      }
    } catch (error) {
      console.error('다운로드 오류:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setDownloadingVideo(false);
    }
  };
  return (
    <div className="group relative bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
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
            
            {/* 썸네일 액션 버튼들 - 썸네일 아래로 이동 */}
            <div className="mt-2 flex gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  downloadThumbnail(video.id, video.title, '4k');
                }}
                disabled={downloadingThumbnails.has(video.id)}
                className="flex items-center gap-1 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                title="썸네일 다운로드 (4K)"
              >
                {downloadingThumbnails.has(video.id) ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  copyVideoUrl(video.id);
                }}
                className="p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                title="영상 URL 복사"
              >
                {copiedUrls.has(video.id) ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleVideoDownload();
                }}
                disabled={downloadingVideo}
                className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
                title="영상 다운로드 (720p)"
              >
                {downloadingVideo ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : downloadCompleted ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Link className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
          
          {/* 콘텐츠 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 mr-3 sm:mr-4">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-2">{video.channelTitle}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDateColorClass(video.publishedAt)} text-white shadow-sm`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {getTimeAgo(video.publishedAt)}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(video.publishedAt)}
                  </span>
                </div>
                
                
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(video)}
                  className={`p-2 sm:p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    isFavorite
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <a
                  href={`https://youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-2 sm:p-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl sm:rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
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
  );
}
