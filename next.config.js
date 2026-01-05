/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export', // Disabled for Web Mode (Fixes API/Auth errors). Uncomment for Mobile Build.
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
