"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import Link from "next/link";

interface Policy {
    id: string;
    title: string;
    description: string;
    version: string;
    fileUrl: string;
}

export default function PoliciesPage() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/policies")
            .then((res) => res.json())
            .then((data) => {
                setPolicies(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:underline mb-2 block">
                        &larr; Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Company Policies</h1>
                    <p className="text-gray-500">View and download official company documents.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {policies.map((policy) => (
                        <Card key={policy.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-semibold leading-none">
                                            {policy.title}
                                        </CardTitle>
                                        <p className="text-xs text-gray-500">v{policy.version}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-gray-500 mb-4 h-10 overflow-hidden text-ellipsis line-clamp-2">
                                    {policy.description}
                                </div>
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <a href={policy.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download PDF
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
