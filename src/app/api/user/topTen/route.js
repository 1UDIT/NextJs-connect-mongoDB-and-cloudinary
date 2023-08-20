import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/dbConfig/dbConfig";




export async function GET() {
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
        });
    }

}
