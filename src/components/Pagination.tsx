
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  filters: any;
  nextPageToken?: string;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  loadingPage: boolean;
}

export default function Pagination({ 
  currentPage, 
  totalResults, 
  filters, 
  nextPageToken, 
  handlePrevPage, 
  handleNextPage, 
  loadingPage 
}: PaginationProps) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 neo-glass holographic-effect rounded-2xl border border-blue-400/30 shadow-lg">
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || loadingPage}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">이전</span>
        </button>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <span className="text-sm font-bold text-blue-900">페이지 {currentPage}</span>
        </div>
        
        <button
          onClick={handleNextPage}
          disabled={!nextPageToken || loadingPage}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          {loadingPage ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">로딩...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">다음</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      
      <div className="text-xs sm:text-sm text-gray-300 text-center sm:text-right">
        <p>전체 약 {Math.min(totalResults, 1000000).toLocaleString()}개 결과 중</p>
        <p className="text-gray-400">페이지당 {filters.maxResults}개씩 표시</p>
      </div>
    </div>
  );
}
