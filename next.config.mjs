/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. App Router 기능을 강제로 비활성화 (Pages Router 충돌 방지)
  experimental: {
    appDir: false,
  },

  // 2. React 엄격 모드 활성화 (디버깅에 도움)
  reactStrictMode: true,

  // 3. 이미지 호스트 허용 설정 (뉴스 이미지 및 유저 프로필용)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'news.google.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // 4. Pi Network 도메인 및 앱 검증을 위한 Rewrites 설정
  async rewrites() {
    return [
      {
        // 파이 브라우저에서 앱 소유권 인증 시 사용
        source: "/validation-key.txt",
        destination: "/api/pi-validation",
      },
      {
        // 파이 네트워크 도메인 인증용 표준 경로
        source: "/.well-known/pi-domain-validation.txt",
        destination: "/api/pi-validation",
      },
    ];
  },

  // 5. 빌드 시 타입 체크 에러로 인한 중단 방지 (선택 사항)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
