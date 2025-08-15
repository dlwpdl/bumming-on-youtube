'use client'

interface KakaoAdProps {
  unit: string
  width: string
  height: string
  className?: string
}

export default function KakaoAd({ 
  unit, 
  width, 
  height, 
  className = '' 
}: KakaoAdProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <ins 
        className="kakao_ad_area" 
        style={{ display: 'none' }}
        data-ad-unit={unit}
        data-ad-width={width}
        data-ad-height={height}
      />
    </div>
  )
}