"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LogoutPage() {
    return (
        <div className="flex flex-col items-center">
            <div className="mb-12 flex flex-col items-center">
                <Logo width={240} height={80} priority />
            </div>

            <Card className="w-full text-center">
                <CardHeader className="space-y-4 pb-6">
                    <div className="mx-auto bg-green-100 p-4 rounded-full w-fit">
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
                    <CardDescription className="text-lg">
                        You have been logged out successfully.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <p className="text-gray-500 mb-6">
                        Your session has been securely ended.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/login">Login Again</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
