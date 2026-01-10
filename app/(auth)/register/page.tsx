"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<"details" | "otp">("details");
    const [formData, setFormData] = useState({
        name: "", employeeCode: "", email: "", mobile: "", designation: "", doj: "", password: ""
    });
    const [otp, setOtp] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.type === "tel" ? "mobile" : e.target.type === "email" ? "email" : e.target.id || e.target.name || "unknown"]: e.target.value });
    };
    // Helper to bind inputs easily since I used a quick one-liner above that might be buggy with IDs vs names
    // Let's use specific handlers or better names.
    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    async function onRegister(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/otp/generate", {
                method: "POST",
                body: JSON.stringify({ email: formData.email, mobile: formData.mobile }),
            });
            const data = await res.json();

            if (res.ok) {
                setStep("otp");
                alert("OTP Sent to your email! (Check console if no API key)");
            } else {
                alert(data.error || "Please try again.");
            }
        } catch (error) {
            alert("Network Error");
        }
        setIsLoading(false);
    }

    async function onVerify(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                body: JSON.stringify({ ...formData, otp }),
            });
            const data = await res.json();

            if (res.ok) {
                alert("Registration Successful!");
                router.push("/login");
            } else {
                alert(data.error || "Invalid Token");
            }
        } catch (error) {
            alert("Verification Failed");
        }
        setIsLoading(false);
    }

    return (
        <div className="flex flex-col items-center">
            <div className="mb-12 flex flex-col items-center">
                <Logo width={240} height={80} priority />
            </div>

            <Card className="w-full">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {step === "details" ? "Create an account" : "Verify Email"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === "details"
                            ? "Enter your details to register"
                            : `Enter the OTP sent to ${formData.email}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === "details" ? (
                        <form onSubmit={onRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Employee Name</label>
                                    <Input placeholder="John Doe" required onChange={handleChange("name")} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Employee Code</label>
                                    <Input placeholder="EMP001" required onChange={handleChange("employeeCode")} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input type="email" placeholder="john@company.com" required onChange={handleChange("email")} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mobile Number</label>
                                <Input type="tel" placeholder="+1 234 567 890" required onChange={handleChange("mobile")} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Designation</label>
                                    <Input placeholder="Software Engineer" required onChange={handleChange("designation")} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date of Joining</label>
                                    <Input type="date" required onChange={handleChange("doj")} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input type="password" required onChange={handleChange("password")} />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? "Sending OTP..." : "Register"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={onVerify} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">One-Time Password</label>
                                <Input
                                    placeholder="123456"
                                    className="text-center text-lg tracking-widest"
                                    maxLength={6}
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? "Verifying..." : "Verify & Complete"}
                            </Button>
                            <Button variant="link" className="w-full" onClick={() => setStep("details")}>
                                Back to Details
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
