
import { VideoData } from './youtube';

export type SortField = 'performanceScore' | 'viewCount' | 'subscriberCount' | 'title' | 'publishedAt';
export type ChannelSortField = 'grade' | 'subscriberCount' | 'viewCount' | 'videoCount' | 'title' | 'publishedAt' | 'growthRate';
export type SortOrder = 'asc' | 'desc';
export type TabType = 'videos' | 'channels' | 'analysis' | 'channel-analysis' | 'favorites';

export type ChannelGrade = 'S' | 'A' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D';

export type SearchType = 'channel' | 'category' | 'title';

export interface ChannelData {
  id: string;
  title: string;
  description: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  thumbnail: string;
  publishedAt: string;
  country?: string;
  customUrl?: string;
  engagementRate?: number;
}

export interface FavoriteVideo extends VideoData {
  savedAt: string;
}

export interface FavoriteChannel extends ChannelData {
  savedAt: string;
}

export interface ChannelGrowthData {
  yearlyGrowth: number;
  monthlyGrowth: number;
  dailyGrowth: number;
  subscribersPerVideo: number;
  uploadFrequency: number; // days per upload
  operatingYears: number;
}

export interface AdvancedChannelData extends ChannelData {
  grade: ChannelGrade;
  category: string;
  averageViews: number;
  growthData: ChannelGrowthData;
  isKoreanChannel: boolean;
}

export interface ChannelAnalysisData {
  channel: ChannelData;
  videos: VideoData[];
}
