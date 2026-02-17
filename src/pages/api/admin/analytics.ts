import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Visit from '@/models/Visit';
import { getServerSession } from "next-auth/next";
// Assuming there is an authOptions exported somewhere, usually in [...nextauth].ts or similar.
// Let me check if I can find it.
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || (session as any).user?.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        await dbConnect();

        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const yesterdayStart = new Date(new Date(todayStart).setDate(todayStart.getDate() - 1));
        const weekStart = new Date(new Date(todayStart).setDate(todayStart.getDate() - 7));
        const pastWeekStart = new Date(new Date(weekStart).setDate(weekStart.getDate() - 7));
        const monthStart = new Date(new Date(todayStart).setMonth(todayStart.getMonth() - 1));
        const pastMonthStart = new Date(new Date(monthStart).setMonth(monthStart.getMonth() - 1));

        const getCounts = async (start: Date, end: Date) => {
            return await Visit.countDocuments({
                timestamp: { $gte: start, $lt: end }
            });
        };

        const getUniqueCounts = async (start: Date, end: Date) => {
            const result = await Visit.aggregate([
                { $match: { timestamp: { $gte: start, $lt: end } } },
                { $group: { _id: "$ipHash" } },
                { $count: "count" }
            ]);
            return result[0]?.count || 0;
        };

        const data = {
            today: await getUniqueCounts(todayStart, new Date()),
            yesterday: await getUniqueCounts(yesterdayStart, todayStart),
            thisWeek: await getUniqueCounts(weekStart, new Date()),
            pastWeek: await getUniqueCounts(pastWeekStart, weekStart),
            thisMonth: await getUniqueCounts(monthStart, new Date()),
            pastMonth: await getUniqueCounts(pastMonthStart, monthStart),
            // For the graph, we might want daily counts for the last 7 or 30 days
            chartData: await Visit.aggregate([
                { $match: { timestamp: { $gte: weekStart } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                        visits: { $sum: 1 },
                        uniqueVisits: { $addToSet: "$ipHash" }
                    }
                },
                {
                    $project: {
                        date: "$_id",
                        visits: 1,
                        uniqueVisits: { $size: "$uniqueVisits" }
                    }
                },
                { $sort: { date: 1 } }
            ])
        };

        return res.status(200).json({ success: true, data });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
