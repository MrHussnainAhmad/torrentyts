import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileVideo, HardDrive, Share2, TrendingUp, UserCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
    const { data: analyticsRes, error } = useSWR('/api/admin/analytics', fetcher);
    const analytics = analyticsRes?.success ? analyticsRes.data : null;

    const stats = [
        {
            title: 'Today Visits',
            value: analytics?.today ?? '...',
            icon: Users,
            change: analytics ? `${analytics.today >= analytics.yesterday ? '+' : ''}${analytics.today - analytics.yesterday} from yesterday` : 'Loading...',
        },
        {
            title: 'This Week',
            value: analytics?.thisWeek ?? '...',
            icon: TrendingUp,
            change: analytics ? `${analytics.thisWeek >= analytics.pastWeek ? '+' : ''}${analytics.thisWeek - analytics.pastWeek} from last week` : 'Loading...',
        },
        {
            title: 'This Month',
            value: analytics?.thisMonth ?? '...',
            icon: UserCheck,
            change: analytics ? `${analytics.thisMonth >= analytics.pastMonth ? '+' : ''}${analytics.thisMonth - analytics.pastMonth} from last month` : 'Loading...',
        },
        {
            title: 'Total Storage',
            value: '128 GB',
            icon: HardDrive,
            change: 'Using 45% of available',
        },
    ];

    const chartData = analytics?.chartData || [];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">System Dashboard</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-400">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="bg-dark-surface rounded-xl p-6 border border-dark-border">
                    <h2 className="text-xl font-semibold text-white mb-6">User Interactions (Last 7 Days)</h2>
                    <div className="h-80 w-full">
                        {analytics ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorUniques" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(str) => {
                                            const date = new Date(str);
                                            return date.toLocaleDateString('en-US', { weekday: 'short' });
                                        }}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                        itemStyle={{ fontSize: '12px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="visits"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorVisits)"
                                        strokeWidth={2}
                                        name="Total Visits"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="uniqueVisits"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorUniques)"
                                        strokeWidth={2}
                                        name="Unique Visitors"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 bg-dark-bg/50 rounded-lg border border-dashed border-dark-border">
                                {error ? 'Failed to load analytics' : 'Loading analytics data...'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
