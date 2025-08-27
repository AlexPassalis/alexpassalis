// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  output: 'export',
  images: { loader: 'custom', loaderFile: './src/imageLoader.ts' },
  eslint: {
    dirs: ['src'],
  },
}

module.exports = nextConfig
