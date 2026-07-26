/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 호스트 허용 설정 추가
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'news.google.com' },
    ],
  },
  // 기존 Pi Network 검증 로직 유지
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
};

export default nextConfig;
