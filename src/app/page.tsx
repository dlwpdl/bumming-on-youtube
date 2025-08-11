'use client';

import { useState } from 'react';
import { Search, Play } from 'lucide-react';
import { VideoData } from '@/lib/youtube';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    videoDuration: 'any',
    maxSubscribers: '',
    minViews: '',
    categoryId: '',
    maxResults: '50',
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          ...filters,
        }),
      });
      
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('검색 오류:', error);
    }
    setLoading(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">YouTube 영상 필터 검색</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="검색 키워드를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Search size={20} />
              {loading ? '검색중...' : '검색'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">영상 길이</label>
              <select
                value={filters.videoDuration}
                onChange={(e) => setFilters({...filters, videoDuration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="any">전체</option>
                <option value="short">숏폼 (60초 이하)</option>
                <option value="medium">롱폼 (60초-10분)</option>
                <option value="long">핵심폼 (10분 이상)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">최대 구독자수</label>
              <input
                type="number"
                placeholder="1000"
                value={filters.maxSubscribers}
                onChange={(e) => setFilters({...filters, maxSubscribers: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">최소 조회수</label>
              <input
                type="number"
                placeholder="1000"
                value={filters.minViews}
                onChange={(e) => setFilters({...filters, minViews: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <select
                value={filters.categoryId}
                onChange={(e) => setFilters({...filters, categoryId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="1">Film & Animation</option>
                <option value="10">Music</option>
                <option value="15">Pets & Animals</option>
                <option value="17">Sports</option>
                <option value="19">Travel & Events</option>
                <option value="20">Gaming</option>
                <option value="22">People & Blogs</option>
                <option value="23">Comedy</option>
                <option value="24">Entertainment</option>
                <option value="25">News & Politics</option>
                <option value="26">Howto & Style</option>
                <option value="27">Education</option>
                <option value="28">Science & Technology</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">결과 개수</label>
              <select
                value={filters.maxResults}
                onChange={(e) => setFilters({...filters, maxResults: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="50">50개</option>
                <option value="100">100개</option>
                <option value="150">150개</option>
                <option value="200">200개</option>
                <option value="300">300개</option>
              </select>
            </div>
          </div>
        </div>

        {videos.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">검색 결과 ({videos.length}개)</h2>
            </div>
            <div className="divide-y">
              {videos.map((video) => (
                <div key={video.id} className="p-4 hover:bg-gray-50">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-40 h-24 rounded object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{video.channelTitle}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>조회수: {formatNumber(video.viewCount)}</span>
                        <span>구독자: {formatNumber(video.subscriberCount)}</span>
                        <span className={`font-semibold ${
                          video.performanceScore > 10 ? 'text-green-600' : 
                          video.performanceScore > 1 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          성과율: {video.performanceScore.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <a
                        href={`https://youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Play size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}