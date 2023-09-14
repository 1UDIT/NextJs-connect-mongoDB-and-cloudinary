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

        if (user === '4dmin' && pwd === 'testpwd123') {
            try {
                // connect to the database
                let { db } = await connectToDatabase();
                // fetch the posts   
                let posts = await db
                    .collection('toplists')
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

        if (user === '4dmin' && pwd === 'testpwd123') {
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
                        .collection('toplists')
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

        if (user === '4dmin' && pwd === 'testpwd123') {
            try {
                // connect to the database
                let { db } = await connectToDatabase();
                let formData = await req.formData();
                let body = Object.fromEntries(formData);
                const result = await cloudinary.uploader.upload(body.profile_img, {
                    folder: 'treading'
                }); 
                const cloudinary_id = result.public_id;
                try {
                    const newTask = new Task({
                        title: body.title,
                        profile_img: result.secure_url,
                        cloudinary_id: result.public_id,
                        description: body.description
                    });
                    let myPost = await db.collection("toplists").insertOne(newTask);
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