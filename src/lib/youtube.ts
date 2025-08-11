import { google } from 'googleapis';

export interface VideoData {
  id: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  subscriberCount: number;
  duration: string;
  publishedAt: string;
  thumbnail: string;
  channelId: string;
  categoryId: string;
  performanceScore: number;
}

export interface ChannelData {
  id: string;
  title: string;
  description: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  thumbnail: string;
  publishedAt: string;
  country?: string;
  customUrl?: string;
  engagementRate?: number;
}

export interface ChannelSearchResult {
  channels: ChannelData[];
  nextPageToken?: string;
  totalResults?: number;
}

export interface SearchFilters {
  query: string;
  videoDuration: 'any' | 'short' | 'medium' | 'long' | 'ultra_long';
  maxSubscribers?: number;
  minViews?: number;
  categoryId?: string;
  maxResults: number;
  pageToken?: string;
}

export interface ChannelSearchFilters {
  query: string;
  minSubscribers?: number;
  maxSubscribers?: number;
  country?: string;
  maxResults: number;
  pageToken?: string;
}

export interface SearchResult {
  videos: VideoData[];
  nextPageToken?: string;
  totalResults?: number;
}

export function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

export function calculatePerformanceScore(viewCount: number, subscriberCount: number): number {
  if (subscriberCount === 0) return viewCount / 1000;
  return (viewCount / subscriberCount) * 100;
}

export function filterByDuration(durationSeconds: number, filter: string): boolean {
  switch (filter) {
    case 'short': return durationSeconds <= 60;
    case 'medium': return durationSeconds > 60 && durationSeconds < 600;
    case 'long': return durationSeconds >= 600;
    case 'ultra_long': return durationSeconds >= 600;
    default: return true;
  }
}

export async function searchVideos(filters: SearchFilters, apiKey: string): Promise<SearchResult> {
  try {
    console.log('검색 시작:', filters);
    
    if (!apiKey) {
      console.error('YouTube API 키가 설정되지 않았습니다');
      throw new Error('YouTube API 키가 필요합니다');
    }

    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    });

    const searchParams: any = {
      part: ['snippet'],
      q: filters.query,
      type: ['video'],
      maxResults: Math.min(filters.maxResults, 50),
      order: 'relevance',
    };
    
    if (filters.pageToken) {
      searchParams.pageToken = filters.pageToken;
    }

    // Duration 필터는 YouTube API가 지원하지 않으므로 제거
    if (filters.categoryId) {
      searchParams.videoCategoryId = filters.categoryId;
    }

    console.log('검색 파라미터:', searchParams);

    const searchResponse = await youtube.search.list(searchParams);
    
    console.log('검색 응답:', searchResponse.data);

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      console.log('검색 결과가 없습니다');
      return {
        videos: [],
        nextPageToken: undefined,
        totalResults: 0
      };
    }

    const videoIds = searchResponse.data.items
      .map(item => item.id?.videoId)
      .filter((id): id is string => Boolean(id));
    
    console.log('비디오 IDs:', videoIds);

    if (videoIds.length === 0) return {
      videos: [],
      nextPageToken: searchResponse.data.nextPageToken || undefined,
      totalResults: searchResponse.data.pageInfo?.totalResults || 0
    };

    const [videoDetails, channelDetails] = await Promise.all([
      youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: videoIds,
      }),
      getChannelDetails(searchResponse.data.items.map(item => item.snippet?.channelId).filter((id): id is string => Boolean(id)), apiKey)
    ]);

    console.log('비디오 상세:', videoDetails.data);
    console.log('채널 상세:', channelDetails);

    const channelMap = new Map(channelDetails.map(channel => [channel.id, channel]));

    const videos: VideoData[] = [];
    
    for (const video of videoDetails.data.items || []) {
      const channelData = channelMap.get(video.snippet?.channelId || '');
      const viewCount = parseInt(video.statistics?.viewCount || '0');
      const subscriberCount = parseInt(channelData?.statistics?.subscriberCount || '0');
      const durationSeconds = parseDuration(video.contentDetails?.duration || '');
      
      // 클라이언트 사이드에서 필터링
      if (filters.maxSubscribers && subscriberCount > filters.maxSubscribers) continue;
      if (filters.minViews && viewCount < filters.minViews) continue;
      if (filters.videoDuration !== 'any' && !filterByDuration(durationSeconds, filters.videoDuration)) continue;

      videos.push({
        id: video.id || '',
        title: video.snippet?.title || '',
        channelTitle: video.snippet?.channelTitle || '',
        viewCount,
        subscriberCount,
        duration: video.contentDetails?.duration || '',
        publishedAt: video.snippet?.publishedAt || '',
        thumbnail: video.snippet?.thumbnails?.medium?.url || '',
        channelId: video.snippet?.channelId || '',
        categoryId: video.snippet?.categoryId || '',
        performanceScore: calculatePerformanceScore(viewCount, subscriberCount),
      });
    }

    console.log('최종 결과:', videos);
    return {
      videos,
      nextPageToken: searchResponse.data.nextPageToken || undefined,
      totalResults: searchResponse.data.pageInfo?.totalResults || 0
    };
  } catch (error) {
    console.error('YouTube API 상세 오류:', error);
    throw error;
  }
}

