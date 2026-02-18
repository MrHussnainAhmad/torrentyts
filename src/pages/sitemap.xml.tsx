import { GetServerSideProps } from 'next';
import { getServerSettings } from '@/lib/server-settings';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';

const BLOG_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://torrentyts.vercel.app';

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
  // Connect to database directly
  await dbConnect();

  // Fetch published courses directly from DB
  const courses = await Course.find({ status: 'published' })
    .select('slug updatedAt')
    .lean();

  // Generate XML sitemap
  const sitemap = generateSiteMap(courses);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
