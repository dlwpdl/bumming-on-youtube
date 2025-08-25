import { useState, useCallback } from 'react';
import { VideoData } from '@/lib/youtube';
import { ChannelData } from '@/lib/types';

export interface AdvancedSearchFilters {
  // 기본 필터
  query: string;
  category: string;
  country: string;
  language: string;
  
  // 날짜 필터
  dateRange: 'hour' | 'today' | 'week' | 'month' | 'year' | 'custom' | 'any';
  publishedAfter?: string;
  publishedBefore?: string;
  
  // 영상 관련 필터
  duration: 'short' | 'medium' | 'long' | 'any';
  quality: '4k' | 'hd' | 'any';
  captions: boolean;
  
  // 성과 관련 필터
  minViews: number;
  maxViews: number;
  minLikes: number;
  minComments: number;
  
  // 채널 관련 필터
  minSubscribers: number;
  maxSubscribers: number;
  channelType: 'any' | 'verified' | 'partner';
  
  // 정렬
  sortBy: 'relevance' | 'date' | 'views' | 'rating' | 'title';
  order: 'desc' | 'asc';
  
  // 고급 옵션
  excludeKeywords: string[];
  includeKeywords: string[];
  exactPhrase: string;
}

export function useAdvancedSearch() {
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    query: '',
    category: '',
    country: '',
    language: '',
    dateRange: 'any',
    duration: 'any',
    quality: 'any',
    captions: false,
    minViews: 0,
    maxViews: 0,
    minLikes: 0,
    minComments: 0,
    minSubscribers: 0,
    maxSubscribers: 0,
    channelType: 'any',
    sortBy: 'relevance',
    order: 'desc',
    excludeKeywords: [],
    includeKeywords: [],
    exactPhrase: ''
  });

  const updateFilter = useCallback(<K extends keyof AdvancedSearchFilters>(
    key: K,
    value: AdvancedSearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<AdvancedSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      query: '',
      category: '',
      country: '',
      language: '',
      dateRange: 'any',
      duration: 'any',
      quality: 'any',
      captions: false,
      minViews: 0,
      maxViews: 0,
      minLikes: 0,
      minComments: 0,
      minSubscribers: 0,
      maxSubscribers: 0,
      channelType: 'any',
      sortBy: 'relevance',
      order: 'desc',
      excludeKeywords: [],
      includeKeywords: [],
      exactPhrase: ''
    });
  }, []);

  const buildSearchQuery = useCallback(() => {
    let query = filters.query;

    // 정확한 구문 검색
    if (filters.exactPhrase) {
      query += ` "${filters.exactPhrase}"`;
    }

    // 포함할 키워드
    filters.includeKeywords.forEach(keyword => {
      if (keyword.trim()) {
        query += ` +${keyword.trim()}`;
      }
    });

    // 제외할 키워드
    filters.excludeKeywords.forEach(keyword => {
      if (keyword.trim()) {
        query += ` -${keyword.trim()}`;
      }
    });

    return query.trim();
  }, [filters]);

  const buildApiParams = useCallback(() => {
    const params: Record<string, any> = {
      q: buildSearchQuery(),
      order: filters.sortBy === 'relevance' ? 'relevance' : filters.sortBy,
      part: 'snippet,statistics',
      maxResults: 50
    };

    // 카테고리 ID
    if (filters.category && filters.category !== 'any') {
      params.videoCategoryId = filters.category;
    }

    // 지역 코드
    if (filters.country && filters.country !== 'any') {
      params.regionCode = filters.country;
    }

    // 언어
    if (filters.language && filters.language !== 'any') {
      params.relevanceLanguage = filters.language;
    }

    // 날짜 범위
    if (filters.dateRange !== 'any') {
      if (filters.dateRange === 'custom') {
        if (filters.publishedAfter) {
          params.publishedAfter = new Date(filters.publishedAfter).toISOString();
        }
        if (filters.publishedBefore) {
          params.publishedBefore = new Date(filters.publishedBefore).toISOString();
        }
      } else {
        const now = new Date();
        let publishedAfter: Date;
        
        switch (filters.dateRange) {
          case 'hour':
            publishedAfter = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case 'today':
            publishedAfter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            publishedAfter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            publishedAfter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            publishedAfter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            publishedAfter = new Date(0);
        }
        params.publishedAfter = publishedAfter.toISOString();
      }
    }

    // 영상 길이
    if (filters.duration !== 'any') {
      params.videoDuration = filters.duration;
    }

    // 영상 품질
    if (filters.quality !== 'any') {
      if (filters.quality === '4k') {
        params.videoDefinition = 'high';
      } else if (filters.quality === 'hd') {
        params.videoDefinition = 'high';
      }
    }

    // 자막 여부
    if (filters.captions) {
      params.videoCaption = 'closedCaption';
    }

    return params;
  }, [filters, buildSearchQuery]);

  const filterResults = useCallback((
    results: VideoData[] | ChannelData[]
  ): VideoData[] | ChannelData[] => {
    return results.filter(item => {
      // 조회수 필터 (영상만)
      if ('viewCount' in item) {
        if (filters.minViews > 0 && item.viewCount < filters.minViews) return false;
        if (filters.maxViews > 0 && item.viewCount > filters.maxViews) return false;
      }

      // 구독자 수 필터 (채널 또는 영상의 채널)
      if ('subscriberCount' in item) {
        if (filters.minSubscribers > 0 && item.subscriberCount < filters.minSubscribers) return false;
        if (filters.maxSubscribers > 0 && item.subscriberCount > filters.maxSubscribers) return false;
      }

      return true;
    });
  }, [filters]);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.query.trim() !== '' ||
      filters.category !== '' ||
      filters.country !== '' ||
      filters.language !== '' ||
      filters.dateRange !== 'any' ||
      filters.duration !== 'any' ||
      filters.quality !== 'any' ||
      filters.captions ||
      filters.minViews > 0 ||
      filters.maxViews > 0 ||
      filters.minLikes > 0 ||
      filters.minComments > 0 ||
      filters.minSubscribers > 0 ||
      filters.maxSubscribers > 0 ||
      filters.channelType !== 'any' ||
      filters.sortBy !== 'relevance' ||
      filters.excludeKeywords.length > 0 ||
      filters.includeKeywords.length > 0 ||
      filters.exactPhrase !== ''
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    buildSearchQuery,
    buildApiParams,
    filterResults,
    hasActiveFilters: hasActiveFilters()
  };
}