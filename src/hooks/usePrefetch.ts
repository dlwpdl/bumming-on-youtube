import { useCallback, useRef } from 'react';
import { cache } from '@/lib/cache';

interface PrefetchOptions {
  priority?: 'high' | 'low';
  cacheTTL?: number;
  condition?: () => boolean;
}

export function usePrefetch() {
  const prefetchQueueRef = useRef<Map<string, Promise<any>>>(new Map());

  const prefetch = useCallback(async (
    url: string,
    requestInit: RequestInit = {},
    options: PrefetchOptions = {}
  ) => {
    const {
      priority = 'low',
      cacheTTL = 300,
      condition = () => true
    } = options;

    // 조건 확인
    if (!condition()) return;

    // 이미 캐시에 있으면 스�ip
    if (cache.get(url)) return;

    // 이미 진행 중인 요청이 있으면 재사용
    const existingPromise = prefetchQueueRef.current.get(url);
    if (existingPromise) return existingPromise;

    const prefetchPromise = (async () => {
      try {
        // 우선순위에 따른 지연
        if (priority === 'low') {
          // 낮은 우선순위는 약간의 지연 후 실행
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const response = await fetch(url, {
          ...requestInit,
          // 프리페치는 사용자 경험에 영향을 주지 않아야 함
          priority: 'low' as any,
        });

        if (!response.ok) {
          throw new Error(`Prefetch failed: ${response.status}`);
        }

        const data = await response.json();
        
        // 캐시에 저장
        cache.set(url, data, { ttl: cacheTTL });
        
        return data;
      } catch (error) {
        console.warn('Prefetch failed:', url, error);
        return null;
      } finally {
        // 큐에서 제거
        prefetchQueueRef.current.delete(url);
      }
    })();

    prefetchQueueRef.current.set(url, prefetchPromise);
    return prefetchPromise;
  }, []);

  const prefetchMultiple = useCallback(async (
    requests: Array<{
      url: string;
      requestInit?: RequestInit;
      options?: PrefetchOptions;
    }>
  ) => {
    // 동시 실행 제한 (브라우저 부담 방지)
    const concurrentLimit = 3;
    const chunks = [];
    
    for (let i = 0; i < requests.length; i += concurrentLimit) {
      chunks.push(requests.slice(i, i + concurrentLimit));
    }

    for (const chunk of chunks) {
      await Promise.allSettled(
        chunk.map(req => prefetch(req.url, req.requestInit, req.options))
      );
      
      // 각 청크 간 약간의 지연
      if (chunks.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }, [prefetch]);

  const prefetchOnHover = useCallback((
    url: string,
    requestInit?: RequestInit,
    options?: PrefetchOptions
  ) => {
    let hoverTimer: NodeJS.Timeout;

    const handleMouseEnter = () => {
      // 마우스 오버 후 짧은 지연 후 프리페치 시작
      hoverTimer = setTimeout(() => {
        prefetch(url, requestInit, options);
      }, 300); // 300ms 지연으로 의도적인 호버만 감지
    };

    const handleMouseLeave = () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };

    return {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    };
  }, [prefetch]);

  const prefetchOnIntersection = useCallback((
    url: string,
    requestInit?: RequestInit,
    options?: PrefetchOptions
  ) => {
    const observerRef = useRef<IntersectionObserver>();

    const observe = (element: Element) => {
      if (!element) return;

      // 이미 관찰 중이면 스킵
      if (observerRef.current) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // 뷰포트에 들어오면 프리페치
              prefetch(url, requestInit, {
                ...options,
                condition: () => entry.intersectionRatio > 0.1 // 10% 이상 보일 때
              });
              
              // 한 번 프리페치하면 관찰 중단
              observerRef.current?.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // 50px 전에 미리 감지
          threshold: 0.1
        }
      );

      observerRef.current.observe(element);
    };

    const disconnect = () => {
      observerRef.current?.disconnect();
    };

    return { observe, disconnect };
  }, [prefetch]);

  const clearPrefetchQueue = useCallback(() => {
    prefetchQueueRef.current.clear();
  }, []);

  return {
    prefetch,
    prefetchMultiple,
    prefetchOnHover,
    prefetchOnIntersection,
    clearPrefetchQueue,
    queueSize: () => prefetchQueueRef.current.size
  };
}