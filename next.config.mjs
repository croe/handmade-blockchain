import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // クライアントサイドのビルドでのみ canvas を無視する
    // isServer が false のときがクライアントサイドビルド
    if (!isServer) {
      config.externals = {
        ...(config.externals || {}), // 既存の externals 設定があればそれを保持
        canvas: 'commonjs canvas',
      };
    }
    return config;
  },
}

export default withPWA(nextConfig)
