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
  const { data: featuredData } = useSWR('/api/courses?isFeatured=true&limit=1', fetcher);
  const { data: latestData } = useSWR('/api/courses?limit=4&sortBy=year', fetcher);
  const { data, error } = useSWR('/api/courses?limit=12', fetcher);
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
  const featuredMovie = featuredData?.data?.[0];
  const featuredImage = featuredMovie?.coverImage || featuredMovie?.thumbnail;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const baseKeywords = 'movies, torrent, yts, yts 2, stream, watch movies, hd movies, movie torrents';
  const seoDescription = 'Watch movies, stream and download torrents in HD. Fast YTS-style listings with clean search and verified media.';

  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && course.status === 'published';
  });

  return (
    <div className="min-h-screen bg-[#171717] text-white">
      {featuredImage && !searchQuery && (
        <Head>
          <link rel="preload" as="image" href={featuredImage} />
        </Head>
      )}
      <SEO
        title="Watch Movies, Stream & Download Torrents"
        description={seoDescription}
        siteName={settings.siteName}
        keywords={baseKeywords}
        image={featuredImage}
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": settings.siteName,
          "url": siteUrl,
          "description": seoDescription,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        }}
      />

      <Navbar onSearch={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        {/* Featured / Hero Section */}
        {featuredMovie && !searchQuery && (
          <div className="relative mb-16 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[220px] sm:min-h-[260px] md:min-h-[320px] max-h-[70vh] group cursor-pointer border border-white/5 shadow-2xl"
            onClick={() => router.push(`/media/${featuredMovie.slug}`)}>
            {/* Background Image with Overlay */}
            {featuredImage && (
              <img
                src={featuredImage}
                alt={featuredMovie.title}
                className="absolute inset-0 h-full w-full object-cover object-center sm:object-[60%_center] lg:object-[70%_center] transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-6 sm:px-8 md:px-16 max-w-xl sm:max-w-2xl gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#6AC045] text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Featured</span>
                <span className="text-gray-300 text-sm font-medium">{featuredMovie.quality} • {featuredMovie.year}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg">
                {featuredMovie.title}
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base line-clamp-2 md:line-clamp-3 leading-relaxed max-w-lg mb-2"
                dangerouslySetInnerHTML={{ __html: featuredMovie.description.substring(0, 200) + '...' }} />

              <div className="flex flex-wrap items-center gap-4 mt-2">
                <button className="bg-white text-black hover:bg-[#6AC045] hover:text-white transition-all duration-300 px-8 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Watch Now
                </button>
                <div className="flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                  <span className="font-bold text-sm">{featuredMovie.rating}</span>
                </div>
              </div>
            </div>
          </div>
        )}

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
