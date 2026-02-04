import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import Task from "@/models/Task";
import Activity from "@/models/Activity";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const tasks = await Task.find({ userId: session.user.id })
        .sort({ pinned: -1, createdAt: -1 })
        .lean();

    return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, priority, dueDate, recurring } = await req.json();

    if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await dbConnect();

    const task = await Task.create({
        userId: session.user.id,
        title,
        description,
        priority,
        dueDate,
        recurring,
    });

    // Log activity
    await Activity.create({
        userId: session.user.id,
        action: "task_created",
        entityType: "task",
        entityId: task._id,
        details: { title },
    });

    return NextResponse.json(task, { status: 201 });
}
