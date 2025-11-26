/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Server Actions configuration
  experimental: {
    serverActions: {
      allowedOrigins: process.env.NODE_ENV === 'production'
        ? [process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '') || '']
        : ['localhost:3000']
    }
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**'
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Ensure PDFKit data files are included in the bundle
    if (isServer) {
      config.externals.push({
        '@pdfkit/data': '@pdfkit/data',
      })
    }
    return config
  },

  // Output standalone for Docker/serverless if needed
  output: 'standalone',
}

module.exports = nextConfig