
import { Key, X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { validateApiKeySecurity, isValidApiKeyFormat } from '@/lib/env';

interface ApiKeyModalProps {
  showApiKeyModal: boolean;
  closeApiKeyModal: () => void;
  tempApiKey: string;
  setTempApiKey: (key: string) => void;
  apiKeyStatus: 'none' | 'valid' | 'invalid';
  testingApiKey: boolean;
  testApiKey: () => void;
  saveApiKey: () => void;
}

export default function ApiKeyModal({ 
  showApiKeyModal, 
  closeApiKeyModal, 
  tempApiKey, 
  setTempApiKey, 
  apiKeyStatus, 
  testingApiKey, 
  testApiKey, 
  saveApiKey 
}: ApiKeyModalProps) {
  if (!showApiKeyModal) return null;

  // 실시간 API 키 검증
  const validation = tempApiKey.trim() ? validateApiKeySecurity(tempApiKey.trim()) : { isValid: true, errors: [] };
  const hasFormatError = tempApiKey.trim() && !isValidApiKeyFormat(tempApiKey.trim());
  
  const handleApiKeyChange = (value: string) => {
    // 스페이스와 특수문자 제거 (API 키에 불필요한 문자)
    const cleanedValue = value.replace(/\s/g, '');
    setTempApiKey(cleanedValue);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-3xl shadow-2xl border border-white/30 max-w-lg w-full p-4 sm:p-8 animate-in fade-in-0 zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 gradient-primary rounded-2xl shadow-lg float-animation">
              <Key className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold gradient-text-primary">API 키 설정</h2>
              <p className="text-sm sm:text-base text-gray-600 font-medium">YouTube Data API 연결 🔑</p>
            </div>
          </div>
          <button
            onClick={closeApiKeyModal}
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 sm:mb-3">
              API 키 입력
            </label>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="AIza로 시작하는 39자리 YouTube API 키"
              className={`w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border rounded-xl sm:rounded-2xl focus:ring-2 focus:bg-white transition-all text-base sm:text-lg font-medium ${
                hasFormatError 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-red-500 focus:border-red-500'
              }`}
            />
            {tempApiKey.trim() && (
              <div className="text-xs text-gray-500 mt-1">
                길이: {tempApiKey.length}/39자 {isValidApiKeyFormat(tempApiKey) ? '✓' : '✗'}
              </div>
            )}
          </div>

          {/* API 키 상태 표시 */}
          {apiKeyStatus === 'valid' && (
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl sm:rounded-2xl">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
              <span className="text-sm sm:text-base font-bold text-emerald-800">API 키가 유효합니다! ✨</span>
            </div>
          )}

          {apiKeyStatus === 'invalid' && (
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl sm:rounded-2xl">
              <div className="p-2 bg-red-100 rounded-xl">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <span className="text-sm sm:text-base font-bold text-red-800">API 키가 유효하지 않습니다</span>
            </div>
          )}

          {/* 실시간 검증 오류 표시 */}
          {!validation.isValid && validation.errors.length > 0 && (
            <div className="space-y-2">
              {validation.errors.map((error, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-amber-800">{error}</span>
                </div>
              ))}
            </div>
          )}

          {/* API 키 발급 안내 */}
          <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 rounded-xl sm:rounded-2xl">
            <h3 className="font-bold text-blue-900 mb-3 sm:mb-4 text-base sm:text-lg">📋 API 키 발급 가이드</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span className="font-semibold text-blue-900">
                  <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">
                    Google Cloud Console
                  </a> 접속
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span className="font-semibold text-blue-900">프로젝트 생성 또는 선택</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span className="font-semibold text-blue-900">YouTube Data API v3 활성화</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                <span className="font-semibold text-blue-900">API 키 생성 후 복사하여 붙여넣기</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🔑 API 키 지속시간</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 한번 저장하면 브라우저에 영구 저장</li>
                <li>• 사용 한도: 일일 10,000요청 (무료)</li>
                <li>• 영상 50개 검색 ≈ 약 100요청 소모</li>
              </ul>
            </div>
            
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">💾 데이터 저장 안내</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 즐겨찾기: 브라우저 로컬스토리지에 저장</li>
                <li>• 별도 서버 없이 로컬에서 관리</li>
                <li>• 브라우저 데이터 삭제 시 소실</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={testApiKey}
              disabled={!tempApiKey.trim() || testingApiKey}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 glass-effect border-2 border-blue-200 text-blue-700 rounded-2xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 transition-all font-bold hover:scale-105 duration-300"
            >
              {testingApiKey ? (
                <>
                  <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                  테스트 중...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  키 테스트
                </>
              )}
            </button>
            <button
              onClick={saveApiKey}
              disabled={apiKeyStatus !== 'valid'}
              className="flex-1 btn-gradient px-4 sm:px-6 py-3 sm:py-4 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 font-bold hover:scale-105 duration-300"
            >
              <Key className="w-4 h-4 sm:w-5 sm:h-5" />
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
