import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const { slug } = req.query;

                if (slug) {
                    const course = await Course.findOne({ slug });
                    if (!course) {
                        return res.status(404).json({ success: false, error: 'Course not found' });
                    }
                    return res.status(200).json({ success: true, data: course });
                }

                const courses = await Course.find({}).sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: courses });
            } catch (error) {
                res.status(400).json({ success: false, error: (error as Error).message });
            }
            break;
        case 'POST':
            try {
                const course = await Course.create(req.body);
                res.status(201).json({ success: true, data: course });
            } catch (error) {
                res.status(400).json({ success: false, error: (error as Error).message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
