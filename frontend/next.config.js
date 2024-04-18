/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['i.redd.it', "lh3.googleusercontent.com", 'ih1.redbubble.net'],
  }
}

module.exports = nextConfig
