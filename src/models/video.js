import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    
    videoFile: {
        type: String, // cloudinary url
        required: true
    },
    thumbnail: {
        type: String, 
        required: true // cloudinary url
    },
    title: {
        type: String,
        required: true
    },
    describtion: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    likes: {
        type: Number,
        ref: "Like"
    },
    owner: {
        type: String,
        ref: "User"
    }
},{ timestamps: true })
videoSchema.plugin(mongoosePaginate);
videoSchema.plugin(mongooseAggregatePaginate)

export const Video =  mongoose.model( "Video", videoSchema )
