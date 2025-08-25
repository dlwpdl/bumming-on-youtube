
import { useState } from 'react';
import { Heart, Video, Users, Play, UserCheck } from 'lucide-react';
import { VideoData } from '@/lib/youtube';
import { FavoriteChannel } from '@/lib/types';
import VideoCard from './VideoCard';

interface FavoritesProps {
  favoriteVideos: VideoData[];
  favoriteChannels: FavoriteChannel[];
  isFavorite: (id: string) => boolean;
  isChannelFavorite: (id: string) => boolean;
  toggleFavorite: (video: VideoData) => void;
  toggleChannelFavorite: (channel: FavoriteChannel) => void;
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
  onSearchChannelVideos?: (channelTitle: string) => void;
}

export default function Favorites({ 
  favoriteVideos,
  favoriteChannels,
  isFavorite, 
  isChannelFavorite,
  toggleFavorite,
  toggleChannelFavorite,
  onSearchChannelVideos,
  ...videoCardProps 
}: FavoritesProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'channels'>('videos');

  const renderEmptyState = (type: 'videos' | 'channels') => (
    <div className="text-center py-20">
      {type === 'videos' ? (
        <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      ) : (
        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      )}
      <h3 className="text-xl font-bold text-white">
        {type === 'videos' ? '즐겨찾기 영상이' : '즐겨찾기 채널이'} 없습니다.
      </h3>
      <p className="text-gray-300">
        {type === 'videos' 
          ? '영상 카드에서 하트 버튼을 눌러 즐겨찾기에 추가하세요.'
          : '채널 분석에서 채널을 즐겨찾기에 추가하세요.'
        }
      </p>
    </div>
  );

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-pink-600/80 to-purple-600/80 text-white rounded-2xl p-6 backdrop-blur-sm border border-pink-400/20">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6" />
          <h2 className="text-2xl font-bold">즐겨찾기</h2>
        </div>
        <p className="text-pink-100">
          관심 있는 영상과 채널을 저장하고 관리하세요.
        </p>
      </div>

      {/* 탭 버튼 */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'videos'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
              : 'neo-glass cyber-border text-gray-300 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          영상 ({favoriteVideos.length})
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'channels'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
              : 'neo-glass cyber-border text-gray-300 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          채널 ({favoriteChannels.length})
        </button>
      </div>

      {/* 컨텐츠 */}
      {activeTab === 'videos' ? (
        favoriteVideos.length === 0 ? (
          renderEmptyState('videos')
        ) : (
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
        )
      ) : (
        favoriteChannels.length === 0 ? (
          renderEmptyState('channels')
        ) : (
          <div className="grid gap-4">
            {favoriteChannels.map((channel) => (
              <div key={channel.id} className="neo-glass cyber-border rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-400/5 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <img 
                      src={channel.thumbnail} 
                      alt={channel.title} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/30 shadow-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 hover:text-cyan-400 transition-colors cursor-pointer"
                          onClick={() => window.open(`https://www.youtube.com/channel/${channel.id}`, '_blank')}>
                        {channel.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {channel.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-4 h-4" />
                          구독자 {formatNumber(channel.subscriberCount)}명
                        </span>
                        <span>영상 {formatNumber(channel.videoCount)}개</span>
                        <span>총 조회수 {formatNumber(channel.viewCount)}회</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {onSearchChannelVideos && (
                      <button
                        onClick={() => onSearchChannelVideos(channel.title)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                        title="이 채널의 영상 찾기"
                      >
                        <Play className="w-4 h-4" />
                        영상 찾기
                      </button>
                    )}
                    <button
                      onClick={() => toggleChannelFavorite(channel)}
                      className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                      title="즐겨찾기에서 제거"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      제거
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
