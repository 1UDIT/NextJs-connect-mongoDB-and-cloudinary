import { Schema, model, models } from "mongoose";

const Scheduler = new Schema(
    {
        profile_img: {
            type: String,
            required: true
        },
        cloudinary_id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'null'],
            required: true
        },
        Time: {
            type: String,
            required: true
        },
        Studio: {
            type: String,
            required: true
        },
        Season: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

export default models.SchedulerTime || model("SchedulerTime", Scheduler); 
