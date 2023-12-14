import { Schema, model, models } from "mongoose";

const NewsModel = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    profile_img: {
        type: String,
        required: true
    },
    cloudinary_id: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default models.NewsModelTime || model("NewsModelTime", NewsModel); 