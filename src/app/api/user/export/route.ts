import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import Task from "@/models/Task";
import Goal from "@/models/Goal";
import WatchlistItem from "@/models/WatchlistItem";
import Activity from "@/models/Activity";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [tasks, goals, watchlist, activities] = await Promise.all([
        Task.find({ userId: session.user.id }),
        Goal.find({ userId: session.user.id }),
        WatchlistItem.find({ userId: session.user.id }),
        Activity.find({ userId: session.user.id }),
    ]);

    return NextResponse.json({
        exportDate: new Date().toISOString(),
        user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
        },
        data: {
            tasks,
            goals,
            watchlist,
            history: activities
        }
    });
}
