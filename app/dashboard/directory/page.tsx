"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Phone, Mail, Loader2, UserCircle } from "lucide-react";
import Link from "next/link";

interface Employee {
    id: string;
    name: string;
    designation: string;
    email: string;
    mobile: string;
}

export default function DirectoryPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filtered, setFiltered] = useState<Employee[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/employees")
            .then((res) => res.json())
            .then((data) => {
                setEmployees(data);
                setFiltered(data);
                setLoading(false);
            });
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase();
        setQuery(val);
        setFiltered(
            employees.filter(
                (emp) =>
                    emp.name.toLowerCase().includes(val) ||
                    emp.designation.toLowerCase().includes(val)
            )
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-6">
            <div className="mb-6">
                <Link href="/dashboard" className="text-sm text-gray-500 hover:underline mb-2 block">
                    &larr; Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
                <p className="text-gray-500">Find and contact your colleagues.</p>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search by name or designation..."
                    className="pl-10 h-10 bg-white"
                    value={query}
                    onChange={handleSearch}
                />
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((emp) => (
                        <Card key={emp.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-20"></div>
                                <div className="px-6 pb-6 -mt-10">
                                    <div className="bg-white rounded-full p-1 w-20 h-20 flex items-center justify-center shadow-sm">
                                        <UserCircle className="h-full w-full text-gray-300" />
                                    </div>
                                    <div className="mt-3">
                                        <h3 className="font-bold text-lg text-gray-900">{emp.name}</h3>
                                        <p className="text-sm text-blue-600 font-medium">{emp.designation}</p>
                                    </div>

                                    <div className="mt-6 flex space-x-3">
                                        <Button className="flex-1 bg-green-600 hover:bg-green-700" size="sm" asChild>
                                            <a href={`tel:${emp.mobile}`}>
                                                <Phone className="h-3 w-3 mr-2" />
                                                Call
                                            </a>
                                        </Button>
                                        <Button className="flex-1" variant="outline" size="sm" asChild>
                                            <a href={`mailto:${emp.email}`}>
                                                <Mail className="h-3 w-3 mr-2" />
                                                Email
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            No employees found matching &quot;{query}&quot;
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
