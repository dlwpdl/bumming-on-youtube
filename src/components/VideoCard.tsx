
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
        <div className="relative flex-shrink-0 w-56 space-y-3">
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
          
          {/* Action Buttons - 썸네일 아래로 이동 */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                downloadThumbnail(video.id, video.title, '4k');
              }}
              disabled={downloadingThumbnails.has(video.id)}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-110 disabled:opacity-50"
              title="썸네일 다운로드 (4K)"
            >
              {downloadingThumbnails.has(video.id) ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                copyVideoUrl(video.id);
              }}
              className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-110"
              title="영상 URL 복사"
            >
              {copiedUrls.has(video.id) ? (
                <Check className="w-4 h-4 text-green-300" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleVideoDownload();
              }}
              disabled={downloadingVideo}
              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_25px_rgba(139,92,246,0.6)] transition-all duration-300 hover:scale-110 disabled:opacity-50"
              title="영상 다운로드 (720p)"
            >
              {downloadingVideo ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : downloadCompleted ? (
                <Check className="w-4 h-4 text-green-300" />
              ) : (
                <Link className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={() => toggleFavorite(video)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isFavorite
                  ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-[0_4px_15px_rgba(244,63,94,0.4)] hover:shadow-[0_8px_25px_rgba(244,63,94,0.6)]'
                  : 'bg-gradient-to-br from-gray-600 to-gray-700 text-gray-300 hover:text-white shadow-[0_4px_15px_rgba(75,85,99,0.4)] hover:shadow-[0_8px_25px_rgba(75,85,99,0.6)]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
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
          
          {/* Enhanced Stats Grid - 2x2 레이아웃 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* 조회수 */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 rounded-xl p-3 border border-cyan-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-cyan-400 font-medium uppercase tracking-wide">조회수</div>
                <div className="text-sm font-bold text-white">{formatNumber(video.viewCount)}</div>
              </div>
            </div>
            
            {/* 구독자수 */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl p-3 border border-purple-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-purple-400 font-medium uppercase tracking-wide">구독자</div>
                <div className="text-sm font-bold text-white">{formatNumber(video.subscriberCount)}</div>
              </div>
            </div>
            
            {/* 성과율 */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl p-3 border border-emerald-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-emerald-400 font-medium uppercase tracking-wide">성과율</div>
                <div className="text-sm font-bold text-white">{video.performanceScore.toFixed(1)}%</div>
              </div>
            </div>
            
            {/* 영상길이 */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl p-3 border border-orange-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-orange-400 font-medium uppercase tracking-wide">길이</div>
                <div className="text-sm font-bold text-white">{formatDuration(video.duration)}</div>
              </div>
            </div>
          </div>
          
          {/* Upload Date */}
          <div className="flex justify-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getDateColorClass(video.publishedAt)} text-white shadow-lg`}>
              <Clock className="w-4 h-4 mr-2" />
              <span>{getTimeAgo(video.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
