/** @type {import('next').NextConfig} */
const nextConfig = {
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
