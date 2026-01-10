
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    try {
        // In a real app, verify admin session here.
        const data = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            mobile: users.mobile,
            designation: users.designation
        }).from(users).orderBy(desc(users.name));

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
