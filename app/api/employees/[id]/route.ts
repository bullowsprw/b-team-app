import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, email, designation, department, mobile, whatsapp, location, employeeCode } = body;
        const { id } = params;

        await db
            .update(users)
            .set({
                name,
                email,
                designation,
                department,
                location,
                mobile,
                whatsapp,
                employeeCode,
            })
            .where(eq(users.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        await db.delete(users).where(eq(users.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
    }
}
