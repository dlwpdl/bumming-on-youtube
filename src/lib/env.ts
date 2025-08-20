/**
 * 사용자 API 키 관리 및 검증 유틸리티
 */

/**
 * API 키 마스킹 함수 (로깅용)
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return '***';
  return `${apiKey.substring(0, 4)}***${apiKey.substring(apiKey.length - 4)}`;
}

/**
 * API 키 유효성 검사 (형식 검증)
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') return false;
  
  // Google API 키의 일반적인 형식
  // AIza로 시작하고 총 39자, 영숫자와 하이픈, 언더스코어만 포함
  const googleApiKeyPattern = /^AIza[0-9A-Za-z_-]{35}$/;
  
  return googleApiKeyPattern.test(apiKey.trim());
}

/**
 * API 키 보안 검증 (추가 보안 체크)
 */
export function validateApiKeySecurity(apiKey: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!apiKey) {
    errors.push('API 키가 비어있습니다.');
    return { isValid: false, errors };
  }
  
  const trimmedKey = apiKey.trim();
  
  // 기본 형식 검증
  if (!isValidApiKeyFormat(trimmedKey)) {
    errors.push('올바른 Google API 키 형식이 아닙니다. (AIza로 시작하는 39자)');
  }
  
  // 보안 위험 패턴 검사
  const riskyPatterns = [
    { pattern: /test|demo|example|sample/i, message: '테스트용 키로 보입니다.' },
    { pattern: /^AIza[0]{10,}/, message: '기본값이나 더미 키로 보입니다.' },
  ];
  
  riskyPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(trimmedKey)) {
      errors.push(message);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * localStorage에서 API 키를 안전하게 저장/조회
 */
export const apiKeyStorage = {
  key: 'youtube-api-key',
  
  save(apiKey: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      // 간단한 인코딩 (완전한 암호화는 아니지만 기본 보안)
      const encoded = btoa(apiKey);
      localStorage.setItem(this.key, encoded);
    } catch (error) {
      console.error('API 키 저장 오류:', error);
    }
  },
  
  load(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const encoded = localStorage.getItem(this.key);
      if (!encoded) return null;
      
      return atob(encoded);
    } catch (error) {
      console.error('API 키 로드 오류:', error);
      this.clear();
      return null;
    }
  },
  
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.key);
  }
};

/**
 * API 키 사용 기록 관리 (선택적)
 */
export const apiKeyUsage = {
  logUsage(endpoint: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const key = `api-usage-${today}`;
      const usage = JSON.parse(localStorage.getItem(key) || '{}');
      
      usage[endpoint] = (usage[endpoint] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(usage));
    } catch (error) {
      // 사용량 로깅 실패는 앱 동작에 영향주지 않음
    }
  },
  
  getTodayUsage(): Record<string, number> {
    if (typeof window === 'undefined') return {};
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const key = `api-usage-${today}`;
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (error) {
      return {};
    }
  }
};