import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea, ErrorMessage } from '@/components/ui/form-elements';
import { courseSchema, CourseFormData } from '@/lib/validations/course';
import { Upload, Image as ImageIcon } from 'lucide-react';

export default function AddCourse() {
    const router = useRouter();
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [coverPreview, setCoverPreview] = useState<string>('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            rating: 0,
            seeders: 0,
            leechers: 0,
            status: 'published',
            genre: [],
        },
    });

    const handleImageUpload = async (file: File, type: 'thumbnail' | 'coverImage') => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setValue(type, base64);
            if (type === 'thumbnail') setThumbnailPreview(base64);
            else setCoverPreview(base64);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: CourseFormData) => {
        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to create media item');

            router.push('/admin/media');
        } catch (error) {

            alert('Error creating course');
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Add New Media</h1>
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
                            <Input id="fileSize" {...register('fileSize')} placeholder="e.g., 2.1 GB" />
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
                        {/* Simple text input for now, ideally multiselect */}
                        <Input
                            id="genre"
                            placeholder="Action, Drama, Coding"
                            {...register('genre', {
                                setValueAs: (v) => typeof v === 'string' ? v.split(',').map((s: string) => s.trim()) : v
                            })}
                        />
                        <ErrorMessage>{errors.genre?.message}</ErrorMessage>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="thumbnail">Thumbnail Image</Label>
                            <div className="flex gap-2">
                                <Input id="thumbnail" {...register('thumbnail')} placeholder="Paste image URL" onChange={(e) => setThumbnailPreview(e.target.value)} />
                                <label className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md cursor-pointer transition-colors">
                                    <Upload className="w-4 h-4" />
                                    Upload
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'thumbnail')} />
                                </label>
                            </div>
                            {thumbnailPreview && (
                                <div className="mt-2 border border-dark-border rounded-lg overflow-hidden max-w-[200px]">
                                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-auto" />
                                </div>
                            )}
                            <ErrorMessage>{errors.thumbnail?.message}</ErrorMessage>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="coverImage">Cover Image (Optional)</Label>
                            <div className="flex gap-2">
                                <Input id="coverImage" {...register('coverImage')} placeholder="Paste image URL - Used for background gradient" onChange={(e) => setCoverPreview(e.target.value)} />
                                <label className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md cursor-pointer transition-colors">
                                    <Upload className="w-4 h-4" />
                                    Upload
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'coverImage')} />
                                </label>
                            </div>
                            {coverPreview && (
                                <div className="mt-2 border border-dark-border rounded-lg overflow-hidden max-w-[200px]">
                                    <img src={coverPreview} alt="Cover preview" className="w-full h-auto" />
                                </div>
                            )}
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

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Create Media Item'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
