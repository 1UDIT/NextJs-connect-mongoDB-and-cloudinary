import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/dbConfig/dbConfig";
import Task from "@/app/models/WeeklyApiFormat";
import cloudinary from "@/app/cloudinary Database/index";
import { ObjectId } from 'bson';


export async function GET() {
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // fetch the posts   
        let posts = await db
            .collection('weeklytreadings')
            .find({})
            .sort({ published: -1 })
            .toArray();
        // return the posts
        return NextResponse.json(
            {
                message: posts
            },
            {
                status: 200,
                // headers: {
                //     'content-type': 'application/json',
                //     'cache-control': 'public, max-age=31536000, immutable',
                // },
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
        const result = await cloudinary.uploader.destroy(body.id, {
            folder: 'weekly'
        });
        console.log("body.id", body.id, "body.file.path", result.secure_url, result.public_id);
        const cloudinary_id = result.public_id;
        try {

            let posts = await db
                .collection('weeklytreadings')
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
        });
    }

}


export async function POST(req) {
    // try {
    //     // connect to the database
    //     let { db } = await connectToDatabase();
    //     let formData = await req.formData();
    //     let body = Object.fromEntries(formData);
    //     // const result = await cloudinary.uploader.upload(body.file.path, {
    //     //     folder: 'weekly'
    //     // }); 
    //     // const cloudinary_id = result.public_id; 

    //     // try {

    //         console.log("body", body.title,  "profile_img");

    //         const newTask = new WeeklyApiFormat({
    //             title: body.title,
    //             // profile_img: result.secure_url,
    //             // cloudinary_id: result.public_id,
    //         });
    //         let myPost = await db.collection("posts").insertOne(newTask);

    //         return NextResponse.json(
    //             {
    //                 message: myPost
    //             },
    //             {
    //                 status: '201',
    //             });

    //     // } catch (mongoErr) {
    //     //     console.log(`Removing ${cloudinary_id} due to failed save`);
    //     //     await cloudinary.uploader.destroy(cloudinary_id);
    //     //     throw mongoErr;
    //     // }


    //     // connect to the database
    //     // let formData = await req.formData();
    //     // let body = Object.fromEntries(formData);
    //     // // console.log("body", body.title);

    //     // const newTask = new TrendWeekly({
    //     //     title: body.title
    //     // });
    //     // let myPost = await db.collection("posts").insertOne(newTask); 


    //     // return the posts
    //     // return NextResponse.json(
    //     //     {
    //     //         message: myPost
    //     //     },
    //     //     {
    //     //         status: '201',
    //     //     }); 
    // } catch (error) {
    //     // return the error
    //     return NextResponse.json({
    //         message: new Error(error).message,
    //         success: false,
    //     },
    //         {
    //             status: '400',
    //         });
    // } 

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
            const newTask = new Task({
                title: body.title,
                profile_img: result.secure_url,
                cloudinary_id: result.public_id,
                description: body.description
            });
            let myPost = await db.collection("weeklytreadings").insertOne(newTask);
            // return the posts
            return NextResponse.json(
                {
                    message: myPost
                },
                {
                    status: '201',
                    headers: {
                        'content-type': 'application/json',
                        'cache-control': 'public, max-age=31536000, immutable',
                    },
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