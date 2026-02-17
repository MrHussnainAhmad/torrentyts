import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const course = await Course.findById(id);
                if (!course) {
                    return res.status(404).json({ success: false });
                }
                res.status(200).json({ success: true, data: course });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case 'PUT':
            try {
                const course = await Course.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!course) {
                    return res.status(404).json({ success: false });
                }
                res.status(200).json({ success: true, data: course });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case 'DELETE':
            try {
                const deletedCourse = await Course.deleteOne({ _id: id });
                if (!deletedCourse) {
                    return res.status(404).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
