import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Footer() {
    const { data: settingsData } = useSWR('/api/settings', fetcher);
    const settings = (settingsData?.success && settingsData.data) ? settingsData.data : {
        siteName: 'TorrentEdu',
        siteDescription: 'High-quality educational course torrents. Download and learn at your own pace.',
        footerText: '© 2026 TorrentEdu. Educational purposes only.'
    };

    return (
        <footer className="bg-[#1f1f1f] border-t border-[#2a2a2a] mt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                    {/* About */}
                    <div>
                        <h3 className="font-semibold text-white mb-3">{settings.siteName}</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            {settings.siteDescription}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-xs">
                            <li><a href="/" className="text-gray-400 hover:text-[#6AC045] transition-colors">Browse Media</a></li>
                        </ul>
                    </div>

                    {/* Disclaimer */}
                    <div>
                        <h3 className="font-semibold text-white mb-3">Disclaimer</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            This site does not host any files. All content is provided by third-party torrent networks.
                        </p>
                    </div>
                </div>

                <div className="border-t border-[#2a2a2a] mt-8 pt-6 text-center">
                    <p className="text-xs text-gray-500">{settings.footerText}</p>
                </div>
            </div>
        </footer>
    );
}
