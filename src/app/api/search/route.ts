import { NextRequest, NextResponse } from 'next/server';
import { searchVideos, SearchFilters } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const filters: SearchFilters = {
      query: body.query || '',
      videoDuration: body.videoDuration || 'any',
      maxSubscribers: body.maxSubscribers ? parseInt(body.maxSubscribers) : undefined,
      minViews: body.minViews ? parseInt(body.minViews) : undefined,
      categoryId: body.categoryId || undefined,
      maxResults: parseInt(body.maxResults) || 50,
    };

    if (!filters.query) {
      return NextResponse.json(
        { error: '검색 키워드가 필요합니다.' },
        { status: 400 }
      );
    }

    const videos = await searchVideos(filters);
    
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('검색 API 오류:', error);
    return NextResponse.json(
      { error: '검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}