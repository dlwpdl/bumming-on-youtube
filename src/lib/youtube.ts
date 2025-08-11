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

export interface SearchFilters {
  query: string;
  videoDuration: 'any' | 'short' | 'medium' | 'long' | 'ultra_long';
  maxSubscribers?: number;
  minViews?: number;
  categoryId?: string;
  maxResults: number;
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

export async function searchVideos(filters: SearchFilters, apiKey: string): Promise<VideoData[]> {
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

    // Duration 필터는 YouTube API가 지원하지 않으므로 제거
    if (filters.categoryId) {
      searchParams.videoCategoryId = filters.categoryId;
    }

    console.log('검색 파라미터:', searchParams);

    const searchResponse = await youtube.search.list(searchParams);
    
    console.log('검색 응답:', searchResponse.data);

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      console.log('검색 결과가 없습니다');
      return [];
    }

    const videoIds = searchResponse.data.items
      .map(item => item.id?.videoId)
      .filter((id): id is string => Boolean(id));
    
    console.log('비디오 IDs:', videoIds);

    if (videoIds.length === 0) return [];

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
    return videos;
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