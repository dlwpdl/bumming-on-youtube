import { ChannelData, ChannelGrade, AdvancedChannelData, ChannelGrowthData } from './types';

export function getChannelGrade(subscriberCount: number): ChannelGrade {
  if (subscriberCount >= 10000000) return 'S';      // 1000만 이상
  if (subscriberCount >= 5000000) return 'A';       // 500만 이상
  if (subscriberCount >= 1000000) return 'B+';      // 100만 이상
  if (subscriberCount >= 500000) return 'B';        // 50만 이상
  if (subscriberCount >= 100000) return 'B-';       // 10만 이상
  if (subscriberCount >= 50000) return 'C+';        // 5만 이상
  if (subscriberCount >= 10000) return 'C';         // 1만 이상
  if (subscriberCount >= 5000) return 'C-';         // 5천 이상
  if (subscriberCount >= 1000) return 'D+';         // 1천 이상
  return 'D';                                       // 1천 미만
}

export function getGradeColor(grade: ChannelGrade): { bg: string; text: string; border: string } {
  switch (grade) {
    case 'S':
      return { bg: 'bg-gradient-to-r from-red-500 to-pink-500', text: 'text-white', border: 'border-red-400' };
    case 'A':
      return { bg: 'bg-gradient-to-r from-orange-500 to-red-500', text: 'text-white', border: 'border-orange-400' };
    case 'B+':
      return { bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', text: 'text-white', border: 'border-yellow-400' };
    case 'B':
      return { bg: 'bg-gradient-to-r from-green-500 to-yellow-500', text: 'text-white', border: 'border-green-400' };
    case 'B-':
      return { bg: 'bg-gradient-to-r from-blue-500 to-green-500', text: 'text-white', border: 'border-blue-400' };
    case 'C+':
      return { bg: 'bg-gradient-to-r from-indigo-500 to-blue-500', text: 'text-white', border: 'border-indigo-400' };
    case 'C':
      return { bg: 'bg-gradient-to-r from-purple-500 to-indigo-500', text: 'text-white', border: 'border-purple-400' };
    case 'C-':
      return { bg: 'bg-gradient-to-r from-gray-500 to-purple-500', text: 'text-white', border: 'border-gray-400' };
    case 'D+':
      return { bg: 'bg-gradient-to-r from-gray-400 to-gray-500', text: 'text-white', border: 'border-gray-300' };
    case 'D':
      return { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'text-gray-800', border: 'border-gray-200' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
  }
}

export function calculateChannelGrowth(
  subscriberCount: number,
  publishedAt: string,
  videoCount: number
): ChannelGrowthData {
  const createdDate = new Date(publishedAt);
  const now = new Date();
  const diffTime = now.getTime() - createdDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const operatingYears = parseFloat((diffDays / 365.25).toFixed(1));

  // 대략적인 성장률 계산 (실제로는 API에서 시계열 데이터가 필요)
  const yearlyGrowth = operatingYears > 0 ? Math.floor(subscriberCount / operatingYears * 0.1) : 0;
  const monthlyGrowth = Math.floor(yearlyGrowth / 12);
  const dailyGrowth = Math.floor(monthlyGrowth / 30);
  
  const subscribersPerVideo = videoCount > 0 ? Math.floor(subscriberCount / videoCount) : 0;
  const uploadFrequency = videoCount > 0 ? parseFloat((diffDays / videoCount).toFixed(1)) : 0;

  return {
    yearlyGrowth,
    monthlyGrowth,
    dailyGrowth,
    subscribersPerVideo,
    uploadFrequency,
    operatingYears
  };
}

export function isKoreanChannel(country?: string, title?: string): boolean {
  if (country === 'KR' || country === 'Korea' || country === 'South Korea') return true;
  
  // 한글이 포함된 채널명인지 확인
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  return koreanRegex.test(title || '');
}

export function formatUploadFrequency(days: number): string {
  if (days === 0) return '데이터 없음';
  if (days < 1) return '일 1회 이상';
  if (days === 1) return '매일 업로드';
  return `${days}일당 1회`;
}

export function formatGrowthNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getGrowthRateColor(growth: number, subscriberCount: number): string {
  const growthRate = subscriberCount > 0 ? (growth / subscriberCount) * 100 : 0;
  
  if (growthRate >= 10) return 'text-red-400 font-bold'; // 매우 높은 성장
  if (growthRate >= 5) return 'text-orange-400 font-semibold'; // 높은 성장
  if (growthRate >= 1) return 'text-yellow-400'; // 보통 성장
  return 'text-gray-400'; // 낮은 성장
}

export function getChannelCategory(description: string): string {
  const categories = {
    '게임': ['게임', '게이밍', 'gaming', '플레이', '스트리밍'],
    '음악': ['음악', 'music', '노래', '뮤직', '가수'],
    '요리': ['요리', '쿠킹', 'cooking', '레시피', '음식'],
    '뷰티': ['뷰티', 'beauty', '메이크업', '화장품', '스킨케어'],
    '교육': ['교육', '강의', '학습', '공부', '튜토리얼'],
    '엔터테인먼트': ['예능', '코미디', '웃음', '재미', '개그'],
    '기술': ['기술', 'tech', '테크', 'IT', '개발'],
    '여행': ['여행', 'travel', '관광', '해외'],
    '스포츠': ['스포츠', 'sport', '운동', '헬스', '축구', '야구'],
    '일상': ['일상', '브이로그', 'vlog', '데일리'],
  };
  
  const lowerDesc = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword.toLowerCase()))) {
      return category;
    }
  }
  
  return '기타';
}

export function enhanceChannelData(channel: ChannelData): AdvancedChannelData {
  const growthData = calculateChannelGrowth(channel.subscriberCount, channel.publishedAt, channel.videoCount);
  const grade = getChannelGrade(channel.subscriberCount);
  const category = getChannelCategory(channel.description);
  const averageViews = channel.videoCount > 0 ? Math.round(channel.viewCount / channel.videoCount) : 0;
  const isKorean = isKoreanChannel(channel.country, channel.title);
  
  return {
    ...channel,
    grade,
    category,
    averageViews,
    growthData,
    isKoreanChannel: isKorean
  };
}

export function getCountryFlag(country?: string): string {
  const flags: { [key: string]: string } = {
    'KR': '🇰🇷',
    'US': '🇺🇸',
    'JP': '🇯🇵',
    'CN': '🇨🇳',
    'GB': '🇬🇧',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'IN': '🇮🇳',
    'BR': '🇧🇷',
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'RU': '🇷🇺',
    'IT': '🇮🇹',
    'ES': '🇪🇸'
  };
  
  return flags[country || ''] || '🌍';
}