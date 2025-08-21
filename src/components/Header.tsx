
import { Youtube, Sparkles, CheckCircle, XCircle, Settings, FileText } from 'lucide-react';
import TrendWidget from './TrendWidget';

interface HeaderProps {
  apiKeyStatus: 'none' | 'valid' | 'invalid';
  openApiKeyModal: () => void;
}

export default function Header({ apiKeyStatus, openApiKeyModal }: HeaderProps) {
  return (
    <div className="glass-effect sticky top-0 z-50 border-b border-gray-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative float-animation">
            <div className="w-10 h-10 sm:w-14 sm:h-14 accent-blue rounded-2xl flex items-center justify-center shadow-lg">
              <Youtube className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-7 sm:h-7 accent-purple rounded-full flex items-center justify-center pulse-glow">
              <Sparkles className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold accent-text-blue">Bumming On Youtube</h1>
            <p className="text-xs sm:text-sm text-gray-400 font-medium hidden sm:block">고성능 영상 발굴 도구 ✨</p>
          </div>
        </div>
        
        
        {/* 스크립트 분석 플랫폼 버튼 & API 키 상태 */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* 스크립트 분석 버튼 */}
          <button
            onClick={() => window.open('https://scripting-on-youtube.vercel.app', '_blank')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 glass-effect rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 group border border-gray-600/30"
          >
            <FileText className="w-4 h-4 accent-text-purple group-hover:text-purple-400" />
            <span className="text-sm font-medium text-white">Scripting Platform</span>
          </button>
          
          {/* 모바일용 스크립트 분석 버튼 */}
          <button
            onClick={() => window.open('https://scripting-on-youtube.vercel.app', '_blank')}
            className="sm:hidden p-2.5 glass-effect rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-600/30"
          >
            <FileText className="w-4 h-4 accent-text-purple" />
          </button>
          
          {apiKeyStatus === 'valid' ? (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass-effect rounded-2xl border-2 border-emerald-400/30">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">연결됨</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass-effect rounded-2xl border-2 border-amber-400/30">
              <XCircle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">API 키 필요</span>
            </div>
          )}
          
          {/* 모바일용 상태 아이콘 */}
          <div className="sm:hidden p-2 glass-effect rounded-xl border border-gray-600/30">
            {apiKeyStatus === 'valid' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-400" />
            )}
          </div>
          
          <button
            onClick={openApiKeyModal}
            className="btn-gradient p-2.5 sm:p-3 rounded-xl text-white hover:scale-105 transition-all duration-300"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
