/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://torrentyts.vercel.app',
    generateRobotsTxt: true,
    exclude: ['/admin/*', '/auth/*', '/api/*'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/auth', '/api'],
            },
        ],
    },
    // Generate a new sitemap every time the build runs
    generateIndexSitemap: false,
}
