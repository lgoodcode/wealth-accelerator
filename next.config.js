const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withBundleAnalyzer(
  withSentryConfig(
    nextConfig,
    {
      silent: true,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
    { hideSourcemaps: true, tunnelRoute: '/sentry' }
  )
);
