import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import Goal from "@/models/Goal";
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

    if (updates.status === "completed") {
        updates.completedAt = new Date();
    }

    const goal = await Goal.findOneAndUpdate(
        { _id: id, userId: session.user.id },
        updates,
        { new: true }
    );

    if (!goal) {
        return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    if (updates.status === "completed") {
        await Activity.create({
            userId: session.user.id,
            action: "goal_completed",
            entityType: "goal",
            entityId: goal._id,
            details: { title: goal.title },
        });
    }

    return NextResponse.json(goal);
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

    const goal = await Goal.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!goal) {
        return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Goal deleted" });
}
