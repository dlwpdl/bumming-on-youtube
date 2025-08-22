
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
  cardScale?: number;
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
  getPerformanceColor,
  cardScale = 1.0
}: VideoCardProps) {
  const [downloadingVideo, setDownloadingVideo] = useState(false);
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  
  // 스케일 보정 계산
  const textScale = Math.max(0.8, Math.min(1.2, 1 / cardScale));
  
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
    <div className="group relative neo-glass holographic-effect card-3d rounded-3xl overflow-hidden">
      {/* Cyberpunk Border Animation */}
      <div className="absolute inset-0 rounded-3xl morphing-gradient opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
      
      <div className="relative z-10 p-4 flex gap-4 min-h-[220px]" style={{ fontSize: `${textScale}rem` }}>
        {/* Thumbnail Section - 왼쪽 */}
        <div className="relative flex-shrink-0 w-56">
          <div className="relative overflow-hidden rounded-2xl group-hover:scale-105 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-32 object-cover"
            />
            {/* Holographic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <a
                href={`https://youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] transition-all duration-300 hover:scale-110"
              >
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Content Section - 오른쪽 */}
        <div className="flex-1 space-y-4">
          {/* Glowing Title */}
          <h3 className="text-base font-black text-white leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-500 line-clamp-4">
            {video.title}
          </h3>
          
          {/* Channel Info */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
              <Users className="w-2 h-2 text-white" />
            </div>
            <span className="text-gray-300 font-medium text-sm">{video.channelTitle}</span>
          </div>
          
          {/* Stats Row */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-cyan-400" />
              <span className="font-bold text-white">{formatNumber(video.viewCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-purple-400" />
              <span className="font-bold text-white">{formatNumber(video.subscriberCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span className="font-bold text-white">{video.performanceScore.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-400" />
              <span className="font-bold text-white">{formatDuration(video.duration)}</span>
            </div>
          </div>
          
          {/* Date & Action Buttons */}
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getDateColorClass(video.publishedAt)} text-white shadow-lg`}>
              <Clock className="w-3 h-3 mr-1" />
              <span className="text-xs">{getTimeAgo(video.publishedAt)}</span>
            </div>
            
            {/* Compact Action Buttons */}
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  downloadThumbnail(video.id, video.title, '4k');
                }}
                disabled={downloadingThumbnails.has(video.id)}
                className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-110 disabled:opacity-50"
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
                className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-110"
                title="영상 URL 복사"
              >
                {copiedUrls.has(video.id) ? (
                  <Check className="w-3 h-3 text-green-300" />
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
                className="w-7 h-7 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:shadow-[0_4px_20px_rgba(139,92,246,0.6)] transition-all duration-300 hover:scale-110 disabled:opacity-50"
                title="영상 다운로드 (720p)"
              >
                {downloadingVideo ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : downloadCompleted ? (
                  <Check className="w-3 h-3 text-green-300" />
                ) : (
                  <Link className="w-3 h-3" />
                )}
              </button>
              
              <button
                onClick={() => toggleFavorite(video)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  isFavorite
                    ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-[0_4px_15px_rgba(244,63,94,0.4)] hover:shadow-[0_4px_20px_rgba(244,63,94,0.6)]'
                    : 'bg-gradient-to-br from-gray-600 to-gray-700 text-gray-300 hover:text-white shadow-[0_4px_15px_rgba(75,85,99,0.4)] hover:shadow-[0_4px_20px_rgba(75,85,99,0.6)]'
                }`}
              >
                <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
