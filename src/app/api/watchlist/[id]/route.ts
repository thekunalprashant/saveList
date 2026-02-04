import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import WatchlistItem from "@/models/WatchlistItem";
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

    if (updates.status === "finished") {
        updates.watchedAt = new Date();
    }

    const item = await WatchlistItem.findOneAndUpdate(
        { _id: id, userId: session.user.id },
        updates,
        { new: true }
    );

    if (!item) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (updates.status === "finished") {
        await Activity.create({
            userId: session.user.id,
            action: "watchlist_finished",
            entityType: "watchlist",
            entityId: item._id,
            details: { title: item.title },
        });
    }

    return NextResponse.json(item);
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

    const item = await WatchlistItem.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!item) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted" });
}
