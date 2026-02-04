import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },
    image: { type: String },
    emailVerified: { type: Date },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'amoled', 'auto'],
            default: 'auto'
        },
        compactView: { type: Boolean, default: false },
        showTimestamps: { type: Boolean, default: true },
        motivationalQuotes: { type: Boolean, default: true },
        animationsEnabled: { type: Boolean, default: true },
    },
    onboarded: { type: Boolean, default: false },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
