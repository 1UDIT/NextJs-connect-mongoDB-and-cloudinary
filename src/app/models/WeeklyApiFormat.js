import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
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
        },
        description: {
            type: String,
            required: true
        },         
        createdAt: {
            type: Date,
            default: Date.now
        }        
    }

);

export default models.Task || model("Task", TaskSchema);