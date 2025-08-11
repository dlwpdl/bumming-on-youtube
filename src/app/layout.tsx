import './globals.css'

export const metadata = {
  title: 'YouTube Filter App',
  description: 'Advanced YouTube video filtering and search',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}