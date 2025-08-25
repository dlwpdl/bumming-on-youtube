import { useState, useCallback, useRef, useEffect } from 'react';
import { cache } from '@/lib/cache';

export interface FetchOptions {
  cache?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  debounceMs?: number;
}

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastFetch?: Date;
}

export function useOptimizedFetch<T>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (
    url: string,
    requestInit: RequestInit = {},
    options: FetchOptions = {}
  ): Promise<T | null> => {
    const {
      cache: useCache = true,
      cacheKey = url,
      cacheTTL = 300,
      retries = 3,
      retryDelay = 1000,
      timeout = 30000,
      debounceMs = 0
    } = options;

    // 디바운싱
    if (debounceMs > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      return new Promise((resolve) => {
        debounceTimerRef.current = setTimeout(async () => {
          const result = await fetchData(url, requestInit, { ...options, debounceMs: 0 });
          resolve(result);
        }, debounceMs);
      });
    }

    // 진행 중인 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 캐시에서 확인
    if (useCache) {
      const cachedData = cache.get<T>(cacheKey);
      if (cachedData) {
        setState(prev => ({ ...prev, data: cachedData, loading: false, error: null }));
        return cachedData;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const attemptFetch = async (attempt: number): Promise<T | null> => {
      try {
        // 새로운 AbortController 생성
        abortControllerRef.current = new AbortController();
        
        // 타임아웃 설정
        const timeoutId = setTimeout(() => {
          abortControllerRef.current?.abort();
        }, timeout);

        const response = await fetch(url, {
          ...requestInit,
          signal: abortControllerRef.current.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: T = await response.json();
        
        // 캐시에 저장
        if (useCache) {
          cache.set(cacheKey, data, { ttl: cacheTTL });
        }

        setState({
          data,
          loading: false,
          error: null,
          lastFetch: new Date()
        });

        return data;

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // 취소된 요청은 에러로 처리하지 않음
          return null;
        }

        console.error(`Fetch attempt ${attempt + 1} failed:`, error);

        // 재시도 로직
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
          return attemptFetch(attempt + 1);
        }

        // 최종 실패
        const finalError = error instanceof Error ? error : new Error('Unknown fetch error');
        setState(prev => ({
          ...prev,
          loading: false,
          error: finalError
        }));

        throw finalError;
      }
    };

    try {
      return await attemptFetch(0);
    } catch (error) {
      return null;
    }
  }, []);

  const refetch = useCallback((
    url: string,
    requestInit: RequestInit = {},
    options: FetchOptions = {}
  ) => {
    // 캐시 무효화
    if (options.cacheKey) {
      cache.delete(options.cacheKey);
    }
    return fetchData(url, requestInit, options);
  }, [fetchData]);

  const clearData = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setState(prev => ({ ...prev, loading: false }));
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    ...state,
    fetchData,
    refetch,
    clearData,
    cancel,
    isStale: (maxAge: number = 300000) => { // 5분
      if (!state.lastFetch) return true;
      return Date.now() - state.lastFetch.getTime() > maxAge;
    }
  };
}