import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';

export async function getServerSettings() {
    await dbConnect();
    try {
        let settings = await Setting.findOne({}).lean();
        if (!settings) {
            // Create default settings if none exist
            settings = await Setting.create({});
            settings = JSON.parse(JSON.stringify(settings)); // Ensure it's a plain object
        }
        return JSON.parse(JSON.stringify(settings)); // Ensure it's serializable
    } catch (error) {

        return {
            siteName: 'TorrentEdu',
            siteDescription: 'High-quality educational content, free to download via torrent.',
            footerText: '© 2026 TorrentEdu. All rights reserved.',
        };
    }
}
