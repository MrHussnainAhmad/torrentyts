import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea, ErrorMessage } from '@/components/ui/form-elements';
import { courseSchema, CourseFormData } from '@/lib/validations/course';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EditCourse() {
    const router = useRouter();
    const { id } = router.query;

    const { data: courseData, error } = useSWR(id ? `/api/courses/${id}` : null, fetcher);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
    });

    useEffect(() => {
        if (courseData && courseData.success) {
            const course = courseData.data;
            reset({
                title: course.title,
                slug: course.slug,
                description: course.description,
                rating: course.rating,
                quality: course.quality,
                genre: course.genre,
                year: course.year,
                language: course.language,
                thumbnail: course.thumbnail,
                coverImage: course.coverImage,
                magnetLink: course.magnetLink,
                fileSize: course.fileSize,
                seeders: course.seeders,
                leechers: course.leechers,
                liveUrl: course.liveUrl || '',
                status: course.status,
            });
        }
    }, [courseData, reset]);

    const onSubmit = async (data: CourseFormData) => {
        try {
            const res = await fetch(`/api/courses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to update media item');

            router.push('/admin/media');
        } catch (error) {

            alert('Error updating course');
        }
    };

    if (error) return <div>Failed to load course</div>;
    if (!courseData) return (
        <AdminLayout>
            <div className="flex items-center justify-center h-64 text-slate-400">Loading course data...</div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Edit Media</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-dark-surface p-6 rounded-xl border border-dark-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" {...register('title')} />
                            <ErrorMessage>{errors.title?.message}</ErrorMessage>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" {...register('slug')} />
                            <ErrorMessage>{errors.slug?.message}</ErrorMessage>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (HTML supported)</Label>
                        <Textarea id="description" {...register('description')} />
                        <ErrorMessage>{errors.description?.message}</ErrorMessage>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="quality">Quality</Label>
                            <select
                                id="quality"
                                {...register('quality')}
                                className="flex h-10 w-full rounded-md border border-dark-border bg-dark-bg px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary-500"
                            >
                                <option value="">Select Quality</option>
                                <option value="1080p">1080p</option>
                                <option value="720p">720p</option>
                                <option value="4K">4K</option>
                            </select>
                            <ErrorMessage>{errors.quality?.message}</ErrorMessage>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input id="year" type="number" {...register('year')} />
                            <ErrorMessage>{errors.year?.message}</ErrorMessage>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Input id="language" {...register('language')} />
                            <ErrorMessage>{errors.language?.message}</ErrorMessage>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fileSize">File Size</Label>
                            <Input id="fileSize" {...register('fileSize')} />
                            <ErrorMessage>{errors.fileSize?.message}</ErrorMessage>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="seeders">Seeders</Label>
                            <Input id="seeders" type="number" {...register('seeders', { valueAsNumber: true })} placeholder="0" />
                            <ErrorMessage>{errors.seeders?.message}</ErrorMessage>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leechers">Leechers</Label>
                            <Input id="leechers" type="number" {...register('leechers', { valueAsNumber: true })} placeholder="0" />
                            <ErrorMessage>{errors.leechers?.message}</ErrorMessage>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="genre">Genre (Comma separated)</Label>
                        <Input
                            id="genre"
                            placeholder="Action, Drama, Coding"
                            {...register('genre', {
                                setValueAs: (v) => Array.isArray(v) ? v : (typeof v === 'string' ? v.split(',').map((s: string) => s.trim()) : [])
                            })}
                        />
                        <ErrorMessage>{errors.genre?.message}</ErrorMessage>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="thumbnail">Thumbnail URL</Label>
                            <Input id="thumbnail" {...register('thumbnail')} />
                            <ErrorMessage>{errors.thumbnail?.message}</ErrorMessage>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="coverImage">Cover Image (Optional)</Label>
                            <Input id="coverImage" {...register('coverImage')} placeholder="Used for background gradient" />
                            <ErrorMessage>{errors.coverImage?.message}</ErrorMessage>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="magnetLink">Magnet Link</Label>
                        <Textarea id="magnetLink" {...register('magnetLink')} className="font-mono text-xs" />
                        <ErrorMessage>{errors.magnetLink?.message}</ErrorMessage>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="liveUrl">Watch Link (Optional)</Label>
                        <Input id="liveUrl" {...register('liveUrl')} placeholder="e.g., https://zoom.us/j/..." />
                        <ErrorMessage>{errors.liveUrl?.message}</ErrorMessage>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            {...register('status')}
                            className="flex h-10 w-full rounded-md border border-dark-border bg-dark-bg px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary-500"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        <ErrorMessage>{errors.status?.message}</ErrorMessage>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update Media Item'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
