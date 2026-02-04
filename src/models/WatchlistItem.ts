import mongoose, { Schema, model, models } from 'mongoose';

const WatchlistItemSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ['movie', 'show'],
        default: 'movie'
    },
    notes: { type: String },
    genre: [{ type: String }],
    year: { type: Number },
    rating: { type: Number, min: 0, max: 10 },
    status: {
        type: String,
        enum: ['not-started', 'watching', 'finished'],
        default: 'not-started'
    },
    posterUrl: { type: String },
    trailerUrl: { type: String },
    watchedAt: { type: Date },
}, {
    timestamps: true
});

// Create indexes for better query performance
WatchlistItemSchema.index({ userId: 1, createdAt: -1 });
WatchlistItemSchema.index({ userId: 1, type: 1 });
WatchlistItemSchema.index({ userId: 1, status: 1 });

const WatchlistItem = models.WatchlistItem || model('WatchlistItem', WatchlistItemSchema);

export default WatchlistItem;
