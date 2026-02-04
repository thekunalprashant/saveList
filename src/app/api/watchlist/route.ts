import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import WatchlistItem from "@/models/WatchlistItem";
import Activity from "@/models/Activity";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const items = await WatchlistItem.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, type, notes, genre, year, status, posterUrl, trailerUrl } = await req.json();

    if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await dbConnect();

    const item = await WatchlistItem.create({
        userId: session.user.id,
        title,
        type,
        notes,
        genre,
        year,
        status,
        posterUrl,
        trailerUrl,
    });

    await Activity.create({
        userId: session.user.id,
        action: "watchlist_added",
        entityType: "watchlist",
        entityId: item._id,
        details: { title, type },
    });

    return NextResponse.json(item, { status: 201 });
}
