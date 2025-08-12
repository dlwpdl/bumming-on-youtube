import { NextRequest, NextResponse } from 'next/server';
import youtubedl from 'youtube-dl-exec';

// yt-dlp 바이너리 경로 설정 (올바른 방법)
const YoutubeDL = youtubedl.create('/opt/homebrew/bin/yt-dlp');

// 언어 코드를 한국어 이름으로 변환
function getLanguageName(langCode: string): string {
  const languageMap: { [key: string]: string } = {
    'ko': '한국어',
    'en': '영어',
    'ja': '일본어',
    'zh': '중국어',
    'zh-CN': '중국어(간체)',
    'zh-TW': '중국어(번체)',
    'es': '스페인어',
    'fr': '프랑스어',
    'de': '독일어',
    'ru': '러시아어',
    'pt': '포르투갈어',
    'it': '이탈리아어',
    'ar': '아랍어',
    'hi': '힌디어',
    'th': '태국어',
    'vi': '베트남어',
    'id': '인도네시아어',
    'ms': '말레이어',
  };
  
  return languageMap[langCode] || langCode.toUpperCase();
}

export interface DownloadLink {
  quality: string;
  format: string;
  url: string;
  filesize?: number;
  ext: string;
  vcodec?: string;
  acodec?: string;
}

export interface SubtitleTrack {
  language: string;
  languageName: string;
  url: string;
  ext: string;
}

export interface DownloadLinksResponse {
  videoId: string;
  title: string;
  description: string;
  duration: number;
  viewCount: number;
  likeCount?: number;
  uploader: string;
  uploadDate: string;
  tags: string[];
  categories: string[];
  videoFormats: DownloadLink[];
  audioFormats: DownloadLink[];
  subtitles: SubtitleTrack[];
  thumbnail: string;
}

export async function POST(request: NextRequest) {
  let videoId;
  try {
    const body = await request.json();
    videoId = body.videoId;
    
    if (!videoId) {
      return NextResponse.json(
        { error: '비디오 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const videoUrl = `https://youtube.com/watch?v=${videoId}`;
    
    // yt-dlp로 비디오 정보 및 다운로드 링크 추출
    console.log('yt-dlp 실행 시도 중...', videoUrl);
    
    let info;
    try {
      info = await YoutubeDL(videoUrl, {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificates: true,
        format: 'best[height<=1080]',
        paths: '../download',
        // 추가 옵션
        simulate: false,
        quiet: false,
      });
      console.log('yt-dlp 실행 성공');
    } catch (ytdlError) {
      console.error('yt-dlp 실행 오류:', ytdlError);
      
      // 임시 모킥 데이터 (테스트용)
      return NextResponse.json({
        videoId,
        title: '테스트 비디오 (yt-dlp 미설치)',
        description: 'yt-dlp가 서버에 설치되지 않았습니다. 로컬에서 테스트하려면 yt-dlp를 설치해주세요.',
        duration: 0,
        viewCount: 0,
        uploader: 'Unknown',
        uploadDate: '20240101',
        tags: ['test'],
        categories: ['Education'],
        videoFormats: [],
        audioFormats: [],
        subtitles: [],
        thumbnail: '',
      });
    }

    // 비디오 포맷 필터링 (화질별로 분류)
    const videoFormats: DownloadLink[] = (info.formats || [])
      .filter((format: any) => format.vcodec !== 'none' && format.height)
      .sort((a: any, b: any) => (b.height || 0) - (a.height || 0))
      .slice(0, 5) // 상위 5개만
      .map((format: any) => ({
        quality: `${format.height}p`,
        format: format.format_id,
        url: format.url,
        filesize: format.filesize,
        ext: format.ext,
        vcodec: format.vcodec,
        acodec: format.acodec,
      }));

    // 오디오 포맷 필터링
    const audioFormats: DownloadLink[] = (info.formats || [])
      .filter((format: any) => format.acodec !== 'none' && format.vcodec === 'none')
      .sort((a: any, b: any) => (b.abr || 0) - (a.abr || 0))
      .slice(0, 3) // 상위 3개만
      .map((format: any) => ({
        quality: `${format.abr}kbps`,
        format: format.format_id,
        url: format.url,
        filesize: format.filesize,
        ext: format.ext,
        acodec: format.acodec,
      }));

    // 자막 처리
    const subtitles: SubtitleTrack[] = [];
    if (info.subtitles) {
      Object.keys(info.subtitles).forEach(lang => {
        const subtitleFormats = info.subtitles[lang];
        if (subtitleFormats && subtitleFormats.length > 0) {
          // 첫 번째 포맷 사용 (보통 vtt 또는 srv3)
          const subtitle = subtitleFormats[0];
          subtitles.push({
            language: lang,
            languageName: getLanguageName(lang),
            url: subtitle.url,
            ext: subtitle.ext || 'vtt',
          });
        }
      });
    }

    const response: DownloadLinksResponse = {
      videoId,
      title: info.title || '제목 없음',
      description: info.description || '',
      duration: info.duration || 0,
      viewCount: parseInt(String(info.view_count)) || 0,
      likeCount: parseInt(String((info as any).like_count)) || undefined,
      uploader: info.uploader || info.channel || '',
      uploadDate: info.upload_date || '',
      tags: info.tags || [],
      categories: info.categories || [],
      videoFormats,
      audioFormats,
      subtitles,
      thumbnail: info.thumbnail || '',
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('다운로드 링크 추출 오류:', error);
    console.error('오류 상세 정보:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      videoId,
    });
    
    // 상세한 에러 정보 제공
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      
      if (error.message.includes('Video unavailable')) {
        return NextResponse.json(
          { error: '비디오를 찾을 수 없습니다. 비공개 또는 삭제된 영상일 수 있습니다.' },
          { status: 404 }
        );
      }
      if (error.message.includes('Private video')) {
        return NextResponse.json(
          { error: '비공개 비디오입니다.' },
          { status: 403 }
        );
      }
      if (error.message.includes('youtube-dl')) {
        return NextResponse.json(
          { error: 'yt-dlp 도구 실행 오류: ' + error.message },
          { status: 500 }
        );
      }
      
      // 일반적인 에러 메시지 포함
      return NextResponse.json(
        { error: `오류: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '알 수 없는 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}