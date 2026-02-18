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
                const { slug, page = '1', limit = '100', sortBy, genre, year, quality, isFeatured } = req.query;
                const pageNum = parseInt(page as string);
                const limitNum = parseInt(limit as string);
                const skip = (pageNum - 1) * limitNum;

                const query: any = { status: 'published' };
                if (genre) query.genre = genre;
                if (year) query.year = parseInt(year as string);
                if (quality) query.quality = quality;
                if (isFeatured) query.isFeatured = isFeatured === 'true';

                if (slug) {
                    const course = await Course.findOne({ ...query, slug });
                    if (!course) {
                        return res.status(404).json({ success: false, error: 'Course not found' });
                    }
                    return res.status(200).json({ success: true, data: course });
                }

                let sortOptions: any = { createdAt: -1 };
                if (sortBy === 'year') {
                    sortOptions = { year: -1, createdAt: -1 };
                }

                const totalItems = await Course.countDocuments(query);
                const courses = await Course.find(query)
                    .sort(sortOptions)
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
