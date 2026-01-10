
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendOtpEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { email, mobile } = await req.json();

        if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return NextResponse.json({ error: "User already registered" }, { status: 400 });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Save to DB (Delete old tokens for this email first)
        await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email));

        await db.insert(verificationTokens).values({
            identifier: email,
            token: otp,
            expires,
        });

        // Send Email
        await sendOtpEmail(email, otp);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("OTP Generate Error:", error);
        return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 });
    }
}
