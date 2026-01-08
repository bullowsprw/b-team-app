import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { tickets, users } from "@/db/schema";
import { eq } from "drizzle-orm";

// PUT: Update ticket status (admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!["Open", "In Progress", "Closed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    try {
        await db.update(tickets)
            .set({ status })
            .where(eq(tickets.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
    }
}

// GET: Fetch single ticket details (admin only)
export async function GET(req: Request, { params }: { params: { id: string } }) {
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

    const { id } = params;

    try {
        const ticketData = await db
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
                userMobile: users.mobile,
                userDepartment: users.department,
                userDesignation: users.designation,
            })
            .from(tickets)
            .leftJoin(users, eq(tickets.userId, users.id))
            .where(eq(tickets.id, id))
            .limit(1);

        if (ticketData.length === 0) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        return NextResponse.json(ticketData[0]);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 });
    }
}
