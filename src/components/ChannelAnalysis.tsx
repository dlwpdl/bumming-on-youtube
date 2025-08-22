
import { BarChart3, Loader } from 'lucide-react';
import { ChannelData, VideoData } from '@/lib/youtube';
import VideoCard from './VideoCard';

interface ChannelAnalysisProps {
  selectedChannelData: ChannelData | null;
  channelVideos: VideoData[];
  loadingChannelAnalysis: boolean;
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

export default function ChannelAnalysis({ 
  selectedChannelData, 
  channelVideos, 
  loadingChannelAnalysis, 
  isFavorite, 
  toggleFavorite, 
  ...videoCardProps 
}: ChannelAnalysisProps) {
  if (loadingChannelAnalysis) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!selectedChannelData) {
    return (
      <div className="text-center py-20">
        <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-white">채널을 선택하여 분석을 시작하세요.</h3>
        <p className="text-gray-300">채널 찾기 탭에서 채널을 검색하고 분석 버튼을 클릭하세요.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="neo-glass holographic-effect rounded-2xl border border-blue-400/30 shadow-lg p-6 mb-8">
        <div className="flex items-center gap-4">
          <img src={selectedChannelData.thumbnail} alt={selectedChannelData.title} className="w-24 h-24 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedChannelData.title}</h2>
            <p className="text-gray-300">{selectedChannelData.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {channelVideos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            isFavorite={isFavorite(video.id)}
            toggleFavorite={() => toggleFavorite(video)}
            {...videoCardProps}
          />
        ))}
      </div>
    </div>
  );
}
