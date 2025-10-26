// postcss.config.js
module.exports = {
    plugins: {
        // 1. Tailwind має бути першим плагіном
        tailwindcss: {},
        // 2. Autoprefixer має йти після Tailwind
        autoprefixer: {},
    },
};