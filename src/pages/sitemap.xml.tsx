import { GetServerSideProps } from 'next';
import { getServerSettings } from '@/lib/server-settings';

const BLOG_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

function generateSiteMap(courses: any[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${BLOG_URL}</loc>
     </url>
     ${courses
            .map(({ slug, updatedAt }) => {
                return `
       <url>
           <loc>${`${BLOG_URL}/media/${slug}`}</loc>
           <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
       </url>
     `;
            })
            .join('')}
   </urlset>
 `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    // We make an API call to gather the URLs for our site
    const request = await fetch(`${BLOG_URL}/api/courses`);
    const coursesData = await request.json();
    const courses = coursesData.success ? coursesData.data.filter((c: any) => c.status === 'published') : [];

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(courses);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

export default SiteMap;
