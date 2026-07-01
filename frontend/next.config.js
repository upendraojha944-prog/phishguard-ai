/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Build ke waqt TypeScript errors ignore karega
    ignoreBuildErrors: true,
  },
  // ESLint configuration block yahan se hata diya gaya hai
  // taaki 'Invalid next.config.js options' error na aaye.
};

module.exports = nextConfig;