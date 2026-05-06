/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Required for Docker deployment
  output: 'standalone',
  // Disable eslint during build (optional, speeds up build)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable typescript errors during build (optional)
  typescript: {
    ignoreBuildErrors: true,
  },
  // API Proxy for local development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
      {
        source: '/ws/:path*',
        destination: 'http://localhost:8000/ws/:path*',
      },
    ]
  },
}

module.exports = nextConfig
