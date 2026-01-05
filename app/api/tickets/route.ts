import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { tickets, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subject, category, description } = body;

    try {
        // Look up user by email
        const userList = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
        const user = userList[0];

        const userId = user?.id || "unknown"; // Should not happen if logged in properly with synced DB

        const newTicketId = Math.random().toString(36).substring(7);

        await db.insert(tickets).values({
            id: newTicketId,
            userId: userId,
            subject,
            category,
            description,
            status: "Open",
            attachmentUrl: "",
        });

        // Simulate Email Notification
        console.log(`
      [EMAIL SIMULATION] 
      To: admin@bullows.com, management@bullows.com
      Subject: New Support Ticket: ${subject}
      From: ${session.user.name} (${session.user.email})
      Category: ${category}
      Description: ${description}
      ---------------------------------------------------
      `);

        return NextResponse.json({ success: true, id: newTicketId });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userList = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
        const user = userList[0];

        if (!user) {
            return NextResponse.json([]);
        }

        const userTickets = await db.select().from(tickets)
            .where(eq(tickets.userId, user.id))
            .orderBy(desc(tickets.createdAt));

        return NextResponse.json(userTickets);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
}
