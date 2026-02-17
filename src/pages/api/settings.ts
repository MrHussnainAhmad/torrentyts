import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                let settings = await Setting.findOne({});
                if (!settings) {
                    // Create default settings if none exist
                    settings = await Setting.create({});
                }
                res.status(200).json({ success: true, data: settings });
            } catch (error) {
                res.status(400).json({ success: false, error: (error as Error).message });
            }
            break;

        case 'PUT':
        case 'POST':
            try {
                let settings = await Setting.findOne({});
                if (settings) {
                    settings = await Setting.findOneAndUpdate({}, req.body, { new: true });
                } else {
                    settings = await Setting.create(req.body);
                }
                res.status(200).json({ success: true, data: settings });
            } catch (error) {
                res.status(400).json({ success: false, error: (error as Error).message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
