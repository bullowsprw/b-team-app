import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const data = await db.select().from(users).where(eq(users.role, 'employee'));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, designation, department, mobile, whatsapp, location, employeeCode } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and Email are required" }, { status: 400 });
    }

    const defaultPasswordHash = await bcrypt.hash("password123", 10);
    const id = Math.random().toString(36).substring(2, 11);

    await db.insert(users).values({
      id,
      name,
      email,
      designation,
      department,
      location,
      mobile,
      whatsapp,
      role: 'employee',
      passwordHash: defaultPasswordHash,
      employeeCode: employeeCode || `EMP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
