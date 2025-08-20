import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, regionCode = 'KR', categoryId, maxResults = 50 } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API 키가 필요합니다.' }, { status: 400 });
    }

    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    });

    // 인기 동영상 가져오기
    const response = await youtube.videos.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      chart: 'mostPopular',
      regionCode: regionCode,
      maxResults: parseInt(maxResults.toString()),
      videoCategoryId: categoryId, // 카테고리 필터
    });

    if (!response.data.items) {
      return NextResponse.json({ error: '트렌드 데이터를 가져올 수 없습니다.' }, { status: 404 });
    }

    // 채널 정보도 가져오기 위해 채널 ID 수집
    const channelIds = response.data.items.map(item => item.snippet?.channelId).filter(Boolean);
    const uniqueChannelIds = [...new Set(channelIds)];

    const channelsResponse = await youtube.channels.list({
      part: ['statistics'],
      id: uniqueChannelIds,
    });

    const channelStatsMap = new Map();
    channelsResponse.data.items?.forEach(channel => {
      if (channel.id && channel.statistics) {
        channelStatsMap.set(channel.id, channel.statistics);
      }
    });

    // 데이터 가공
    const trends = response.data.items.map((item, index) => {
      const snippet = item.snippet;
      const statistics = item.statistics;
      const contentDetails = item.contentDetails;
      const channelStats = channelStatsMap.get(snippet?.channelId);

      const viewCount = parseInt(statistics?.viewCount || '0');
      const subscriberCount = parseInt(channelStats?.subscriberCount || '0');
      const likeCount = parseInt(statistics?.likeCount || '0');
      const commentCount = parseInt(statistics?.commentCount || '0');

      // 성과율 계산 (조회수 / 구독자수 * 100)
      const performanceScore = subscriberCount > 0 ? (viewCount / subscriberCount) * 100 : 0;

      // 카테고리 매핑
      const categoryMap: { [key: string]: string } = {
        '1': '영화/애니메이션',
        '2': '자동차/교통',
        '10': '음악',
        '15': '애완동물',
        '17': '스포츠',
        '19': '여행/이벤트',
        '20': '게임',
        '22': '인물/블로그',
        '23': '코미디',
        '24': '엔터테인먼트',
        '25': '뉴스/정치',
        '26': '취미/스타일',
        '27': '교육',
        '28': '과학/기술',
      };

      return {
        id: item.id,
        title: snippet?.title || '',
        channelTitle: snippet?.channelTitle || '',
        thumbnail: snippet?.thumbnails?.high?.url || snippet?.thumbnails?.default?.url || '',
        publishedAt: snippet?.publishedAt || '',
        viewCount,
        likeCount,
        commentCount,
        subscriberCount,
        performanceScore: Math.round(performanceScore * 10) / 10,
        duration: contentDetails?.duration || '',
        category: categoryMap[snippet?.categoryId || ''] || '기타',
        rank: index + 1,
        tags: snippet?.tags?.slice(0, 5) || [],
        description: snippet?.description?.slice(0, 100) || '',
      };
    });

    // 성과율 기준으로 정렬
    const sortedTrends = trends.sort((a, b) => b.performanceScore - a.performanceScore);

    return NextResponse.json({
      success: true,
      regionCode,
      totalResults: trends.length,
      updatedAt: new Date().toISOString(),
      trends: sortedTrends,
    });

  } catch (error) {
    console.error('Trending API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('quotaExceeded')) {
        return NextResponse.json({ 
          error: 'YouTube API 할당량이 초과되었습니다. 나중에 다시 시도해주세요.' 
        }, { status: 429 });
      }
      
      if (error.message.includes('invalid')) {
        return NextResponse.json({ 
          error: '유효하지 않은 API 키입니다.' 
        }, { status: 401 });
      }
    }

    return NextResponse.json({ 
      error: '트렌드 데이터를 가져오는 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}