import { NextResponse } from "next/server";
import { db } from "@/db";
import { policies } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    try {
        const data = await db.select().from(policies).orderBy(desc(policies.createdAt));
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({
            error: `DB Error: ${error.message || JSON.stringify(error)}`
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, fileUrl, version } = body;

        const newId = Math.random().toString(36).substring(7);

        await db.insert(policies).values({
            id: newId,
            title,
            description,
            fileUrl,
            version: version || "1.0",
        });

        return NextResponse.json({ success: true, id: newId });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to create policy" }, { status: 500 });
    }
}
