import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import { useState } from 'react';
import { Star, Download, ArrowUpCircle, ArrowDownCircle, Calendar, Film, Globe, HardDrive } from 'lucide-react';
import Navbar from '@/components/client/Navbar';
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

export default function CoursePage({ settings: initialSettings }: { settings: any }) {
    const router = useRouter();
    const { slug } = router.query;
    const { data, error } = useSWR(slug ? `/api/courses?slug=${slug}` : null, fetcher);
    const [copyStatus, setCopyStatus] = useState('');

    const course = data?.data;

    const copyToClipboard = async () => {
        if (!course?.magnetLink) return;

        try {
            await navigator.clipboard.writeText(course.magnetLink);
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus(''), 2000);
        } catch (err) {
            setCopyStatus('Failed to copy');
        }
    };

    const settings = initialSettings || {
        siteName: 'TorrentEdu',
        siteDescription: 'High-quality educational content, free to download via torrent.',
    };

    if (error) return <div className="min-h-screen bg-[#171717] text-white flex items-center justify-center">Failed to load course</div>;
    if (!data || !course) return (
        <div className="min-h-screen bg-[#171717] flex items-center justify-center">
            <div className="animate-pulse text-white">Loading...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#171717] text-white relative">
            <SEO
                title={`${course.title} (${course.year})`}
                description={course.description}
                image={course.thumbnail}
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Movie",
                    "name": course.title,
                    "alternativeHeadline": course.title,
                    "image": course.thumbnail,
                    "datePublished": course.year.toString(),
                    "description": course.description,
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": course.rating.toString(),
                        "bestRating": "10",
                        "worstRating": "1",
                        "ratingCount": "100"
                    }
                }}
            />

            {/* Background Gradient */}
            {course.coverImage ? (
                <div
                    className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                    style={{
                        background: `linear-gradient(to bottom, transparent 0%, #171717 100%), url(${course.coverImage}) no-repeat top center/cover`
                    }}
                />
            ) : (
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1f1f1f] to-[#171717] opacity-20 pointer-events-none" />
            )}

            <div className="relative z-10">
                <Navbar onSearch={() => { }} />

                <main className="container mx-auto px-4 py-12">
                    {/* Two-Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Left Column - Poster */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full rounded-lg shadow-2xl"
                                    />
                                ) : (
                                    <div className="w-full aspect-[2/3] bg-[#1f1f1f] rounded-lg flex flex-col items-center justify-center text-gray-600 border border-white/5">
                                        <Film className="w-16 h-16 mb-4 opacity-20" />
                                        <span className="text-sm uppercase tracking-widest opacity-30">No Image Available</span>
                                    </div>
                                )}

                                {/* Download Button */}
                                <button
                                    onClick={copyToClipboard}
                                    className="w-full mt-6 bg-[#6AC045] hover:bg-[#5eb03a] text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
                                >
                                    <Download className="w-5 h-5" />
                                    {copyStatus || 'Copy Magnet Link'}
                                </button>

                                {/* Watch Now Button */}
                                {course.liveUrl && (
                                    <a
                                        href={course.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all border border-white/10 hover:border-[#6AC045]/50 group"
                                    >
                                        <Film className="w-5 h-5 text-[#6AC045]" />
                                        <span>Watch Now</span>
                                    </a>
                                )}

                                {/* Stats */}
                                <div className="mt-4 bg-[#1f1f1f] rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm flex items-center gap-2">
                                            <ArrowUpCircle className="w-4 h-4 text-green-400" />
                                            Seeders
                                        </span>
                                        <span className="font-semibold text-green-400">{course.seeders || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm flex items-center gap-2">
                                            <ArrowDownCircle className="w-4 h-4 text-red-400" />
                                            Leechers
                                        </span>
                                        <span className="font-semibold text-red-400">{course.leechers || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Info */}
                        <div className="lg:col-span-2">
                            {/* Title */}
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-4xl md:text-5xl font-bold leading-tight">{course.title}</h1>
                                {course.liveUrl && (
                                    <span className="flex-shrink-0 bg-[#6AC045]/10 text-[#6AC045] border border-[#6AC045]/20 px-3 py-1 rounded-md text-sm font-bold flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#6AC045] rounded-full animate-pulse"></span>
                                        WATCH
                                    </span>
                                )}
                            </div>

                            {/* Prominent Watch Now Button */}
                            {course.liveUrl && (
                                <div className="mb-8">
                                    <a
                                        href={course.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 bg-[#6AC045] hover:bg-[#5eb03a] text-white px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-xl hover:scale-105 active:scale-95 shadow-[#6AC045]/20"
                                    >
                                        <Film className="w-6 h-6" />
                                        Watch Now
                                    </a>
                                </div>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                {course.year && (
                                    <span className="text-gray-400 flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {course.year}
                                    </span>
                                )}
                                {course.rating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">{course.rating.toFixed(1)}/10</span>
                                    </div>
                                )}
                                <span className="px-3 py-1 bg-[#6AC045] text-white rounded text-sm font-bold">
                                    {course.quality}
                                </span>
                                <span className="text-gray-400 flex items-center gap-1">
                                    <HardDrive className="w-4 h-4" />
                                    {course.fileSize}
                                </span>
                            </div>

                            {/* Genre Tags */}
                            {course.genre && course.genre.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {course.genre.map((g: string, index: number) => (
                                        <span key={index} className="px-3 py-1 bg-[#1f1f1f] text-gray-300 rounded-full text-xs">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Language */}
                            {course.language && (
                                <div className="mb-6 flex items-center gap-2 text-gray-400">
                                    <Globe className="w-4 h-4" />
                                    <span className="text-sm">{course.language}</span>
                                </div>
                            )}

                            {/* Description */}
                            <div className="bg-[#1f1f1f] rounded-lg p-6 mb-6">
                                <h2 className="text-xl font-bold mb-4">Description</h2>
                                <div
                                    className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: course.description }}
                                />
                            </div>

                            {/* Technical Info */}
                            <div className="bg-[#1f1f1f] rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">Technical Details</h2>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Quality:</span>
                                        <span className="ml-2 text-white font-medium">{course.quality}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">File Size:</span>
                                        <span className="ml-2 text-white font-medium">{course.fileSize}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Language:</span>
                                        <span className="ml-2 text-white font-medium">{course.language}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Year:</span>
                                        <span className="ml-2 text-white font-medium">{course.year}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
