
import { XCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 p-4 sm:p-6 mb-6 sm:mb-8 rounded-xl sm:rounded-2xl shadow-lg">
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2 bg-red-100 rounded-xl flex-shrink-0">
          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
        </div>
        <p className="text-sm sm:text-base text-red-800 font-semibold leading-snug">{error}</p>
      </div>
    </div>
  );
}
