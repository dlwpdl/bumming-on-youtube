
import { Youtube, Sparkles, CheckCircle, XCircle, Settings, FileText } from 'lucide-react';
import TrendWidget from './TrendWidget';

interface HeaderProps {
  apiKeyStatus: 'none' | 'valid' | 'invalid';
  openApiKeyModal: () => void;
}

export default function Header({ apiKeyStatus, openApiKeyModal }: HeaderProps) {
  return (
    <div className="relative neo-glass holographic-effect sticky top-0 z-50 border-b border-blue-400/20">
      {/* Cyberpunk Border Animation */}
      <div className="absolute inset-0 morphing-gradient opacity-20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative float-animation">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-110 card-3d">
              <Youtube className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center pulse-glow">
              <Sparkles className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">Bumming On Youtube</h1>
            <p className="text-xs sm:text-sm text-gray-300 font-bold hidden sm:block">고성능 영상 발굴 도구 ✨</p>
          </div>
        </div>
        
        
        {/* 스크립트 분석 플랫폼 버튼 & API 키 상태 */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* 스크립트 분석 버튼 */}
          <button
            onClick={() => window.open('https://scripting-on-youtube.vercel.app', '_blank')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 neo-glass rounded-2xl hover:shadow-[0_8px_25px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105 group border border-purple-400/30 card-3d"
          >
            <FileText className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
            <span className="text-sm font-bold text-white">Scripting Platform</span>
          </button>
          
          {/* 모바일용 스크립트 분석 버튼 */}
          <button
            onClick={() => window.open('https://scripting-on-youtube.vercel.app', '_blank')}
            className="sm:hidden p-2.5 neo-glass rounded-xl hover:shadow-[0_8px_25px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105 border border-purple-400/30 card-3d"
          >
            <FileText className="w-4 h-4 text-purple-400" />
          </button>
          
          {apiKeyStatus === 'valid' ? (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 neo-glass rounded-2xl border border-emerald-400/30 shadow-[0_8px_25px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-300">연결됨</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 neo-glass rounded-2xl border border-amber-400/30 shadow-[0_8px_25px_rgba(245,158,11,0.3)]">
              <XCircle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-300">API 키 필요</span>
            </div>
          )}
          
          {/* 모바일용 상태 아이콘 */}
          <div className="sm:hidden p-2 neo-glass rounded-xl border border-gray-500/30">
            {apiKeyStatus === 'valid' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-400" />
            )}
          </div>
          
          <button
            onClick={openApiKeyModal}
            className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white hover:scale-105 transition-all duration-300 shadow-[0_8px_25px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_35px_rgba(59,130,246,0.6)] card-3d"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
