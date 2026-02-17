import mongoose from 'mongoose';

export interface ISetting extends mongoose.Document {
    siteName: string;
    siteDescription: string;
    footerText: string;
    contactEmail: string;
    defaultQuality: string;
    defaultLanguage: string;
    updatedAt: Date;
}

const SettingSchema = new mongoose.Schema<ISetting>(
    {
        siteName: {
            type: String,
            default: 'TorrentEdu',
        },
        siteDescription: {
            type: String,
            default: 'High-quality educational content, free to download via torrent.',
        },
        footerText: {
            type: String,
            default: '© 2026 TorrentEdu. All rights reserved.',
        },
        contactEmail: {
            type: String,
            default: 'admin@torrentedu.com',
        },
        defaultQuality: {
            type: String,
            default: '1080p',
        },
        defaultLanguage: {
            type: String,
            default: 'English',
        },
    },
    { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
