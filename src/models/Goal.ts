import mongoose, { Schema, model, models } from 'mongoose';

const SubtaskSchema = new Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    deadline: { type: Date },
    notes: { type: String },
});

const GoalSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    emoji: { type: String, default: '🎯' },
    deadline: { type: Date },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    subtasks: [SubtaskSchema],
    streak: { type: Number, default: 0 },
    completedAt: { type: Date },
}, {
    timestamps: true
});

// Create indexes for better query performance
GoalSchema.index({ userId: 1, createdAt: -1 });
GoalSchema.index({ userId: 1, status: 1 });

const Goal = models.Goal || model('Goal', GoalSchema);

export default Goal;
