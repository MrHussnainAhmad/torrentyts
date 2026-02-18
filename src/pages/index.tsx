import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Navbar from '@/components/client/Navbar';
import Footer from '@/components/client/Footer';
import CourseCard from '@/components/client/CourseCard';
import SEO from '@/components/client/SEO';

import { getServerSettings } from '@/lib/server-settings';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export async function getServerSideProps() {
  const settings = await getServerSettings();
  return {
    props: {
      settings,
    },
  };
}

export default function Home({ settings: initialSettings }: { settings: any }) {
  const router = useRouter();
  const { data: settingsData } = useSWR('/api/settings', fetcher);
  const { data: latestData } = useSWR('/api/courses?limit=4&sortBy=year', fetcher);
  const { data, error } = useSWR('/api/courses?limit=15', fetcher);
  const [searchQuery, setSearchQuery] = useState('');

  const settings = (settingsData?.success && settingsData.data) ? settingsData.data : (initialSettings || {
    siteName: 'TorrentEdu',
    siteDescription: 'Download high-quality educational courses via torrent.'
  });

  useEffect(() => {
    if (router.query.q) {
      setSearchQuery(router.query.q as string);
    }
  }, [router.query.q]);

  if (error) return <div className="min-h-screen bg-[#171717] flex items-center justify-center text-white">Failed to load media</div>;

  const courses = data?.data || [];
  const latestMovies = latestData?.data || [];

  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && course.status === 'published';
  });

  return (
    <div className="min-h-screen bg-[#171717] text-white">
      <SEO
        title="Latest Media Torrents"
        description={settings.siteDescription}
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": settings.siteName,
          "url": process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          "description": settings.siteDescription
        }}
      />

      <Navbar onSearch={setSearchQuery} />

      <main className="container mx-auto px-4 py-12">
        {/* Latest Section */}
        {latestMovies.length > 0 && !searchQuery && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-[#6AC045] rounded-full"></div>
                <h2 className="text-2xl font-bold">Latest <span className="text-[#6AC045]">Media</span></h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8">
              {latestMovies.map((movie: any) => (
                <CourseCard key={movie._id} course={movie} />
              ))}
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{searchQuery ? 'Search Results' : 'Latest Media Torrents'}</h1>
          <p className="text-gray-400 text-base leading-relaxed">
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : 'Download high-quality content in the most efficient ways possible. All files are verified and safe to use.'
            }
          </p>
        </div>

        {/* Course Grid */}
        {!data ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-[#1f1f1f] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredCourses.map((course: any) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <p className="text-xl text-gray-400 mb-4">No media found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#6AC045] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
