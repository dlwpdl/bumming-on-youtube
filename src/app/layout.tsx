import './globals.css'

export const metadata = {
  title: 'Bumming on Youtube',
  description: '고성능 유튜브 영상 발굴 도구',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <script type="text/javascript" src="//t1.daumcdn.net/kas/static/ba.min.js" async></script>
      </head>
      <body>
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