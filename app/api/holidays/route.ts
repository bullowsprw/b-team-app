import { NextResponse } from "next/server";
import { db } from "@/db";
import { holidays } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET() {
    try {
        const data = await db.select().from(holidays).orderBy(asc(holidays.date));
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch holidays" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, date, type } = body;

        const newId = Math.random().toString(36).substring(7);

        await db.insert(holidays).values({
            id: newId,
            name,
            date: new Date(date).toISOString(), // drizzle-orm with postgres-js usually handles Date, but if lint complains, check schema
            type: type || "public",
        });

        return NextResponse.json({ success: true, id: newId });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to create holiday" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await db.delete(holidays).where(eq(holidays.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete holiday" }, { status: 500 });
    }
}
