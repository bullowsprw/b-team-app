"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Holiday {
    id: string;
    name: string;
    date: string;
    type: "public" | "optional";
}

export default function HolidaysPage() {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/holidays")
            .then((res) => res.json())
            .then((data) => {
                // Sort by date
                const sorted = data.sort((a: Holiday, b: Holiday) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setHolidays(sorted);
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-6">
            <div className="mb-6">
                <Link href="/dashboard" className="text-sm text-gray-500 hover:underline mb-2 block">
                    &larr; Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Holiday List 2024</h1>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-4 max-w-3xl">
                    {holidays.map((holiday) => (
                        <Card key={holiday.id} className="flex flex-row items-center p-4">
                            <div className="bg-green-100 p-3 rounded-xl mr-4">
                                <Calendar className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{holiday.name}</h3>
                                <p className={cn(
                                    "text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1",
                                    holiday.type === "public" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                                )}>
                                    {holiday.type} Holiday
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-800">
                                    {new Date(holiday.date).getDate()}
                                </div>
                                <div className="text-sm font-medium text-gray-500 uppercase">
                                    {new Date(holiday.date).toLocaleString('default', { month: 'short' })}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
