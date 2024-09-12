// Import the PWA configuration
const withPWA = require('next-pwa')({
  dest: 'public',       // PWA와 관련한 파일들을 생성할 디렉토리 지정
  register: true,       // Automatically register the service worker
  skipWaiting: true,    // Forces the app to use the new service worker once it's updated
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  // Enable experimental Turbopack
  experimental: {
    turbo: {

    },
  },
});

module.exports = nextConfig;
