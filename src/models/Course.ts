import mongoose from 'mongoose';

export interface ICourse extends mongoose.Document {
    title: string;
    slug: string;
    description: string;
    rating: number;
    quality: string;
    genre: string[];
    year: number;
    language: string;
    thumbnail: string;
    coverImage: string;
    magnetLink?: string;
    magnetLinks?: { title: string; magnetLink: string }[];
    fileSize: string;
    seeders: number;
    leechers: number;
    liveUrl: string;
    status: 'draft' | 'published';
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema = new mongoose.Schema<ICourse>(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title for this course.'],
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        slug: {
            type: String,
            required: [true, 'Please provide a slug for this course.'],
            unique: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a description for this course.'],
        },
        rating: {
            type: Number,
            default: 0,
        },
        quality: {
            type: String,
            required: [true, 'Please specify quality (e.g. 1080p).'],
        },
        genre: {
            type: [String],
            required: [true, 'Please provide at least one genre.'],
        },
        year: {
            type: Number,
            required: [true, 'Please provide the year.'],
        },
        language: {
            type: String,
            required: [true, 'Please provide the language.'],
        },
        thumbnail: {
            type: String,
            required: [true, 'Please provide a thumbnail URL.'],
        },
        coverImage: {
            type: String,
            required: false,
        },
        magnetLink: {
            type: String,
            required: false,
        },
        magnetLinks: [
            {
                title: { type: String, required: true },
                magnetLink: { type: String, required: true },
            },
        ],
        fileSize: {
            type: String,
            required: [true, 'Please provide the file size.'],
        },
        seeders: {
            type: Number,
            default: 0,
        },
        leechers: {
            type: Number,
            default: 0,
        },
        liveUrl: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'published',
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Force Mongoose to pick up schema changes in development
if (mongoose.models && mongoose.models.Course) {
    delete mongoose.models.Course;
}

export default mongoose.model<ICourse>('Course', CourseSchema);
