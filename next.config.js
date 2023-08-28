/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/dashboard/home',
        permanent: true,
      },
      {
        source: '/dashboard/home',
        destination: '/dashboard/finance/banking',
        permanent: false,
      },
      {
        // Make sure this is in sync with the /dashboard/finance-planning/layout routes
        source: '/dashboard/finance/finance-planning',
        destination: '/dashboard/finance/finance-planning/finance-info',
        permanent: false,
      },
      {
        source: '/dashboard/creative-cash-flow/:path*',
        destination: '/dashboard/tools/creative-cash-flow/:path*',
        permanent: true,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        // Proxy /sentry to Sentry
        source: '/sentry/:path*',
        // If in CI, use a placeholder URL
        destination: process.env.CI
          ? '/sentry'
          : `https://${process.env.NEXT_PUBLIC_SENTRY_DSN.split('@')[1].split('/')[0]}/:path*`,
      },
    ];
  },
  // Omitted until the pdfjslib library is used for the insurance policies feature
  // // This is required for the pdfjslib library to work
  // webpack: (config) => {
  //   config.resolve.alias.canvas = false;
  //   config.resolve.alias.encoding = false;
  //   return config;
  // },
};

module.exports = withBundleAnalyzer(
  withSentryConfig(
    nextConfig,
    {
      silent: false,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
    {
      tunnelRoute: '/sentry',
      hideSourcemaps: true,
      widenClientFileUploads: true,
    }
  )
);
