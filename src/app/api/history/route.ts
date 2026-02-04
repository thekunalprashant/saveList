import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import Activity from "@/models/Activity";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const activities = await Activity.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .limit(50); // Get recent 50 activities

    return NextResponse.json(activities);
}
