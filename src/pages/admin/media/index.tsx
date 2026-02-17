import Link from 'next/link';
import useSWR from 'swr';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/router';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Courses() {
    const { data, error, mutate } = useSWR('/api/courses', fetcher);
    const router = useRouter();
    const [deleting, setDeleting] = useState<string | null>(null);

    if (error) return <div>Failed to load</div>;
    if (!data) return (
        <AdminLayout>
            <div className="flex items-center justify-center h-64 text-slate-400">Loading courses...</div>
        </AdminLayout>
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
            if (res.ok) {
                mutate(); // Refresh the list
            } else {
                alert('Failed to delete');
            }
        } catch (e) {
            alert('Error deleting course');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">All Media</h1>
                    <Button onClick={() => router.push('/admin/media/new')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Course
                    </Button>
                </div>

                <div className="rounded-xl border border-dark-border bg-dark-surface overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-dark-bg text-slate-400 border-b border-dark-border">
                                <tr>
                                    <th className="p-4 font-medium">Title</th>
                                    <th className="p-4 font-medium">Quality</th>
                                    <th className="p-4 font-medium">Year</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Watch</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {data.data.map((course: any) => (
                                    <tr key={course._id} className="hover:bg-dark-bg/50 transition-colors">
                                        <td className="p-4 font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <img src={course.thumbnail} alt="" className="w-10 h-10 rounded object-cover bg-slate-800" />
                                                <div>
                                                    <div className="font-bold">{course.title}</div>
                                                    <div className="text-xs text-slate-500">{course.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">{course.quality}</td>
                                        <td className="p-4 text-slate-300">{course.year}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.status === 'published'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-slate-500/10 text-slate-500'
                                                }`}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {course.liveUrl ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 animate-pulse">
                                                    LIVE
                                                </span>
                                            ) : (
                                                <span className="text-slate-500 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => router.push(`/media/${course.slug}`)}>
                                                    <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/media/${course._id}/edit`)}>
                                                    <Edit className="w-4 h-4 text-slate-400 hover:text-white" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(course._id)}
                                                    disabled={deleting === course._id}
                                                >
                                                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {data.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No media items found. Create one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
