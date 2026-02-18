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
    // We want the dynamic sitemap from pages/sitemap.xml.tsx to take precedence
    // However, next-sitemap generates a static one. 
    // We will keep this default for valid redundant coverage or static fallback.
    generateIndexSitemap: false,
}
