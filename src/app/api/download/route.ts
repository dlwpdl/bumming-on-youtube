import { NextRequest, NextResponse } from 'next/server';
import youtubedl from 'youtube-dl-exec';
import path from 'path';
import fs from 'fs';

const YoutubeDL = youtubedl.create('/opt/homebrew/bin/yt-dlp');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, format, quality } = body;
    
    if (!videoId) {
      return NextResponse.json(
        { error: '비디오 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 다운로드 폴더 생성
    const downloadDir = path.join(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const videoUrl = `https://youtube.com/watch?v=${videoId}`;
    
    // 다운로드 옵션 설정
    const downloadOptions: any = {
      output: path.join(downloadDir, '%(title)s.%(ext)s'),
      noWarnings: true,
      noCheckCertificates: true,
    };

    // 포맷별 옵션 설정 - 더 유연한 포맷 선택
    if (format === 'video' && quality) {
      const targetHeight = quality.replace('p', '');
      // 여러 포맷 옵션을 우선순위대로 시도
      downloadOptions.format = `best[height<=${targetHeight}]/best[height<=${parseInt(targetHeight)+100}]/best/worst`;
    } else if (format === 'audio') {
      downloadOptions.format = 'bestaudio/best';
      downloadOptions.extractAudio = true;
      downloadOptions.audioFormat = 'mp3';
    } else {
      // 기본값: 최고 품질의 비디오
      downloadOptions.format = 'best/worst';
    }

    console.log('다운로드 시작:', { videoId, format, quality, downloadDir });
    
    // yt-dlp로 다운로드 실행
    const result = await YoutubeDL(videoUrl, downloadOptions);
    
    return NextResponse.json({
      success: true,
      message: '다운로드가 완료되었습니다.',
      downloadPath: downloadDir,
      result
    });

  } catch (error: any) {
    console.error('다운로드 오류:', error);
    
    // stderr에서 오류 메시지 추출
    const errorMessage = error.stderr || error.message || '알 수 없는 오류';
    
    if (errorMessage.includes('Video unavailable')) {
      return NextResponse.json(
        { error: '비디오를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    if (errorMessage.includes('Private video')) {
      return NextResponse.json(
        { error: '비공개 비디오입니다.' },
        { status: 403 }
      );
    }
    
    if (errorMessage.includes('Requested format is not available')) {
      return NextResponse.json(
        { error: '요청한 품질로 다운로드할 수 없습니다. 다른 품질을 시도해보세요.' },
        { status: 400 }
      );
    }
    
    if (errorMessage.includes('HTTP Error 429')) {
      return NextResponse.json(
        { error: '너무 많은 요청으로 일시적으로 차단되었습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: `다운로드 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}