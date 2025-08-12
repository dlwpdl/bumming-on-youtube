
import { Heart } from 'lucide-react';
import { VideoData } from '@/lib/youtube';
import VideoCard from './VideoCard';

interface FavoritesProps {
  favoriteVideos: VideoData[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (video: VideoData) => void;
  downloadingThumbnails: Set<string>;
  copiedUrls: Set<string>;
  openQualityMenus: Set<string>;
  loadingDownloadLinks: Set<string>;
  downloadLinksCache: Map<string, any>;
  openDownloadMenus: Set<string>;
  toggleQualityMenu: (id: string) => void;
  downloadThumbnail: (id: string, title: string, quality: any) => void;
  copyVideoUrl: (id: string) => void;
  toggleDownloadMenu: (id: string) => void;
  formatNumber: (num: number) => string;
  formatDuration: (duration: string) => string;
  formatDate: (dateString: string) => string;
  getTimeAgo: (dateString: string) => string;
  getDateColorClass: (dateString: string) => string;
  getPerformanceColor: (score: number) => { bg: string; text: string; icon: string; };
  formatFileSize: (bytes?: number) => string;
}

export default function Favorites({ 
  favoriteVideos, 
  isFavorite, 
  toggleFavorite, 
  ...videoCardProps 
}: FavoritesProps) {
  if (favoriteVideos.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-900">즐겨찾기 목록이 비어있습니다.</h3>
        <p className="text-gray-600">영상 카드에서 하트 버튼을 눌러 즐겨찾기에 추가하세요.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      {favoriteVideos.map((video) => (
        <VideoCard 
          key={video.id} 
          video={video} 
          isFavorite={isFavorite(video.id)}
          toggleFavorite={() => toggleFavorite(video)}
          {...videoCardProps}
        />
      ))}
    </div>
  );
}
