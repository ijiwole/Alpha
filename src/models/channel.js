import mongoose, { Schema } from 'mongoose';

const channelSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    avatar: {
        type: String,
    },

    isPublished: {
        type: Boolean,
        default: false
    },
    coverImage: {
        type: String, // cloudinary url
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Channel = mongoose.model('Channel', channelSchema);


