import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/dbConfig/dbConfig";
import cloudinary from "@/app/cloudinary Database/index";
import Scheduler from "@/app/models/AnimeScheduler";


// SeasonTotal: await model.distinct('$Season', {})

export async function GET() {
    try { 
        let { db } = await connectToDatabase();

        let posts = await db
            .collection('schedules')
            .find({})
            .toArray();

        let totalSeason = await db
            .collection('schedules')
            .distinct("Season"); 
        // return the posts
        return NextResponse.json(
            {
                query: posts,
                totalSeason: totalSeason,
            },
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                    'cache-control': 'public, max-age=31536000, immutable',
                },

            });
    } catch (error) {
        // return the error
        return NextResponse.json({
            message: new Error(error).message,
            success: false,
        }, {
            status: 400,
        });
    }

}

export async function DELETE(req) {
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // fetch the posts   
        let formData = await req.formData();
        let body = Object.fromEntries(formData);
        console.log(body.id, "ID");
        let posts = await db
            .collection('schedules')
            .deleteOne({ 'cloudinary_id': { '$in': [body.id] } });

        if (posts.deletedCount === 1) {
            return NextResponse.json(
                {
                    message: "Successfully deleted one document."
                },
                {
                    status: "202"
                });
        } else {
            return NextResponse.json(
                {
                    message: "No documents matched the query. Deleted 0 documents."
                },
                {
                    status: "202"
                });
        }

    } catch (error) {
        // return the error
        return NextResponse.json({
            message: new Error(error).message,
            success: false,
        });
    }

}


export async function POST(req) {
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        let formData = await req.formData();
        let body = Object.fromEntries(formData);
        const result = await cloudinary.uploader.upload(body.profile_img, {
            folder: 'weekly'
        });
        console.log("body", body.title, "body.file.path", result.secure_url, result.public_id);
        const cloudinary_id = result.public_id;
        try {
            const newTask = new Scheduler({
                title: body.title,
                profile_img: result.secure_url,
                cloudinary_id: result.public_id,
                description: body.description,
                day: body.day,
                Time: body.Time,
                Studio: body.Studio,
                Season: body.Season,
            });
            let myPost = await db.collection("schedules").insertOne(newTask);
            // return the posts
            return NextResponse.json(
                {
                    message: myPost
                },
                {
                    status: '201',
                });
        } catch (mongoErr) {
            console.log(`Removing ${cloudinary_id} due to failed save`);
            await cloudinary.uploader.destroy(cloudinary_id);
            throw mongoErr;
        }
    } catch (error) {
        // return the error
        return NextResponse.json({
            message: new Error(error).message,
            success: false,
        },
            {
                status: '400',
            });
    }
}
