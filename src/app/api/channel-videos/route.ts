import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { VideoData, calculatePerformanceScore, parseDuration } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const apiKey = body.apiKey || process.env.YOUTUBE_API_KEY;
    const channelId = body.channelId;
    const maxResults = parseInt(body.maxResults) || 50;
    const pageToken = body.pageToken;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API 키가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!channelId) {
      return NextResponse.json(
        { error: '채널 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    });

    console.log('채널 비디오 검색 시작:', { channelId, maxResults, pageToken });

    // 1. 채널 정보 가져오기
    const channelResponse = await youtube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings'],
      id: [channelId],
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      return NextResponse.json(
        { error: '채널을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const channelData = channelResponse.data.items[0];
    const subscriberCount = parseInt(channelData.statistics?.subscriberCount || '0');

    // 2. 채널의 비디오 검색
    const searchParams: any = {
      part: ['snippet'],
      channelId: channelId,
      type: ['video'],
      maxResults: Math.min(maxResults, 50),
      order: 'date', // 최신순으로 정렬
    };

    if (pageToken) {
      searchParams.pageToken = pageToken;
    }

    const searchResponse = await youtube.search.list(searchParams);
    console.log('비디오 검색 응답:', searchResponse.data);

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      return NextResponse.json({
        channel: {
          id: channelData.id || '',
          title: channelData.snippet?.title || '',
          description: channelData.snippet?.description || '',
          subscriberCount,
          viewCount: parseInt(channelData.statistics?.viewCount || '0'),
          videoCount: parseInt(channelData.statistics?.videoCount || '0'),
          thumbnail: channelData.snippet?.thumbnails?.medium?.url || '',
          publishedAt: channelData.snippet?.publishedAt || '',
          country: channelData.snippet?.country,
          customUrl: channelData.snippet?.customUrl,
        },
        videos: [],
        nextPageToken: undefined,
        totalResults: 0
      });
    }

    const videoIds = searchResponse.data.items
      .map(item => item.id?.videoId)
      .filter((id): id is string => Boolean(id));

    console.log('비디오 IDs:', videoIds);

    if (videoIds.length === 0) {
      return NextResponse.json({
        channel: {
          id: channelData.id || '',
          title: channelData.snippet?.title || '',
          description: channelData.snippet?.description || '',
          subscriberCount,
          viewCount: parseInt(channelData.statistics?.viewCount || '0'),
          videoCount: parseInt(channelData.statistics?.videoCount || '0'),
          thumbnail: channelData.snippet?.thumbnails?.medium?.url || '',
          publishedAt: channelData.snippet?.publishedAt || '',
          country: channelData.snippet?.country,
          customUrl: channelData.snippet?.customUrl,
        },
        videos: [],
        nextPageToken: searchResponse.data.nextPageToken || undefined,
        totalResults: searchResponse.data.pageInfo?.totalResults || 0
      });
    }

    // 3. 비디오 상세 정보 가져오기
    const videoDetails = await youtube.videos.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      id: videoIds,
    });

    console.log('비디오 상세:', videoDetails.data);

    const videos: VideoData[] = [];
    
    for (const video of videoDetails.data.items || []) {
      const viewCount = parseInt(video.statistics?.viewCount || '0');
      const performanceScore = calculatePerformanceScore(viewCount, subscriberCount);

      videos.push({
        id: video.id || '',
        title: video.snippet?.title || '',
        channelTitle: video.snippet?.channelTitle || '',
        viewCount,
        subscriberCount,
        duration: video.contentDetails?.duration || '',
        publishedAt: video.snippet?.publishedAt || '',
        thumbnail: video.snippet?.thumbnails?.medium?.url || '',
        channelId: video.snippet?.channelId || '',
        categoryId: video.snippet?.categoryId || '',
        performanceScore,
      });
    }

    console.log('최종 채널 분석 결과:', { channelData: channelData.snippet?.title, videoCount: videos.length });
    
    return NextResponse.json({
      channel: {
        id: channelData.id || '',
        title: channelData.snippet?.title || '',
        description: channelData.snippet?.description || '',
        subscriberCount,
        viewCount: parseInt(channelData.statistics?.viewCount || '0'),
        videoCount: parseInt(channelData.statistics?.videoCount || '0'),
        thumbnail: channelData.snippet?.thumbnails?.medium?.url || '',
        publishedAt: channelData.snippet?.publishedAt || '',
        country: channelData.snippet?.country,
        customUrl: channelData.snippet?.customUrl,
      },
      videos,
      nextPageToken: searchResponse.data.nextPageToken || undefined,
      totalResults: searchResponse.data.pageInfo?.totalResults || 0
    });
    
  } catch (error) {
    console.error('채널 비디오 분석 API 오류:', error);
    return NextResponse.json(
      { error: '채널 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}