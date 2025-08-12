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

    // 포맷별 옵션 설정
    if (format === 'video' && quality) {
      downloadOptions.format = `best[height<=${quality.replace('p', '')}]`;
    } else if (format === 'audio') {
      downloadOptions.format = 'bestaudio';
      downloadOptions.extractAudio = true;
      downloadOptions.audioFormat = 'mp3';
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

  } catch (error) {
    console.error('다운로드 오류:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Video unavailable')) {
        return NextResponse.json(
          { error: '비디오를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      if (error.message.includes('Private video')) {
        return NextResponse.json(
          { error: '비공개 비디오입니다.' },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      { error: '다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}