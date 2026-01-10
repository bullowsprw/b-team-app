
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs"; // Make sure bcryptjs is installed, or valid alternative

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { otp, ...userDetails } = body;
        const { email, password, name, designation, mobile, employeeCode, doj } = userDetails;

        if (!email || !otp) return NextResponse.json({ error: "Missing data" }, { status: 400 });

        // Verify OTP
        const tokens = await db.select()
            .from(verificationTokens)
            .where(and(
                eq(verificationTokens.identifier, email),
                eq(verificationTokens.token, otp)
            ));

        if (tokens.length === 0) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        const tokenData = tokens[0];
        if (new Date() > new Date(tokenData.expires)) {
            return NextResponse.json({ error: "OTP Expired" }, { status: 400 });
        }

        // Create User
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            id: crypto.randomUUID(),
            name,
            email,
            passwordHash: hashedPassword,
            designation,
            mobile,
            employeeCode, // Ensure schema matches (camelCase in TS, snake_case in DB usually handled by Drizzle)
            doj: doj ? new Date(doj).toISOString() : null,
            role: "employee",
        });

        // Delete Token
        await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("OTP Verify Error:", error);
        return NextResponse.json({ error: "Verification Failed" }, { status: 500 });
    }
}
