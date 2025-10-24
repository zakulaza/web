/** @type {import('next').NextConfig} */
const nextConfig = {
    // Додаємо цей блок для зображень:
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.google.com',
            },
            {
                protocol: 'https',
                hostname: 'global.cpcdn.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com', // Додаємо той, що ми використовували раніше
            },
            // Додайте сюди будь-які інші домени, якщо знадобиться
        ],
    },
};

module.exports = nextConfig;