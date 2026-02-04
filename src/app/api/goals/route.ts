import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import Goal from "@/models/Goal";
import Activity from "@/models/Activity";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const goals = await Goal.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json(goals);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, emoji, deadline, priority, subtasks } = await req.json();

    if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await dbConnect();

    const goal = await Goal.create({
        userId: session.user.id,
        title,
        description,
        emoji,
        deadline,
        priority,
        subtasks: subtasks || [],
    });

    await Activity.create({
        userId: session.user.id,
        action: "goal_created",
        entityType: "goal",
        entityId: goal._id,
        details: { title },
    });

    return NextResponse.json(goal, { status: 201 });
}
