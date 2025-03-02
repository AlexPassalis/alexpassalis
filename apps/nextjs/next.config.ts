import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  logging: {
    incomingRequests: {
      ignore: [/\/api\/nextjs/],
    },
  },
  output: 'standalone',
} as any

export default nextConfig
