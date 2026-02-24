/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    return [
      { source: '/api/auth/:path*', destination: `${backendUrl}/api/auth/:path*` },
      { source: '/api/projects/:path*', destination: `${backendUrl}/api/projects/:path*` },
      { source: '/api/projects', destination: `${backendUrl}/api/projects` },
      { source: '/api/timeline/:path*', destination: `${backendUrl}/api/timeline/:path*` },
      { source: '/api/timeline', destination: `${backendUrl}/api/timeline` },
      { source: '/api/settings', destination: `${backendUrl}/api/settings` },
      { source: '/api/upload', destination: `${backendUrl}/api/upload` },
      { source: '/api/images/:path*', destination: `${backendUrl}/api/images/:path*` },
      { source: '/api/images', destination: `${backendUrl}/api/images` },
      { source: '/api/health', destination: `${backendUrl}/api/health` },
      { source: '/api/contact', destination: `${backendUrl}/api/contact` },
      { source: '/api/preview', destination: `${backendUrl}/api/preview` },
    ];
  },
}

export default nextConfig
