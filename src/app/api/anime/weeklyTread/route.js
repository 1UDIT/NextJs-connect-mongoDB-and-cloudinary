import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/dbConfig/dbConfig";
// const cloudinary = require("../cloudinary Database/index");
import cloudinary from "@/app/cloudinary Database/index";



export async function POST(request) {
    try { 
        console.log(await request.body);
        return NextResponse.json("posts", {
            status: 201,
        });
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400,
        });
    }


}
