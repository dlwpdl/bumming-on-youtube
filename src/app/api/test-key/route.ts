import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        { success: false, error: 'API 키가 필요합니다.' },
        { status: 400 }
      );
    }

    // YouTube API 키 테스트
    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey.trim(),
    });

    try {
      // 간단한 검색으로 API 키 유효성 테스트
      const testResponse = await youtube.search.list({
        part: ['snippet'],
        q: 'test',
        type: ['video'],
        maxResults: 1,
      });

      return NextResponse.json({
        success: true,
        message: 'API 키가 유효합니다!',
        quota: testResponse.data.pageInfo?.totalResults || 0
      });
    } catch (apiError: any) {
      console.error('YouTube API 테스트 오류:', apiError);
      
      let errorMessage = 'API 키가 유효하지 않습니다.';
      
      if (apiError.response?.status === 403) {
        errorMessage = 'API 키 권한이 없거나 YouTube Data API가 활성화되지 않았습니다.';
      } else if (apiError.response?.status === 400) {
        errorMessage = 'API 키 형식이 올바르지 않습니다.';
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('API 키 테스트 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '테스트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}