import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import Task from "@/models/Task";
import Activity from "@/models/Activity";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updates = await req.json();

    await dbConnect();

    // If status is being changed to completed, set completedAt
    if (updates.status === "completed") {
        updates.completedAt = new Date();
    } else if (updates.status === "pending") {
        updates.completedAt = null;
    }

    const task = await Task.findOneAndUpdate(
        { _id: id, userId: session.user.id },
        updates,
        { new: true }
    );

    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Handle Recurring Tasks
    if (updates.status === "completed" && task.recurring?.isRecurring) {
        const nextDueDate = new Date(task.dueDate || new Date());
        if (task.recurring.frequency === 'daily') nextDueDate.setDate(nextDueDate.getDate() + 1);
        else if (task.recurring.frequency === 'weekly') nextDueDate.setDate(nextDueDate.getDate() + 7);
        else if (task.recurring.frequency === 'monthly') nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        if (task.recurring.frequency !== 'none') {
            await Task.create({
                userId: session.user.id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: nextDueDate,
                recurring: task.recurring,
                tags: task.tags,
            });
        }
    }

    // Log activity if completed
    if (updates.status === "completed") {
        await Activity.create({
            userId: session.user.id,
            action: "task_completed",
            entityType: "task",
            entityId: task._id,
            details: { title: task.title },
        });
    }

    return NextResponse.json(task);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    const task = await Task.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted" });
}
