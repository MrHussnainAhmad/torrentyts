import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    await dbConnect();

    try {
        const genres = await Course.distinct('genre', { status: 'published' });
        const years = await Course.distinct('year', { status: 'published' });
        const qualities = await Course.distinct('quality', { status: 'published' });

        res.status(200).json({
            success: true,
            data: {
                genres: genres.sort(),
                years: years.sort((a: number, b: number) => b - a),
                qualities: qualities.sort()
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
    }
}
