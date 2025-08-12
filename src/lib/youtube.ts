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
  publishedAfter?: string;
  publishedBefore?: string;
  sortBy?: 'relevance' | 'date' | 'viewCount' | 'rating';
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

export function convertToISO(dateString: string): string {
  if (!dateString) return '';
  
  // YYYY-MM-DD 형식을 ISO 8601 형식으로 변환
  const date = new Date(dateString);
  return date.toISOString();
}

export function extractChannelIdFromUrl(url: string): string | null {
  try {
    const cleanUrl = decodeURIComponent(url);
    
    // @handle 형태 (예: youtube.com/@channelname)
    const handleMatch = cleanUrl.match(/youtube\.com\/@([^/?&]+)/);
    if (handleMatch) {
      return `@${handleMatch[1]}`;
    }
    
    // /channel/ID 형태 (예: youtube.com/channel/UC123456)
    const channelMatch = cleanUrl.match(/youtube\.com\/channel\/([^/?&]+)/);
    if (channelMatch) {
      return channelMatch[1];
    }
    
    // /c/channelname 형태 (예: youtube.com/c/channelname)
    const customMatch = cleanUrl.match(/youtube\.com\/c\/([^/?&]+)/);
    if (customMatch) {
      return customMatch[1];
    }
    
    // /user/username 형태 (예: youtube.com/user/username)
    const userMatch = cleanUrl.match(/youtube\.com\/user\/([^/?&]+)/);
    if (userMatch) {
      return userMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error('URL 파싱 오류:', error);
    return null;
  }
}

export async function getChannelIdFromHandle(handle: string, apiKey: string): Promise<string | null> {
  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    });
    
    // @ 기호가 있으면 제거
    const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
    
    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      q: cleanHandle,
      type: ['channel'],
      maxResults: 5,
    });
    
    if (searchResponse.data.items && searchResponse.data.items.length > 0) {
      for (const item of searchResponse.data.items) {
        const channelId = item.snippet?.channelId;
        if (channelId) {
          // 채널 상세 정보를 가져와서 정확한 채널인지 확인
          const channelResponse = await youtube.channels.list({
            part: ['snippet'],
            id: [channelId],
          });
          
          const channel = channelResponse.data.items?.[0];
          if (channel && channel.snippet?.customUrl?.toLowerCase().includes(cleanHandle.toLowerCase())) {
            return channelId;
          }
        }
      }
      // 정확한 매치가 없으면 첫 번째 결과 반환
      return searchResponse.data.items[0].snippet?.channelId || null;
    }
    
    return null;
  } catch (error) {
    console.error('Handle에서 채널 ID 가져오기 오류:', error);
    return null;
  }
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
      order: filters.sortBy || 'relevance',
    };
    
    if (filters.pageToken) {
      searchParams.pageToken = filters.pageToken;
    }

    if (filters.publishedAfter) {
      searchParams.publishedAfter = convertToISO(filters.publishedAfter);
    }

    if (filters.publishedBefore) {
      searchParams.publishedBefore = convertToISO(filters.publishedBefore);
    }

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

    // URL인지 확인하고 채널 ID 추출
    const channelIdFromUrl = extractChannelIdFromUrl(filters.query);
    
    if (channelIdFromUrl) {
      console.log('URL에서 추출된 채널 정보:', channelIdFromUrl);
      
      let finalChannelId = channelIdFromUrl;
      
      // @handle 형태인 경우 실제 채널 ID로 변환
      if (channelIdFromUrl.startsWith('@')) {
        const resolvedId = await getChannelIdFromHandle(channelIdFromUrl, apiKey);
        if (resolvedId) {
          finalChannelId = resolvedId;
        }
      }
      
      try {
        // 직접 채널 정보 가져오기
        const channelResponse = await youtube.channels.list({
          part: ['snippet', 'statistics', 'brandingSettings'],
          id: [finalChannelId],
        });
        
        if (channelResponse.data.items && channelResponse.data.items.length > 0) {
          const channel = channelResponse.data.items[0];
          const subscriberCount = parseInt(channel.statistics?.subscriberCount || '0');
          const viewCount = parseInt(channel.statistics?.viewCount || '0');
          const videoCount = parseInt(channel.statistics?.videoCount || '0');
          
          // 필터 조건 확인
          if (filters.minSubscribers && subscriberCount < filters.minSubscribers) {
            return {
              channels: [],
              nextPageToken: undefined,
              totalResults: 0
            };
          }
          if (filters.maxSubscribers && subscriberCount > filters.maxSubscribers) {
            return {
              channels: [],
              nextPageToken: undefined,
              totalResults: 0
            };
          }
          
          const engagementRate = videoCount > 0 ? (viewCount / subscriberCount / videoCount) * 100 : 0;
          
          return {
            channels: [{
              id: channel.id || '',
              title: channel.snippet?.title || '',
              description: channel.snippet?.description || '',
              subscriberCount,
              viewCount,
              videoCount,
              thumbnail: channel.snippet?.thumbnails?.medium?.url || '',
              publishedAt: channel.snippet?.publishedAt || '',
              country: channel.snippet?.country || undefined,
              customUrl: channel.snippet?.customUrl || undefined,
              engagementRate,
            }],
            nextPageToken: undefined,
            totalResults: 1
          };
        }
      } catch (directError) {
        console.log('직접 채널 조회 실패, 검색으로 대체:', directError);
        // 직접 조회 실패 시 일반 검색으로 대체
      }
    }

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
        country: channel.snippet?.country || undefined,
        customUrl: channel.snippet?.customUrl || undefined,
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