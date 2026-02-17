import mongoose, { Schema, Document } from 'mongoose';

export interface IVisit extends Document {
    ipHash: string;
    userAgent?: string;
    path: string;
    timestamp: Date;
}

const VisitSchema: Schema = new Schema({
    ipHash: { type: String, required: true, index: true },
    userAgent: { type: String },
    path: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
});

// Compound index for unique visits per IP per day if we want to optimize aggregation, 
// but for now, we'll just index timestamp for range queries.

export default mongoose.models.Visit || mongoose.model<IVisit>('Visit', VisitSchema);
