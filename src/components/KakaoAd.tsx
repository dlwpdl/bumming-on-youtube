'use client'

interface KakaoAdProps {
  unit: string
  width: string
  height: string
  className?: string
  onAdFail?: () => void
}

export default function KakaoAd({ 
  unit, 
  width, 
  height, 
  className = '',
  onAdFail
}: KakaoAdProps) {
  const handleAdFail = () => {
    if (onAdFail) {
      onAdFail()
    }
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <ins 
        className="kakao_ad_area" 
        style={{ display: 'none', width: '100%' }}
        data-ad-unit={unit}
        data-ad-width={width}
        data-ad-height={height}
        data-ad-onfail={onAdFail ? 'handleKakaoAdFail' : undefined}
      />
      {onAdFail && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function handleKakaoAdFail(arg) {
                console.log('카카오 광고 로드 실패:', arg);
              }
            `
          }}
        />
      )}
    </div>
  )
}