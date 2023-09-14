import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/dbConfig/dbConfig";
import Task from "@/app/models/WeeklyApiFormat";
import cloudinary from "@/app/cloudinary Database/index";
import { ObjectId } from 'bson';


export async function GET(req) {
    const basicAuth = req.headers.get('authorization')

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1]
        const [user, pwd] = atob(authValue).split(':')

        if (user === process.env.userLogin && pwd === process.env.passWord) {
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
                        query: posts
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
        } else {
            return NextResponse.json({
                message: "You are not authenticated!",
                success: false,
            }, {
                status: 401,
            });
        }
    }


}

export async function DELETE(req) {
    const basicAuth = req.headers.get('authorization')

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1]
        const [user, pwd] = atob(authValue).split(':')

        if (user === process.env.userLogin && pwd === process.env.passWord) {
            try {
                // connect to the database
                let { db } = await connectToDatabase();
                // fetch the posts   
                let formData = await req.formData();
                let body = Object.fromEntries(formData);
                const result = await cloudinary.uploader.destroy(body.id, {
                    folder: 'weekly'
                }); 
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
        } else {
            return NextResponse.json({
                message: "You are not authenticated!",
                success: false,
            }, {
                status: 401,
            });
        }
    }
}


export async function POST(req) {
    const basicAuth = req.headers.get('authorization')

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1]
        const [user, pwd] = atob(authValue).split(':')

        if (user === process.env.userLogin && pwd === process.env.passWord) {
            try {
                // connect to the database
                let { db } = await connectToDatabase();
                let formData = await req.formData();
                let body = Object.fromEntries(formData);
                const result = await cloudinary.uploader.upload(body.profile_img, {
                    folder: 'weekly'
                }); 
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
        } else {
            return NextResponse.json({
                message: "You are not authenticated!",
                success: false,
            },
                {
                    headers: {
                        'content-type': 'application/json',
                        'cache-control': 'public, max-age=31536000, immutable',
                    }, status: 401,
                });
        }
    }


}