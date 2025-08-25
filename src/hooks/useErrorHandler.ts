import { useState, useCallback } from 'react';

export interface ErrorState {
  message: string;
  code?: string | number;
  details?: string;
  timestamp: Date;
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState | null>(null);

  const handleError = useCallback((
    message: string, 
    code?: string | number, 
    details?: string
  ) => {
    const errorState: ErrorState = {
      message,
      code,
      details,
      timestamp: new Date()
    };
    setError(errorState);
    console.error('Error handled:', errorState);
  }, []);

  const handleApiError = useCallback((response: Response, data?: any) => {
    let message = '알 수 없는 오류가 발생했습니다.';
    let details = '';

    if (response.status === 400) {
      message = '잘못된 요청입니다.';
      details = data?.error || '요청 데이터를 확인해주세요.';
    } else if (response.status === 401) {
      message = 'API 키가 유효하지 않습니다.';
      details = '설정에서 올바른 YouTube API 키를 입력해주세요.';
    } else if (response.status === 403) {
      message = 'API 할당량이 초과되었습니다.';
      details = '잠시 후 다시 시도하거나 새로운 API 키를 사용해주세요.';
    } else if (response.status === 404) {
      message = '요청한 리소스를 찾을 수 없습니다.';
      details = '검색 조건을 변경하여 다시 시도해주세요.';
    } else if (response.status === 429) {
      message = '너무 많은 요청을 보냈습니다.';
      details = '잠시 후 다시 시도해주세요.';
    } else if (response.status >= 500) {
      message = '서버 오류가 발생했습니다.';
      details = '잠시 후 다시 시도해주세요.';
    } else if (data?.error) {
      message = data.error;
    }

    handleError(message, response.status, details);
  }, [handleError]);

  const handleNetworkError = useCallback((error: Error) => {
    let message = '네트워크 오류가 발생했습니다.';
    let details = '인터넷 연결을 확인하고 다시 시도해주세요.';

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      details = '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.';
    } else if (error.name === 'AbortError') {
      message = '요청이 취소되었습니다.';
      details = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
    }

    handleError(message, error.name, details);
  }, [handleError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback((fn: () => Promise<void> | void) => {
    clearError();
    try {
      const result = fn();
      if (result instanceof Promise) {
        result.catch((err) => {
          if (err instanceof Error) {
            handleNetworkError(err);
          } else {
            handleError('재시도 중 오류가 발생했습니다.');
          }
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        handleNetworkError(err);
      } else {
        handleError('재시도 중 오류가 발생했습니다.');
      }
    }
  }, [clearError, handleError, handleNetworkError]);

  return {
    error,
    setError,
    handleError,
    handleApiError,
    handleNetworkError,
    clearError,
    retry
  };
}