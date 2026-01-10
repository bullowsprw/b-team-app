
import { NextResponse } from "next/server";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
    try {
        const data = await db.select().from(announcements).orderBy(desc(announcements.date));
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, content } = body;
        const newId = Math.random().toString(36).substring(7);

        await db.insert(announcements).values({
            id: newId,
            title,
            content,
            date: new Date(),
        });

        return NextResponse.json({ success: true, id: newId });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await db.delete(announcements).where(eq(announcements.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
    }
}
