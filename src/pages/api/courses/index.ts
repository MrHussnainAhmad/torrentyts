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
                const { slug, page = '1', limit = '100' } = req.query;
                const pageNum = parseInt(page as string);
                const limitNum = parseInt(limit as string);
                const skip = (pageNum - 1) * limitNum;

                if (slug) {
                    const course = await Course.findOne({ slug });
                    if (!course) {
                        return res.status(404).json({ success: false, error: 'Course not found' });
                    }
                    return res.status(200).json({ success: true, data: course });
                }

                const totalItems = await Course.countDocuments({});
                const courses = await Course.find({})
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limitNum);

                res.status(200).json({
                    success: true,
                    data: courses,
                    pagination: {
                        totalItems,
                        totalPages: Math.ceil(totalItems / limitNum),
                        currentPage: pageNum,
                        limit: limitNum
                    }
                });
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
