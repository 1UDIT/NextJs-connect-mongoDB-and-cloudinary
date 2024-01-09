import { Schema, model, models } from "mongoose";

const MovieModelApi = new  Schema({
    title: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    Studio: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    Streaming: {
        type: String,
        required: false
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
export default models.MovieModel || model("MovieModel", MovieModelApi); 