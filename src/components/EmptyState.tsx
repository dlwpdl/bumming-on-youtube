
import { Search } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="text-center py-12 sm:py-20">
      <div className="max-w-md mx-auto px-4">
        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg">
          <Search className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">검색 결과가 없습니다</h3>
        <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">다른 검색어나 필터 조건을 시도해보세요</p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 검색 팁</h4>
          <ul className="text-xs sm:text-sm text-blue-800 text-left space-y-1">
            <li>• 더 일반적인 키워드를 사용해보세요</li>
            <li>• 필터 조건을 완화해보세요</li>
            <li>• 영어 키워드도 시도해보세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
