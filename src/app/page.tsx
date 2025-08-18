
'use client';

import { useState, useEffect } from 'react';
import { VideoData } from '@/lib/youtube';
import { SortField, SortOrder, TabType, ChannelData, FavoriteVideo } from '@/lib/types';

import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import SearchSection from '@/components/SearchSection';
import FilterSection from '@/components/FilterSection';
import VideoList from '@/components/VideoList';
import ChannelList from '@/components/ChannelList';
import ChannelAnalysis from '@/components/ChannelAnalysis';
import Favorites from '@/components/Favorites';
import ApiKeyModal from '@/components/ApiKeyModal';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import KakaoAd from '@/components/KakaoAd';
import VerticalKakaoAd from '@/components/VerticalKakaoAd';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('videos');
  
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [channelSearchQuery, setChannelSearchQuery] = useState('');
  
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [sortedVideos, setSortedVideos] = useState<VideoData[]>([]);
  const [sortedChannels, setSortedChannels] = useState<ChannelData[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedChannelData, setSelectedChannelData] = useState<ChannelData | null>(null);
  const [channelVideos, setChannelVideos] = useState<VideoData[]>([]);
  const [sortedChannelVideos, setSortedChannelVideos] = useState<VideoData[]>([]);
  const [favoriteVideos, setFavoriteVideos] = useState<FavoriteVideo[]>([]);
  const [loadingChannelAnalysis, setLoadingChannelAnalysis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState<SortField>('performanceScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState({
    videoDuration: 'any',
    maxSubscribers: '',
    minViews: '',
    minSubscribers: '',
    categoryId: '',
    country: '',
    maxResults: '50',
    publishedAfter: '',
    publishedBefore: '',
    sortBy: 'relevance',
    dateFilterType: 'none',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'none' | 'valid' | 'invalid'>('none');
  const [testingApiKey, setTestingApiKey] = useState(false);

  const currentSearchQuery = activeTab === 'channels' ? channelSearchQuery : videoSearchQuery;
  const setCurrentSearchQuery = activeTab === 'channels' ? setChannelSearchQuery : setVideoSearchQuery;

  useEffect(() => {
    const savedApiKey = localStorage.getItem('youtube-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setApiKeyStatus('valid');
    }

    const savedFavorites = localStorage.getItem('favorite-videos');
    if (savedFavorites) {
      try {
        setFavoriteVideos(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('즐겨찾기 로드 오류:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const clearSelectedChannel = () => {
    setSelectedChannelId(null);
    setSelectedChannelData(null);
    setChannelVideos([]);
    setSortedChannelVideos([]);
    setCurrentPage(1);
    setNextPageToken(undefined);
    setPrevPageTokens([]);
    setTotalResults(0);
    setError('');
  };

  const addToFavorites = (video: VideoData) => {
    const favoriteVideo: FavoriteVideo = {
      ...video,
      savedAt: new Date().toISOString(),
    };
    
    const newFavorites = [favoriteVideo, ...favoriteVideos.filter(fav => fav.id !== video.id)];
    setFavoriteVideos(newFavorites);
    localStorage.setItem('favorite-videos', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (videoId: string) => {
    const newFavorites = favoriteVideos.filter(fav => fav.id !== videoId);
    setFavoriteVideos(newFavorites);
    localStorage.setItem('favorite-videos', JSON.stringify(newFavorites));
  };

  const isFavorite = (videoId: string) => {
    return favoriteVideos.some(fav => fav.id === videoId);
  };

  const toggleFavorite = (video: VideoData) => {
    if (isFavorite(video.id)) {
      removeFromFavorites(video.id);
    } else {
      addToFavorites(video);
    }
  };

  const loadChannelAnalysis = async (channelId: string, pageToken?: string) => {
    if (!apiKey) {
      setError('YouTube API 키가 설정되지 않았습니다.');
      return;
    }

    const isFirstLoad = !pageToken;
    
    if (isFirstLoad) {
      setLoadingChannelAnalysis(true);
      setChannelVideos([]);
      setCurrentPage(1);
      setNextPageToken(undefined);
      setPrevPageTokens([]);
      setTotalResults(0);
    } else {
      setLoadingPage(true);
    }
    
    setError('');
    
    try {
      const response = await fetch('/api/channel-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId: channelId,
          apiKey: apiKey,
          pageToken: pageToken,
          maxResults: '50',
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (isFirstLoad) {
          setSelectedChannelData(data.channel);
        }
        
        setChannelVideos(data.videos || []);
        setNextPageToken(data.nextPageToken);
        setTotalResults(data.totalResults || 0);
        
        if (data.videos?.length === 0) {
          setError('이 채널에는 비디오가 없습니다.');
        }
      } else {
        setError(data.error || '채널 분석 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('채널 분석 오류:', error);
      setError('네트워크 오류가 발생했습니다.');
    }
    
    if (isFirstLoad) {
      setLoadingChannelAnalysis(false);
    } else {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    const sorted = [...videos].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else if (sortField === 'publishedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    setSortedVideos(sorted);
  }, [videos, sortField, sortOrder]);

  useEffect(() => {
    const sorted = [...channels].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'subscriberCount':
          aValue = a.subscriberCount;
          bValue = b.subscriberCount;
          break;
        case 'viewCount':
          aValue = a.viewCount;
          bValue = b.viewCount;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = a.subscriberCount;
          bValue = b.subscriberCount;
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    setSortedChannels(sorted);
  }, [channels, sortField, sortOrder]);

  useEffect(() => {
    const sorted = [...channelVideos].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else if (sortField === 'publishedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    setSortedChannelVideos(sorted);
  }, [channelVideos, sortField, sortOrder]);

  useEffect(() => {
    if (videos.length > 0 || channels.length > 0) {
      setCurrentPage(1);
      setNextPageToken(undefined);
      setPrevPageTokens([]);
    }
  }, [filters.videoDuration, filters.maxSubscribers, filters.minViews, filters.categoryId, filters.maxResults]);

  useEffect(() => {
    setCurrentPage(1);
    setNextPageToken(undefined);
    setPrevPageTokens([]);
    setTotalResults(0);
    setError('');
  }, [activeTab]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleSearch = async (pageToken?: string) => {
    if (!currentSearchQuery.trim()) return;
    if (!apiKey) {
      setError('YouTube API 키가 설정되지 않았습니다. 설정 버튼을 눌러 API 키를 입력해주세요.');
      return;
    }
    
    if (activeTab === 'analysis') {
      setError('채널을 먼저 선택해주세요.');
      return;
    }
    
    const isFirstSearch = !pageToken;
    
    if (isFirstSearch) {
      setLoading(true);
      if (activeTab === 'videos') {
        setVideos([]);
      } else if (activeTab === 'channels') {
        setChannels([]);
      }
      setCurrentPage(1);
      setNextPageToken(undefined);
      setPrevPageTokens([]);
      setTotalResults(0);
    } else {
      setLoadingPage(true);
    }
    
    setError('');
    
    try {
      const apiEndpoint = activeTab === 'videos' ? '/api/search' : '/api/search-channels';
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentSearchQuery,
          apiKey: apiKey,
          pageToken: pageToken,
          ...(activeTab === 'videos' ? {
            videoDuration: String(filters.videoDuration || 'any'),
            maxSubscribers: String(filters.maxSubscribers || ''),
            minViews: String(filters.minViews || ''),
            categoryId: String(filters.categoryId || ''),
            maxResults: String(filters.maxResults || '50'),
            publishedAfter: String(filters.publishedAfter || ''),
            publishedBefore: String(filters.publishedBefore || ''),
            sortBy: String(filters.sortBy || 'relevance'),
          } : {
            minSubscribers: String(filters.minSubscribers || ''),
            maxSubscribers: String(filters.maxSubscribers || ''),
            country: String(filters.country || ''),
            maxResults: String(filters.maxResults || '50'),
          })
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (activeTab === 'videos') {
          setVideos(data.videos || []);
        } else if (activeTab === 'channels') {
          setChannels(data.channels || []);
        }
        
        setNextPageToken(data.nextPageToken);
        setTotalResults(data.totalResults || 0);
        
        const resultsLength = activeTab === 'videos' ? data.videos?.length : data.channels?.length;
        if (resultsLength === 0) {
          setError('검색 결과가 없습니다. 다른 키워드를 시도해보세요.');
        }
      } else {
        setError(data.error || '검색 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
    
    if (isFirstSearch) {
      setLoading(false);
    } else {
      setLoadingPage(false);
    }
  };

  const handleNextPage = () => {
    if (!nextPageToken) return;
    
    setPrevPageTokens(prev => [...prev, nextPageToken]);
    setCurrentPage(prev => prev + 1);
    handleSearch(nextPageToken);
  };

  const handlePrevPage = () => {
    if (currentPage <= 1 || prevPageTokens.length === 0) return;
    
    const prevTokens = [...prevPageTokens];
    prevTokens.pop();
    const prevToken = prevTokens[prevTokens.length - 1];
    
    setPrevPageTokens(prevTokens);
    setCurrentPage(prev => prev - 1);
    
    if (currentPage === 2) {
      handleSearch();
    } else {
      handleSearch(prevToken);
    }
  };

  const testApiKey = async () => {
    if (!tempApiKey.trim()) return;
    
    setTestingApiKey(true);
    try {
      const response = await fetch('/api/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: tempApiKey.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setApiKeyStatus('valid');
      } else {
        setApiKeyStatus('invalid');
        setError(data.error);
      }
    } catch (error) {
      console.error('API 키 테스트 오류:', error);
      setApiKeyStatus('invalid');
      setError('API 키 테스트 중 오류가 발생했습니다.');
    }
    setTestingApiKey(false);
  };

  const saveApiKey = () => {
    if (apiKeyStatus === 'valid' && tempApiKey.trim()) {
      localStorage.setItem('youtube-api-key', tempApiKey.trim());
      setApiKey(tempApiKey.trim());
      setShowApiKeyModal(false);
      setTempApiKey('');
      setError('');
    }
  };

  const openApiKeyModal = () => {
    setShowApiKeyModal(true);
    setTempApiKey(apiKey);
    setApiKeyStatus(apiKey ? 'valid' : 'none');
    setError('');
  };

  const closeApiKeyModal = () => {
    setShowApiKeyModal(false);
    setTempApiKey('');
    setApiKeyStatus('none');
    setError('');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const uploadDate = new Date(dateString);
    const diffMs = now.getTime() - uploadDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) return `${diffYears}년 전`;
    if (diffMonths > 0) return `${diffMonths}개월 전`;
    if (diffDays > 0) return `${diffDays}일 전`;
    return '오늘';
  };

  const getDateColorClass = (dateString: string) => {
    const now = new Date();
    const uploadDate = new Date(dateString);
    const diffMs = now.getTime() - uploadDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return 'from-red-500 to-orange-500';
    if (diffDays <= 30) return 'from-orange-500 to-yellow-500';
    if (diffDays <= 90) return 'from-yellow-500 to-green-500';
    if (diffDays <= 365) return 'from-green-500 to-blue-500';
    return 'from-blue-500 to-gray-500';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 50) return { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-700', icon: '🔥' };
    if (score >= 20) return { bg: 'from-green-500 to-emerald-600', text: 'text-green-700', icon: '✨' };
    if (score >= 10) return { bg: 'from-blue-500 to-blue-600', text: 'text-blue-700', icon: '👍' };
    if (score >= 5) return { bg: 'from-yellow-500 to-amber-500', text: 'text-yellow-700', icon: '⚡' };
    if (score >= 1) return { bg: 'from-orange-500 to-orange-600', text: 'text-orange-700', icon: '📊' };
    return { bg: 'from-gray-400 to-gray-500', text: 'text-gray-700', icon: '📉' };
  };

  const [downloadingThumbnails, setDownloadingThumbnails] = useState<Set<string>>(new Set());
  const [copiedUrls, setCopiedUrls] = useState<Set<string>>(new Set());

  const downloadThumbnail = async (videoId: string, title: string, quality: '4k' | 'max' | 'high' | 'medium' | 'default' = '4k') => {
    if (downloadingThumbnails.has(videoId)) return;
    
    setDownloadingThumbnails(prev => new Set(Array.from(prev)).add(videoId));
    
    try {
      const qualityOrder: Array<'4k' | 'max' | 'high' | 'medium' | 'default'> = 
        quality === '4k' ? ['4k', 'max', 'high', 'medium', 'default'] :
        quality === 'max' ? ['max', 'high', 'medium', 'default'] :
        quality === 'high' ? ['high', 'medium', 'default'] :
        quality === 'medium' ? ['medium', 'default'] : 
        ['default'];

      let blob: Blob | null = null;
      let actualQuality = quality;

      for (const q of qualityOrder) {
        try {
          const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${q}.jpg`;
          const response = await fetch(thumbnailUrl);
          
          if (response.ok) {
            blob = await response.blob();
            actualQuality = q;
            break;
          }
        } catch (error) {
          console.warn(`${q} 화질 다운로드 실패, 다음 화질 시도`);
        }
      }

      if (!blob) {
        throw new Error('모든 화질에서 썸네일을 가져올 수 없습니다.');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const safeTitle = title.replace(/[^\w\s-]/g, '').trim().substring(0, 50);
      const qualityLabel = actualQuality.charAt(0).toUpperCase() + actualQuality.slice(1);
      link.download = `${safeTitle}_${videoId}_${qualityLabel}.jpg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('썸네일 다운로드 오류:', error);
      alert('썸네일 다운로드 중 오류가 발생했습니다.');
    } finally {
      setDownloadingThumbnails(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(videoId);
        return newSet;
      });
    }
  };

  const copyVideoUrl = async (videoId: string) => {
    const url = `https://youtube.com/watch?v=${videoId}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrls(prev => new Set(Array.from(prev)).add(videoId));
      
      setTimeout(() => {
        setCopiedUrls(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(videoId);
          return newSet;
        });
      }, 3000);
    } catch (error) {
      console.error('URL 복사 오류:', error);
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopiedUrls(prev => new Set(Array.from(prev)).add(videoId));
      setTimeout(() => {
        setCopiedUrls(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(videoId);
          return newSet;
        });
      }, 3000);
    }
  };


  const videoCardProps = {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header apiKeyStatus={apiKeyStatus} openApiKeyModal={openApiKeyModal} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="flex gap-6">
          {/* 좌측 광고 영역 */}
          <div className="hidden lg:block w-44 flex-shrink-0">
            <VerticalKakaoAd />
          </div>
          
          {/* 우측 메인 컨텐츠 영역 */}
          <div className="flex-1 min-w-0">
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} selectedChannelId={selectedChannelId} />

            <SearchSection 
              activeTab={activeTab} 
              currentSearchQuery={currentSearchQuery} 
              setCurrentSearchQuery={setCurrentSearchQuery} 
              handleSearch={() => handleSearch()} 
              loading={loading} 
              apiKey={apiKey} 
            />

            <FilterSection activeTab={activeTab} filters={filters} setFilters={setFilters} />

            <ErrorMessage error={error} />

            {activeTab === 'videos' && sortedVideos.length > 0 && (
              <VideoList 
                sortedVideos={sortedVideos} 
                currentPage={currentPage} 
                totalResults={totalResults} 
                filters={filters} 
                sortField={sortField} 
                sortOrder={sortOrder} 
                handleSort={handleSort} 
                nextPageToken={nextPageToken} 
                handlePrevPage={() => handlePrevPage()} 
                handleNextPage={() => handleNextPage()} 
                loadingPage={loadingPage} 
                {...videoCardProps}
              />
            )}

            {activeTab === 'channels' && sortedChannels.length > 0 && (
              <ChannelList 
                sortedChannels={sortedChannels} 
                currentPage={currentPage} 
                totalResults={totalResults} 
                filters={filters} 
                sortField={sortField} 
                sortOrder={sortOrder} 
                handleSort={handleSort} 
                nextPageToken={nextPageToken} 
                handlePrevPage={() => handlePrevPage()} 
                handleNextPage={() => handleNextPage()} 
                loadingPage={loadingPage} 
                selectedChannelId={selectedChannelId}
                setSelectedChannelId={setSelectedChannelId}
                loadChannelAnalysis={loadChannelAnalysis}
                setActiveTab={setActiveTab}
                formatNumber={formatNumber}
              />
            )}

            {!loading && !error && 
             ((activeTab === 'videos' && videos.length === 0) || 
              (activeTab === 'channels' && channels.length === 0)) && 
             currentSearchQuery && (
              <EmptyState />
            )}

            {activeTab === 'analysis' && (
              <ChannelAnalysis 
                selectedChannelData={selectedChannelData} 
                channelVideos={sortedChannelVideos} 
                loadingChannelAnalysis={loadingChannelAnalysis} 
                {...videoCardProps}
              />
            )}

            {activeTab === 'favorites' && (
              <Favorites favoriteVideos={favoriteVideos} {...videoCardProps} />
            )}

            <KakaoAd 
              unit="DAN-XefFN3z1sfjALLYG"
              width="320"
              height="100"
              className="mt-8 mb-4"
            />
          </div>
        </div>

        <ApiKeyModal 
          showApiKeyModal={showApiKeyModal}
          closeApiKeyModal={closeApiKeyModal}
          tempApiKey={tempApiKey}
          setTempApiKey={setTempApiKey}
          apiKeyStatus={apiKeyStatus}
          testApiKey={testApiKey}
          testingApiKey={testingApiKey}
          saveApiKey={saveApiKey}
        />

        <ScrollToTopButton showScrollToTop={showScrollToTop} scrollToTop={scrollToTop} />
      </div>
    </div>
  );
}