async function getChannelDetails(channelIds: string[], apiKey: string) {
  if (channelIds.length === 0) return [];
  
  const youtube = google.youtube({
    version: 'v3',
    auth: apiKey,
  });
  
  const channelResponse = await youtube.channels.list({
    part: ['statistics'],
    id: channelIds,
  });

  return channelResponse.data.items || [];
}

export async function searchChannels(filters: ChannelSearchFilters, apiKey: string): Promise<ChannelSearchResult> {
  try {
    console.log('채널 검색 시작:', filters);
    
    if (!apiKey) {
      console.error('YouTube API 키가 설정되지 않았습니다');
      throw new Error('YouTube API 키가 필요합니다');
    }

    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    });

    const searchParams: any = {
      part: ['snippet'],
      q: filters.query,
      type: ['channel'],
      maxResults: Math.min(filters.maxResults, 50),
      order: 'relevance',
    };
    
    if (filters.pageToken) {
      searchParams.pageToken = filters.pageToken;
    }

    if (filters.country) {
      searchParams.regionCode = filters.country;
    }

    console.log('채널 검색 파라미터:', searchParams);

    const searchResponse = await youtube.search.list(searchParams);
    
    console.log('채널 검색 응답:', searchResponse.data);

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      console.log('채널 검색 결과가 없습니다');
      return {
        channels: [],
        nextPageToken: undefined,
        totalResults: 0
      };
    }

    const channelIds = searchResponse.data.items
      .map(item => item.id?.channelId)
      .filter((id): id is string => Boolean(id));
    
    console.log('채널 IDs:', channelIds);

    if (channelIds.length === 0) return {
      channels: [],
      nextPageToken: searchResponse.data.nextPageToken || undefined,
      totalResults: searchResponse.data.pageInfo?.totalResults || 0
    };

    const channelDetails = await youtube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings'],
      id: channelIds,
    });

    console.log('채널 상세:', channelDetails.data);

    const channels: ChannelData[] = [];
    
    for (const channel of channelDetails.data.items || []) {
      const subscriberCount = parseInt(channel.statistics?.subscriberCount || '0');
      const viewCount = parseInt(channel.statistics?.viewCount || '0');
      const videoCount = parseInt(channel.statistics?.videoCount || '0');
      
      // 클라이언트 사이드에서 필터링
      if (filters.minSubscribers && subscriberCount < filters.minSubscribers) continue;
      if (filters.maxSubscribers && subscriberCount > filters.maxSubscribers) continue;

      // 참여율 계산 (대략적인 계산)
      const engagementRate = videoCount > 0 ? (viewCount / subscriberCount / videoCount) * 100 : 0;

      channels.push({
        id: channel.id || '',
        title: channel.snippet?.title || '',
        description: channel.snippet?.description || '',
        subscriberCount,
        viewCount,
        videoCount,
        thumbnail: channel.snippet?.thumbnails?.medium?.url || '',
        publishedAt: channel.snippet?.publishedAt || '',
        country: channel.snippet?.country,
        customUrl: channel.snippet?.customUrl,
        engagementRate,
      });
    }

    console.log('최종 채널 결과:', channels);
    return {
      channels,
      nextPageToken: searchResponse.data.nextPageToken || undefined,
      totalResults: searchResponse.data.pageInfo?.totalResults || 0
    };
  } catch (error) {
    console.error('YouTube 채널 검색 API 상세 오류:', error);
    throw error;
  }
}