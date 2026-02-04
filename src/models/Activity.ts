import mongoose, { Schema, model, models } from 'mongoose';

const ActivitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., 'task_completed', 'goal_created', 'watchlist_added'
    entityType: {
        type: String,
        enum: ['task', 'goal', 'watchlist', 'user'],
        required: true
    },
    entityId: { type: Schema.Types.ObjectId, required: true },
    details: { type: Object }, // Flexible object for extra data
}, { timestamps: true });

const Activity = models.Activity || model('Activity', ActivitySchema);

export default Activity;
