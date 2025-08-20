/**
 * 클라이언트 사이드 캐싱 시스템
 * localStorage 기반으로 API 응답을 캐시하여 성능 향상
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in seconds (default: 5 minutes)
  maxSize?: number; // Maximum cache size (default: 100 items)
}

class LocalCache {
  private static instance: LocalCache;
  private readonly PREFIX = 'yt-cache-';
  private readonly defaultTTL = 300; // 5 minutes
  private readonly maxSize = 100;

  private constructor() {}

  static getInstance(): LocalCache {
    if (!LocalCache.instance) {
      LocalCache.instance = new LocalCache();
    }
    return LocalCache.instance;
  }

  /**
   * 캐시에 데이터 저장
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    if (typeof window === 'undefined') return;

    const ttl = options.ttl || this.defaultTTL;
    const now = Date.now();
    
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + (ttl * 1000)
    };

    try {
      const cacheKey = this.PREFIX + key;
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      
      // 캐시 크기 관리
      this.cleanupExpiredItems();
      this.enforceMaxSize();
    } catch (error) {
      console.warn('캐시 저장 실패:', error);
      // localStorage가 가득 찬 경우 오래된 항목 정리
      this.cleanupExpiredItems();
      try {
        localStorage.setItem(this.PREFIX + key, JSON.stringify(cacheItem));
      } catch (retryError) {
        console.error('캐시 저장 재시도 실패:', retryError);
      }
    }
  }

  /**
   * 캐시에서 데이터 조회
   */
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const cacheKey = this.PREFIX + key;
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();

      // 만료 확인
      if (now > cacheItem.expiresAt) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('캐시 조회 실패:', error);
      return null;
    }
  }

  /**
   * 특정 캐시 항목 삭제
   */
  delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.PREFIX + key);
  }

  /**
   * 모든 캐시 삭제
   */
  clear(): void {
    if (typeof window === 'undefined') return;

    const keysToDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PREFIX)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => localStorage.removeItem(key));
  }

  /**
   * 만료된 캐시 항목 정리
   */
  private cleanupExpiredItems(): void {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    const keysToDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cacheItem: CacheItem<any> = JSON.parse(cached);
            if (now > cacheItem.expiresAt) {
              keysToDelete.push(key);
            }
          }
        } catch (error) {
          // 파싱 실패한 항목도 삭제
          keysToDelete.push(key);
        }
      }
    }

    keysToDelete.forEach(key => localStorage.removeItem(key));
  }

  /**
   * 최대 캐시 크기 제한 적용
   */
  private enforceMaxSize(): void {
    if (typeof window === 'undefined') return;

    const cacheItems: Array<{ key: string; timestamp: number }> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cacheItem: CacheItem<any> = JSON.parse(cached);
            cacheItems.push({ key, timestamp: cacheItem.timestamp });
          }
        } catch (error) {
          // 파싱 실패한 항목 삭제
          localStorage.removeItem(key);
        }
      }
    }

    if (cacheItems.length > this.maxSize) {
      // 오래된 순으로 정렬하여 초과분 삭제
      cacheItems.sort((a, b) => a.timestamp - b.timestamp);
      const itemsToDelete = cacheItems.slice(0, cacheItems.length - this.maxSize);
      
      itemsToDelete.forEach(item => localStorage.removeItem(item.key));
    }
  }

  /**
   * 캐시 통계 정보
   */
  getStats(): { count: number; totalSize: number } {
    if (typeof window === 'undefined') return { count: 0, totalSize: 0 };

    let count = 0;
    let totalSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PREFIX)) {
        count++;
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
    }

    return { count, totalSize };
  }
}

// 캐시 키 생성 헬퍼 함수들
export const cacheKeys = {
  videoSearch: (query: string, filters: Record<string, any>) => 
    `video-search-${encodeURIComponent(query)}-${JSON.stringify(filters)}`,
  
  channelSearch: (query: string, filters: Record<string, any>) => 
    `channel-search-${encodeURIComponent(query)}-${JSON.stringify(filters)}`,
  
  channelVideos: (channelId: string, pageToken?: string) => 
    `channel-videos-${channelId}-${pageToken || 'first'}`,
  
  trending: (regionCode: string, categoryId?: string) => 
    `trending-${regionCode}-${categoryId || 'all'}`,
};

// 캐시 인스턴스 내보내기
export const cache = LocalCache.getInstance();

// 캐시 래퍼 함수 - API 호출을 캐시와 함께 처리
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // 먼저 캐시에서 확인
  const cached = cache.get<T>(key);
  if (cached) {
    return cached;
  }

  // 캐시에 없으면 API 호출
  const data = await fetcher();
  
  // 결과를 캐시에 저장
  cache.set(key, data, options);
  
  return data;
}