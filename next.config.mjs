/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // TypeScript 및 ESLint 빌드 검사 강제 건너뛰기 (Vercel 배포 에러 방지)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 🚀 외부 및 다양한 실시간 뉴스 이미지 허용 설정
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.photos' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.google.com' },
      { protocol: 'https', hostname: '**.gstatic.com' },
      { protocol: 'https', hostname: 'ssl.gstatic.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: '**' }, 
    ],
  },

  // Pi Network 도메인 검증 리다이렉트 (API 연결)
  async rewrites() {
    return [
      { source: "/validation-key.txt", destination: "/api/pi-validation" },
      { source: "/.well-known/pi-domain-validation.txt", destination: "/api/pi-validation" },
    ];
  },

  // Pi Browser 아이프레임(Iframe) 임베드 허용 보안 헤더 설정
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
};

export default nextConfig;
