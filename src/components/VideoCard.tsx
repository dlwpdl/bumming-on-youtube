
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
    <div className="group relative neo-glass holographic-effect card-3d rounded-3xl overflow-hidden">
      {/* Cyberpunk Border Animation */}
      <div className="absolute inset-0 rounded-3xl morphing-gradient opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
      
      <div className="relative z-10 p-4 flex gap-4">
        {/* Floating Thumbnail Section - 왼쪽 */}
        <div className="relative flex-shrink-0 w-64">
          <div className="relative overflow-hidden rounded-2xl group-hover:scale-105 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-36 object-cover"
            />
            {/* Holographic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
            
            {/* Floating Duration Badge */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/90 backdrop-blur-sm text-white text-sm font-bold rounded-full border border-white/20">
              {formatDuration(video.duration)}
            </div>
            
            {/* Performance Score Badge */}
            <div className={`absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r ${getPerformanceColor(video.performanceScore).bg} text-white text-sm font-bold rounded-full shadow-lg cyber-glow flex items-center gap-1`}>
              <Zap className="w-4 h-4" />
              {video.performanceScore.toFixed(1)}%
              <span className="text-base">{getPerformanceColor(video.performanceScore).icon}</span>
            </div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <a
                href={`https://youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] transition-all duration-300 hover:scale-110"
              >
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </a>
            </div>
          </div>
          
          {/* Floating Action Buttons */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                downloadThumbnail(video.id, video.title, '4k');
              }}
              disabled={downloadingThumbnails.has(video.id)}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_25px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_35px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-110 disabled:opacity-50"
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
              className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_8px_35px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-110"
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
              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_25px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_35px_rgba(139,92,246,0.6)] transition-all duration-300 hover:scale-110 disabled:opacity-50"
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
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isFavorite
                  ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-[0_8px_25px_rgba(244,63,94,0.4)] hover:shadow-[0_8px_35px_rgba(244,63,94,0.6)]'
                  : 'bg-gradient-to-br from-gray-600 to-gray-700 text-gray-300 hover:text-white shadow-[0_8px_25px_rgba(75,85,99,0.4)] hover:shadow-[0_8px_35px_rgba(75,85,99,0.6)]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Ultra Modern Content Section - 오른쪽 */}
        <div className="flex-1 space-y-3">
          {/* Glowing Title */}
          <h3 className="text-lg font-black text-white leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-500 line-clamp-2">
            {video.title}
          </h3>
          
          {/* Channel & Date Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                <Users className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-300 font-medium text-sm">{video.channelTitle}</span>
            </div>
            
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getDateColorClass(video.publishedAt)} text-white shadow-lg`}>
              <Clock className="w-3 h-3 mr-1" />
              {getTimeAgo(video.publishedAt)}
            </div>
          </div>
          
          {/* Futuristic Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="neo-glass rounded-lg p-2 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-md flex items-center justify-center">
                  <Eye className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">조회수</p>
              </div>
              <p className="text-sm font-black text-white">{formatNumber(video.viewCount)}</p>
            </div>
            
            <div className="neo-glass rounded-2xl p-4 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">구독자</p>
              <p className="text-lg font-black text-white">{formatNumber(video.subscriberCount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
