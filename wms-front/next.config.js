// Import the PWA configuration
const withPWA = require("next-pwa")({
  dest: "public", // PWA와 관련한 파일들을 생성할 디렉토리 지정
  register: true, // Automatically register the service worker
  skipWaiting: true, // Forces the app to use the new service worker once it's updated
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/j11a302\.p\.ssafy\.io\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^\/_next\/static\/.*/i,
      handler: 'NetworkFirst', // Use NetworkFirst to ensure we fetch the latest JS chunks
      options: {
        cacheName: 'next-static-js',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // Cache static files for 1 week
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  // Enable experimental Turbopack
  experimental: {
    turbo: {},
  },
});

module.exports = nextConfig;
