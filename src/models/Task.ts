import mongoose, { Schema, model, models } from 'mongoose';

const TaskSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    dueDate: { type: Date },
    completedAt: { type: Date },
    tags: [{ type: String }],
    pinned: { type: Boolean, default: false },
    recurring: {
        isRecurring: { type: Boolean, default: false },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'none'],
            default: 'none'
        },
    },
    durationMinutes: { type: Number },
    timerStatus: {
        type: String,
        enum: ['idle', 'running', 'paused'],
        default: 'idle'
    },
    startTime: { type: Date },
    accumulatedTime: { type: Number, default: 0 },
}, {
    timestamps: true
});

// Create indexes for better query performance
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, pinned: -1, createdAt: -1 });

const Task = models.Task || model('Task', TaskSchema);

export default Task;
