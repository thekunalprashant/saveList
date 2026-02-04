import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";
import Task from "@/models/Task";
import Goal from "@/models/Goal";
import WatchlistItem from "@/models/WatchlistItem";
import Activity from "@/models/Activity";

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = session.user.id;

    // Perform cascading delete
    await Promise.all([
        Task.deleteMany({ userId }),
        Goal.deleteMany({ userId }),
        WatchlistItem.deleteMany({ userId }),
        Activity.deleteMany({ userId }),
        User.findByIdAndDelete(userId),
    ]);

    return NextResponse.json({ message: "Account and data deleted successfully" });
}
