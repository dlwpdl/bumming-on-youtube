
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
    <div className="group relative neo-glass holographic-effect card-3d rounded-3xl overflow-hidden">
      {/* Cyberpunk Border Animation */}
      <div className="absolute inset-0 rounded-3xl morphing-gradient opacity-15 group-hover:opacity-30 transition-opacity duration-500"></div>
      
      <div className="relative z-10 p-6">
        {/* Floating Avatar Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full overflow-hidden group-hover:scale-110 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <img
                src={channel.thumbnail}
                alt={channel.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Holographic Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-spin"></div>
          </div>
          
          {/* Subscriber Count Badge */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg cyber-glow">
              {formatNumber(channel.subscriberCount)} 구독자
            </div>
          </div>
        </div>
        
        {/* Channel Info */}
        <div className="text-center space-y-4">
          {/* Glowing Title */}
          <h3 className="text-xl font-black text-white leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-500 line-clamp-2">
            {channel.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-300 line-clamp-2 mb-3">
            {channel.description || '설명이 없습니다.'}
          </p>
          
          {/* Custom URL */}
          {channel.customUrl && (
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-gradient-to-r from-gray-600/30 to-gray-700/30 text-blue-400 text-sm font-medium rounded-full border border-blue-400/30">
                @{channel.customUrl}
              </span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => {
                if (selectedChannelId !== channel.id) {
                  setSelectedChannelId(channel.id);
                  loadChannelAnalysis(channel.id);
                }
                setActiveTab('analysis');
              }}
              className="px-6 py-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-[0_8px_25px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_35px_rgba(139,92,246,0.6)] transition-all duration-300 hover:scale-110 font-bold flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              분석
            </button>
            <a
              href={`https://youtube.com/channel/${channel.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-[0_8px_25px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_35px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-110 font-bold flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              방문
            </a>
          </div>
          
          {/* Futuristic Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="neo-glass rounded-2xl p-3 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">구독자</p>
              <p className="text-sm font-black text-white">{formatNumber(channel.subscriberCount)}</p>
            </div>
            
            <div className="neo-glass rounded-2xl p-3 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">조회수</p>
              <p className="text-sm font-black text-white">{formatNumber(channel.viewCount)}</p>
            </div>
            
            <div className="neo-glass rounded-2xl p-3 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">영상수</p>
              <p className="text-sm font-black text-white">{formatNumber(channel.videoCount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
