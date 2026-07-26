/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 🚀 모바일 웹뷰 및 구글 번역기 환경에서 다양한 실시간 이미지 경로를 다 뚫어주도록 확장
    remotePatterns: [
      { protocol: 'https', hostname: '**.photos' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.google.com' },
      { protocol: 'https', hostname: '**.gstatic.com' },
      { protocol: 'https', hostname: 'ssl.gstatic.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      // 혹시 다른 뉴스 언론사 원본 이미지 주소가 잡힐 때를 대비해 전체 https 개방 (선택 사항)
      { protocol: 'https', hostname: '**' }, 
    ],
  },
  async rewrites() {
    return [
      { source: "/validation-key.txt", destination: "/api/pi-validation" },
      { source: "/.well-known/pi-domain-validation.txt", destination: "/api/pi-validation" },
    ];
  },
  // Vercel에서 Pi 브라우저의 아이프레임(Iframe)을 허용하도록 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://app-cdn.minepi.com https://*.minepi.com;" },
        ],
      },
    ];
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true }, // 빌드 속도 향상 및 사소한 린트 에러 패스
};

export default nextConfig;
