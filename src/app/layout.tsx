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
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}