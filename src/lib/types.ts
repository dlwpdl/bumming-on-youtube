
import { VideoData } from './youtube';

export type SortField = 'performanceScore' | 'viewCount' | 'subscriberCount' | 'title' | 'publishedAt';
export type SortOrder = 'asc' | 'desc';
export type TabType = 'videos' | 'channels' | 'analysis' | 'favorites';

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

export interface ChannelAnalysisData {
  channel: ChannelData;
  videos: VideoData[];
}
