import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/dbConfig/dbConfig";


// SeasonTotal: await model.distinct('$Season', {})

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const Season = searchParams.get("Season");
        const day = searchParams.get("day");
        let { db } = await connectToDatabase();
        if (Season && day !== 'All') {
            let posts = await db
                .collection('schedules')
                .find({ 'day': { '$in': [day] }, 'Season': { '$in': [Season] } })
                .toArray();

            let totalSeason = await db
                .collection('schedules')
                .distinct("Season");
            console.log(Season, day)
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
        } else {
            let posts = await db
                .collection('schedules')
                .find({ 'Season': { '$in': [Season] } })
                .toArray();

            let totalSeason = await db
                .collection('schedules')
                .distinct("Season");

            console.log(Season, day, "Else-If")
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
        }

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
