/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. App Router 설정 완전 삭제 (Pages Router로 자동 인식하게 함)
  reactStrictMode: true,

  // 2. 이미지 호스트 허용 설정
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'news.google.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // 3. Pi Network 인증을 위한 Rewrites 설정
  async rewrites() {
    return [
      {
        source: "/validation-key.txt",
        destination: "/api/pi-validation",
      },
      {
        source: "/.well-known/pi-domain-validation.txt",
        destination: "/api/pi-validation",
      },
    ];
  },

  // 4. 빌드 시 타입 체크 에러 방지
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
