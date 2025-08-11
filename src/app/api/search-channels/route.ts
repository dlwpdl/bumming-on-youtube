import { NextRequest, NextResponse } from 'next/server';
import { searchChannels, ChannelSearchFilters } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const apiKey = body.apiKey || process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API 키가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const filters: ChannelSearchFilters = {
      query: body.query || '',
      minSubscribers: body.minSubscribers ? parseInt(body.minSubscribers) : undefined,
      maxSubscribers: body.maxSubscribers ? parseInt(body.maxSubscribers) : undefined,
      country: body.country || undefined,
      maxResults: parseInt(body.maxResults) || 50,
      pageToken: body.pageToken || undefined,
    };

    if (!filters.query) {
      return NextResponse.json(
        { error: '검색 키워드가 필요합니다.' },
        { status: 400 }
      );
    }

    const result = await searchChannels(filters, apiKey);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('채널 검색 API 오류:', error);
    return NextResponse.json(
      { error: '채널 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}