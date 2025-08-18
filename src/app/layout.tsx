import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Bumming on Youtube',
  description: '고성능 유튜브 영상 발굴 도구',
  robots: 'index, follow',
  other: {
    'google-adsense-account': 'ca-pub-7025064694638585',
  },
  openGraph: {
    title: 'Bumming on Youtube',
    description: '고성능 유튜브 영상 발굴 도구',
    type: 'website',
  },
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
      </head>
      <body suppressHydrationWarning={true}>
        <ins className="kakao_ad_area" style={{display:'none'}}
          data-ad-unit="DAN-gganLkOxLt61K1G5"
          data-ad-width="160"
          data-ad-height="600">
        </ins>
        {children}
      </body>
    </html>
  )
}