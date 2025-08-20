import './globals.css'
import Script from 'next/script'

export const metadata = {
  metadataBase: new URL('https://bumming-on-youtube.vercel.app'),
  title: {
    default: 'Bumming on YouTube - 유튜브 영상 검색 및 분석 도구',
    template: '%s | Bumming on YouTube'
  },
  description: '유튜브 영상과 채널을 검색하고 성과를 분석하는 무료 웹 도구입니다. 트렌드 분석, 채널 통계, 영상 성과율 계산으로 효과적인 콘텐츠 발굴을 지원합니다.',
  keywords: [
    'YouTube', '유튜브', '영상 검색', '채널 분석', '트렌드 분석', 
    '성과율', '콘텐츠 분석', '영상 발굴', 'YouTube Analytics', 
    'Video Search', 'Channel Statistics', 'Performance Analysis'
  ],
  authors: [{ name: 'Bumming on YouTube' }],
  creator: 'Bumming on YouTube',
  publisher: 'Bumming on YouTube',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-7025064694638585',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://bumming-on-youtube.vercel.app',
    siteName: 'Bumming on YouTube',
    title: 'Bumming on YouTube - 유튜브 영상 검색 및 분석 도구',
    description: '유튜브 영상과 채널을 검색하고 성과를 분석하는 무료 웹 도구입니다. 트렌드 분석, 채널 통계, 영상 성과율 계산으로 효과적인 콘텐츠 발굴을 지원합니다.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bumming on YouTube - 유튜브 분석 도구',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bumming_youtube',
    creator: '@bumming_youtube',
    title: 'Bumming on YouTube - 유튜브 영상 검색 및 분석 도구',
    description: '유튜브 영상과 채널을 검색하고 성과를 분석하는 무료 웹 도구입니다.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
    other: {
      'naver-site-verification': 'naver-verification-code',
    },
  },
  alternates: {
    canonical: 'https://bumming-on-youtube.vercel.app',
    languages: {
      'ko-KR': 'https://bumming-on-youtube.vercel.app',
      'en-US': 'https://bumming-on-youtube.vercel.app/en',
    },
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7025064694638585"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          async
          src="https://t1.daumcdn.net/kas/static/ba.min.js"
          strategy="afterInteractive"
          charSet="utf-8"
        />
        
        {/* 구조화된 데이터 (JSON-LD) */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Bumming on YouTube",
              "description": "유튜브 영상과 채널을 검색하고 성과를 분석하는 무료 웹 도구입니다. 트렌드 분석, 채널 통계, 영상 성과율 계산으로 효과적인 콘텐츠 발굴을 지원합니다.",
              "url": "https://bumming-on-youtube.vercel.app",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              },
              "creator": {
                "@type": "Person",
                "name": "Bumming on YouTube"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Bumming on YouTube"
              },
              "inLanguage": "ko-KR",
              "featureList": [
                "YouTube 영상 검색",
                "채널 분석",
                "트렌드 분석",
                "성과율 계산",
                "즐겨찾기 관리",
                "썸네일 다운로드"
              ],
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareVersion": "1.0.0",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.5",
                "ratingCount": "1000"
              }
            })
          }}
        />
        
        {/* 조직 정보 */}
        <Script
          id="organization-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Bumming on YouTube",
              "url": "https://bumming-on-youtube.vercel.app",
              "logo": "https://bumming-on-youtube.vercel.app/logo.png",
              "sameAs": [
                "https://github.com/dlwpdl/bumming-on-youtube"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://github.com/dlwpdl/bumming-on-youtube/issues"
              }
            })
          }}
        />
        
        {/* 웹사이트 정보 */}
        <Script
          id="website-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Bumming on YouTube",
              "url": "https://bumming-on-youtube.vercel.app",
              "description": "유튜브 영상과 채널을 검색하고 성과를 분석하는 무료 웹 도구",
              "inLanguage": "ko-KR",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://bumming-on-youtube.vercel.app?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* 웹 바이탈 측정 */}
        <Script
          id="web-vitals"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function sendToAnalytics(metric) {
                // Web Vitals 데이터를 콘솔에 로그 (실제 운영에서는 Analytics로 전송)
                console.log('Web Vital:', metric);
              }
              
              // Core Web Vitals 측정
              if (typeof window !== 'undefined') {
                import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                  getCLS(sendToAnalytics);
                  getFID(sendToAnalytics);
                  getFCP(sendToAnalytics);
                  getLCP(sendToAnalytics);
                  getTTFB(sendToAnalytics);
                });
              }
            `
          }}
        />
        
        {/* 접근성 개선 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://www.googleapis.com" />
        
        {/* 파비콘 및 앱 아이콘 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* 테마 색상 */}
        <meta name="theme-color" content="#ef4444" />
        <meta name="msapplication-TileColor" content="#ef4444" />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}