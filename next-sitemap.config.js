/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://torrentyts.vercel.app';

module.exports = {
    siteUrl,
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
        additionalSitemaps: [`${siteUrl}/sitemap.xml`],
    },
    // We want the dynamic sitemap from pages/sitemap.xml.tsx to take precedence
    // However, next-sitemap generates a static one. 
    // We will keep this default for valid redundant coverage or static fallback.
    generateIndexSitemap: false,
}
