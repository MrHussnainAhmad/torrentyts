import { useRouter } from 'next/router';
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

export default function Browse({ settings: initialSettings }: { settings: any }) {
    const router = useRouter();
    const page = parseInt(router.query.page as string || '1');
    const genre = router.query.genre as string || '';
    const year = router.query.year as string || '';
    const quality = router.query.quality as string || '';
    const limit = 20;

    const { data: settingsData } = useSWR('/api/settings', fetcher);
    const { data: filterOptions } = useSWR('/api/courses/filters', fetcher);

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (genre) queryParams.append('genre', genre);
    if (year) queryParams.append('year', year);
    if (quality) queryParams.append('quality', quality);

    const { data, error } = useSWR(`/api/courses?${queryParams.toString()}`, fetcher);
    const [searchQuery, setSearchQuery] = useState('');

    const settings = (settingsData?.success && settingsData.data) ? settingsData.data : (initialSettings || {
        siteName: 'TorrentEdu',
        siteDescription: 'Download high-quality educational courses via torrent.'
    });
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const baseKeywords = 'movies, torrent, yts, yts 2, stream, watch movies, browse movies, movie torrents';
    const seoDescription = 'Browse movies by genre, year and quality. Stream and download torrents with fast YTS-style listings.';

    if (error) return <div className="min-h-screen bg-[#171717] flex items-center justify-center text-white">Failed to load media</div>;

    const courses = data?.data || [];
    const pagination = data?.pagination || { totalPages: 1 };

    const handleFilterChange = (key: string, value: string) => {
        const newQuery = { ...router.query, [key]: value, page: '1' };
        if (!value) delete newQuery[key];

        router.push({
            pathname: '/browse',
            query: newQuery,
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        router.push({
            pathname: '/browse',
            query: { ...router.query, page: newPage },
        });
    };

    return (
        <div className="min-h-screen bg-[#171717] text-white">
            <SEO
                title={`Browse Media - Page ${page}`}
                description={seoDescription}
                siteName={settings.siteName}
                keywords={baseKeywords}
                schema={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": `Browse Media - Page ${page}`,
                    "url": `${siteUrl}/browse`,
                    "description": seoDescription
                }}
            />

            <Navbar onSearch={setSearchQuery} />

            <main className="container mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="mb-12 text-center max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse All <span className="text-[#6AC045]">Media</span></h1>
                    <p className="text-gray-400 text-base leading-relaxed">
                        Exploring our complete library of high-quality verified media torrents.
                    </p>
                </div>

                {/* Filters Section */}
                <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
                    {/* Genre Filter */}
                    <div className="flex flex-col min-w-[150px]">
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-2 ml-1">Genre</label>
                        <select
                            value={genre}
                            onChange={(e) => handleFilterChange('genre', e.target.value)}
                            className="bg-[#1f1f1f] border border-[#2a2a2a] text-sm rounded-lg focus:ring-[#6AC045] focus:border-[#6AC045] block w-full p-2.5 transition-colors cursor-pointer outline-none hover:border-[#3a3a3a]"
                        >
                            <option value="">All Genres</option>
                            {filterOptions?.data?.genres?.map((g: string) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div className="flex flex-col min-w-[120px]">
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-2 ml-1">Year</label>
                        <select
                            value={year}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="bg-[#1f1f1f] border border-[#2a2a2a] text-sm rounded-lg focus:ring-[#6AC045] focus:border-[#6AC045] block w-full p-2.5 transition-colors cursor-pointer outline-none hover:border-[#3a3a3a]"
                        >
                            <option value="">All Years</option>
                            {filterOptions?.data?.years?.map((y: number) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    {/* Quality Filter */}
                    <div className="flex flex-col min-w-[120px]">
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-2 ml-1">Quality</label>
                        <select
                            value={quality}
                            onChange={(e) => handleFilterChange('quality', e.target.value)}
                            className="bg-[#1f1f1f] border border-[#2a2a2a] text-sm rounded-lg focus:ring-[#6AC045] focus:border-[#6AC045] block w-full p-2.5 transition-colors cursor-pointer outline-none hover:border-[#3a3a3a]"
                        >
                            <option value="">All Qualities</option>
                            {filterOptions?.data?.qualities?.map((q: string) => (
                                <option key={q} value={q}>{q}</option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(genre || year || quality) && (
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase text-transparent mb-2">Reset</label>
                            <button
                                onClick={() => {
                                    router.push('/browse');
                                }}
                                className="text-sm text-gray-400 hover:text-white transition-colors p-2.5"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* Course Grid */}
                {!data ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-[#1f1f1f] rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : courses.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {courses.map((course: any) => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center space-x-4">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page <= 1}
                                    className="px-4 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-sm font-medium hover:border-[#6AC045] disabled:opacity-50 disabled:hover:border-[#2a2a2a] transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-400 text-sm">
                                    Page {page} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= pagination.totalPages}
                                    className="px-4 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-sm font-medium hover:border-[#6AC045] disabled:opacity-50 disabled:hover:border-[#2a2a2a] transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                        <p className="text-xl text-gray-400 mb-4">No media found</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
