import { z } from 'zod';

export const courseSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    rating: z.number().min(0).max(10).default(0),
    quality: z.string().min(1, 'Quality is required'),
    genre: z.array(z.string()).min(1, 'Select at least one genre'),
    year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    language: z.string().min(1, 'Language is required'),
    thumbnail: z.string().url('Invalid thumbnail URL'),
    coverImage: z.string().url('Invalid cover image URL').optional().or(z.literal('')),
    magnetLink: z.string().startsWith('magnet:?', 'Invalid magnet link format'),
    fileSize: z.string().min(1, 'File size is required'),
    seeders: z.coerce.number().min(0).default(0),
    leechers: z.coerce.number().min(0).default(0),
    liveUrl: z.string().url('Invalid live URL').optional().or(z.literal('')),
    status: z.enum(['draft', 'published']).default('published'),
    isFeatured: z.boolean().default(false),
});

export type CourseFormData = z.infer<typeof courseSchema>;
