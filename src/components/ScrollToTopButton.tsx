
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  showScrollToTop: boolean;
  scrollToTop: () => void;
}

export default function ScrollToTopButton({ showScrollToTop, scrollToTop }: ScrollToTopButtonProps) {
  if (!showScrollToTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}
