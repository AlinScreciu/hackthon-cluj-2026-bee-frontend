import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow CORS for Go API in production
  async headers() {
    return []
  },
}

export default nextConfig
