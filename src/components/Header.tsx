
import { Youtube, Sparkles, CheckCircle, XCircle, Settings } from 'lucide-react';

interface HeaderProps {
  apiKeyStatus: 'none' | 'valid' | 'invalid';
  openApiKeyModal: () => void;
}

export default function Header({ apiKeyStatus, openApiKeyModal }: HeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <Youtube className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">유튜브 분석기</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">고성능 영상 발굴 도구</p>
          </div>
        </div>
        
        {/* API 키 상태 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {apiKeyStatus === 'valid' ? (
            <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">연결됨</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
              <XCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">API 키 필요</span>
            </div>
          )}
          
          {/* 모바일용 상태 아이콘 */}
          <div className="sm:hidden">
            {apiKeyStatus === 'valid' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-600" />
            )}
          </div>
          
          <button
            onClick={openApiKeyModal}
            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
              apiKeyStatus === 'valid' 
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
            } hover:shadow-md`}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
