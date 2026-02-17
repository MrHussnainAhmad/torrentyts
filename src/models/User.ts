import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
    email: string;
    password?: string;
    name?: string;
    role: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            maxlength: [60, 'Email cannot be more than 60 characters'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            select: false, // Don't return password by default
        },
        name: {
            type: String,
            maxlength: [60, 'Name cannot be more than 60 characters'],
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password!);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
