import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Visit from '@/models/Visit';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'];
        const path = req.body.path || '/';

        // Hash IP for privacy
        const ipHash = crypto.createHash('sha256').update(ip as string).digest('hex');

        // To avoid double tracking in simple cases, we could check if a visit from this ipHash 
        // occurred in the last hour, but for now let's just log it.

        await Visit.create({
            ipHash,
            userAgent,
            path,
            timestamp: new Date()
        });

        return res.status(200).json({ success: true });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
