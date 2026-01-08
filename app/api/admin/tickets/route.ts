import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { tickets, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET: Fetch all tickets (admin only)
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userList = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    const user = userList[0];

    if (user?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        // Fetch all tickets with user info
        const allTickets = await db
            .select({
                id: tickets.id,
                subject: tickets.subject,
                category: tickets.category,
                description: tickets.description,
                status: tickets.status,
                createdAt: tickets.createdAt,
                attachmentUrl: tickets.attachmentUrl,
                userId: tickets.userId,
                userName: users.name,
                userEmail: users.email,
                userDepartment: users.department,
            })
            .from(tickets)
            .leftJoin(users, eq(tickets.userId, users.id))
            .orderBy(desc(tickets.createdAt));

        return NextResponse.json(allTickets);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
}
