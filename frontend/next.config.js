/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TypeScript errors ko build ke waqt ignore karega
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint warning/errors ko build ke waqt ignore karega
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;