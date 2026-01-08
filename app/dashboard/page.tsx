"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, LifeBuoy, Megaphone, Users, ShieldCheck, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
    const { data: session } = useSession();

    const features = [
        {
            title: "Employee Policy",
            icon: FileText,
            href: "/dashboard/policies",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "Holiday List",
            icon: Calendar,
            href: "/dashboard/holidays",
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            title: "Employee Directory",
            icon: Users,
            href: "/dashboard/directory",
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            title: "Support",
            icon: LifeBuoy,
            href: "/dashboard/support",
            color: "text-orange-600",
            bgColor: "bg-orange-100",
        },
        {
            title: "News",
            icon: Megaphone,
            href: "#", // Placeholder for Phase 2
            color: "text-red-600",
            bgColor: "bg-red-100",
        },
    ];

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50">
            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Good Morning, {session?.user?.name?.split(" ")[0] || "Team"}
                    </h2>
                    <p className="text-gray-500">Here is what's happening today.</p>
                </div>

                {/* Admin Section (Only for Admins) */}
                {(session?.user as any)?.role === "admin" && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="h-6 w-6 text-red-600" />
                            <h3 className="text-xl font-bold text-gray-800">Administrator Tools</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <Link href="/dashboard/admin/employees" className="block h-full">
                                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-red-200 bg-red-50/30 shadow-none">
                                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full space-y-3">
                                        <div className="p-3 rounded-full bg-red-100">
                                            <Settings className="h-6 w-6 text-red-600" />
                                        </div>
                                        <span className="font-bold text-red-900">Manage Employees</span>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Feature Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {features.map((feature) => (
                        <Link key={feature.title} href={feature.href} className="block h-full">
                            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm bg-white">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full space-y-4">
                                    <div className={`p-4 rounded-full ${feature.bgColor}`}>
                                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                                    </div>
                                    <span className="font-medium text-gray-700">{feature.title}</span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>

            {/* Bottom Nav (Mobile Only) */}
            <div className="md:hidden fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-md border shadow-lg rounded-2xl p-4 flex justify-around items-center z-50">
                <Link href="/dashboard" className="flex flex-col items-center text-primary">
                    <div className="bg-primary/10 p-2 rounded-full mb-1">
                        <Users className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link href="/dashboard/directory" className="flex flex-col items-center text-gray-500 hover:text-primary transition-colors">
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium">Directory</span>
                </Link>
                <Link href="/dashboard/support" className="flex flex-col items-center text-gray-500 hover:text-primary transition-colors">
                    <LifeBuoy className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium">Support</span>
                </Link>
            </div>
        </div>
    );
}
