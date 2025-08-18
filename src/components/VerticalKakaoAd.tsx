'use client'

export default function VerticalKakaoAd() {
  return (
    <div className="flex justify-center sticky top-24">
      <ins 
        className="kakao_ad_area" 
        style={{ display: 'none' }}
        data-ad-unit="DAN-gganLkOxLt61K1G5"
        data-ad-width="160"
        data-ad-height="600"
      />
    </div>
  )
}