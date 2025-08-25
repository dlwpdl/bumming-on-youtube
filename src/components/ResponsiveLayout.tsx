import { ReactNode, useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface ResponsiveLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export default function ResponsiveLayout({ 
  children, 
  sidebar, 
  className = '' 
}: ResponsiveLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 641);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`min-h-screen ${className}`}>
      {/* 모바일 헤더 */}
      {isMobile && sidebar && (
        <div className="mobile:flex desktop:hidden items-center justify-between p-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">메뉴</h1>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      )}

      <div className="flex">
        {/* 사이드바 */}
        {sidebar && (
          <>
            {/* 데스크톱 사이드바 */}
            <div className="hidden desktop:block w-80 flex-shrink-0">
              {sidebar}
            </div>
            
            {/* 모바일 사이드바 */}
            {isMobileMenuOpen && (
              <>
                {/* 오버레이 */}
                <div 
                  className="mobile:fixed mobile:inset-0 mobile:bg-black/50 mobile:z-40"
                  onClick={toggleMobileMenu}
                />
                
                {/* 사이드바 컨텐츠 */}
                <div className="mobile:fixed mobile:top-0 mobile:left-0 mobile:h-full mobile:w-80 mobile:bg-gray-900 mobile:z-50 mobile:transform mobile:transition-transform">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-white">메뉴</h2>
                      <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {sidebar}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* 메인 컨텐츠 */}
        <div className="flex-1 min-w-0">
          <div className="p-4 mobile:p-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}