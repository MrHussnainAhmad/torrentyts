import { useRouter } from 'next/router';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface NavbarProps {
    onSearch: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
    const { data: settingsData } = useSWR('/api/settings', fetcher);
    const siteName = (settingsData?.success && settingsData.data) ? settingsData.data.siteName : 'TorrentEdu';

    const router = useRouter();
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (router.query.q) {
            setQuery(router.query.q as string);
            onSearch(router.query.q as string);
        }
    }, [router.query.q]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/?q=${encodeURIComponent(query)}`);
        onSearch(query);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        if (router.pathname === '/') {
            onSearch(val);
        }
    };

    return (
        <nav className="bg-[#1f1f1f] border-b border-[#2a2a2a] sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-[#6AC045]">{siteName.includes(' ') ? siteName.split(' ')[0] : 'Torrent'}</span>
                        <span className="text-2xl font-bold text-white">{siteName.includes(' ') ? siteName.split(' ').slice(1).join(' ') : (siteName === 'TorrentEdu' ? 'Edu' : siteName)}</span>
                    </Link>

                    {/* Search Bar - Center */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                placeholder="Search media..."
                                className="w-full bg-[#171717] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6AC045] transition-colors"
                            />
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        </div>
                    </form>

                    {/* Nav Links */}
                    <div className="flex items-center gap-6">
                        <Link href="/browse" className="text-sm text-gray-300 hover:text-white transition-colors">
                            Browse
                        </Link>
                    </div>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="md:hidden pb-3">
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            placeholder="Search media..."
                            className="w-full bg-[#171717] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6AC045]"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    </div>
                </form>
            </div>
        </nav>
    );
}
