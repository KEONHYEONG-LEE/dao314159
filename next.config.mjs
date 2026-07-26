/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.photos' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.google.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
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
};

export default nextConfig;
