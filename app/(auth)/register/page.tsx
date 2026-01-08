"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<"details" | "otp">("details");

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setStep("otp");
        }, 1500);
    }

    async function onOtpSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);
        // Simulate verification
        setTimeout(() => {
            setIsLoading(false);
            alert("Registration Successful! Please login.");
            // In real app, redirect to login
        }, 1500);
    }

    return (
        <div className="flex flex-col items-center">
            <div className="mb-12 flex flex-col items-center">
                <Logo width={240} height={80} priority />
            </div>

            <Card className="w-full">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {step === "details" ? "Create an account" : "Verify Mobile"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === "details"
                            ? "Enter your details to register"
                            : "Enter the OTP sent to your email & mobile number"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === "details" ? (
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Employee Name</label>
                                    <Input placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Employee Code</label>
                                    <Input placeholder="EMP001" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input type="email" placeholder="john@company.com" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mobile Number</label>
                                <Input type="tel" placeholder="+1 234 567 890" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Designation</label>
                                    <Input placeholder="Software Engineer" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date of Joining</label>
                                    <Input type="date" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input type="password" required />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? "Sending OTP..." : "Register"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={onOtpSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">OTP</label>
                                <Input placeholder="123456" className="text-center text-lg tracking-widest" maxLength={6} required />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? "Verifying..." : "Verify & Complete"}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="w-full text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
