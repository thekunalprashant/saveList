import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import Activity from "@/models/Activity";
import Task from "@/models/Task";
import Goal from "@/models/Goal";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch data for the last 7 days
    const [activities, pendingTasks, activeGoals] = await Promise.all([
        Activity.find({
            userId,
            createdAt: { $gte: sevenDaysAgo }
        }),
        Task.countDocuments({ userId, status: 'pending' }),
        Goal.countDocuments({ userId, status: 'active' }),
    ]);

    // Calculate daily completion counts
    const completionsByDay = new Array(7).fill(0);
    activities.forEach(activity => {
        if (activity.action === 'task_completed') {
            const dayIndex = 6 - Math.floor((new Date().getTime() - new Date(activity.createdAt).getTime()) / (1000 * 60 * 60 * 24));
            if (dayIndex >= 0 && dayIndex < 7) {
                completionsByDay[dayIndex]++;
            }
        }
    });

    return NextResponse.json({
        weeklycompletions: completionsByDay,
        stats: {
            pendingTasks,
            activeGoals,
            totalActionsLastWeek: activities.length
        }
    });
}
