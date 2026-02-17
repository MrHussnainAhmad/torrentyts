import Link from 'next/link';
import { Star, Film } from 'lucide-react';

interface CourseCardProps {
    course: {
        _id: string;
        title: string;
        slug: string;
        thumbnail: string;
        quality: string;
        year: number;
        rating: number;
        seeders?: number;
        leechers?: number;
        genre?: string[];
        liveUrl?: string;
    };
}

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <Link href={`/media/${course.slug}`} className="group block">
            <div className="relative aspect-[2/3] bg-[#1f1f1f] rounded-lg overflow-hidden border border-white/5 shadow-lg group-hover:border-[#6AC045]/50 transition-all duration-300">
                {/* Poster Image */}
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:opacity-30"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#252525] text-gray-600">
                        <Film className="w-12 h-12 mb-2 opacity-20" />
                        <span className="text-xs uppercase tracking-widest opacity-30">No Preview</span>
                    </div>
                )}

                {/* Top Overlay - Always visible but subtle */}
                <div className="absolute top-2 right-2 z-10">
                    <span className="bg-black/60 backdrop-blur-md text-[#6AC045] px-2 py-0.5 rounded text-[10px] font-bold border border-white/10 uppercase">
                        {course.quality}
                    </span>
                </div>

                {/* Watch Badge - Top Left */}
                {course.liveUrl && (
                    <div className="absolute top-2 left-2 z-10">
                        <span className="bg-[#6AC045] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-lg flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            WATCH
                        </span>
                    </div>
                )}

                {/* Hover Details - Strictly Minimal YTS Style */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center z-20">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-4">
                        <div className="flex flex-col items-center">
                            <Star className="w-8 h-8 text-[#6AC045] fill-[#6AC045] mb-2" />
                            <span className="text-xl font-bold text-white leading-none">
                                {course.rating > 0 ? course.rating.toFixed(1) : 'NR'} <span className="text-gray-400 text-sm">/ 10</span>
                            </span>
                        </div>

                        {course.genre && course.genre.length > 0 && (
                            <div className="text-white font-bold text-sm tracking-wide">
                                {course.genre.slice(0, 2).join(' / ')}
                            </div>
                        )}

                        <div className="pt-2">
                            <span className="inline-block px-4 py-1.5 bg-[#6AC045] hover:bg-[#5eb03a] text-white rounded-sm font-bold text-xs uppercase tracking-widest transition-colors">
                                View Details
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Title & Year - Visible below card */}
            <div className="mt-2.5 px-0.5">
                <h3 className="text-[#f5f5f5] font-bold text-[13px] leading-tight truncate group-hover:text-[#6AC045] transition-colors" title={course.title}>
                    {course.title}
                </h3>
                <div className="text-gray-500 text-[11px] font-medium mt-1">{course.year}</div>
            </div>
        </Link>
    );
}
