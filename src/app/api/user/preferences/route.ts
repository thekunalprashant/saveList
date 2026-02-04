import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    return NextResponse.json(user?.preferences || {});
}

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { preferences } = await req.json();

    await dbConnect();

    const user = await User.findByIdAndUpdate(
        session.user.id,
        { $set: { preferences } },
        { new: true }
    );

    return NextResponse.json(user.preferences);
}
