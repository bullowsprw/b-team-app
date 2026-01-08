"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Phone, Mail, Loader2, UserCircle, MessageSquare, MapPin, Building2, Edit2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Employee {
    id: string;
    name: string;
    designation: string;
    email: string;
    mobile: string;
    whatsapp: string;
    department: string;
    location: string;
}

export default function DirectoryPage() {
    const { data: session } = useSession();
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
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50 p-6">
            <div className="mb-6">
                <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors mb-4">
                    &larr; Back to Dashboard
                </Link>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Employee Directory</h1>
                <p className="text-gray-500 text-lg">Find and contact your colleagues.</p>
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
                                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{emp.name}</h3>
                                        <p className="text-sm text-primary font-bold">{emp.designation}</p>
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center text-xs text-gray-500 font-medium">
                                                <Building2 className="h-3 w-3 mr-1" /> {emp.department || "General"}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500 font-medium">
                                                <MapPin className="h-3 w-3 mr-1" /> {emp.location || "Office"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-4 gap-2">
                                        <Button className="bg-green-600 hover:bg-green-700 h-10 px-0" size="sm" asChild title="Call">
                                            <a href={`tel:${emp.mobile}`}>
                                                <Phone className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button className="bg-[#25D366] hover:bg-[#128C7E] h-10 px-0" size="sm" asChild title="WhatsApp">
                                            <a href={`https://wa.me/${emp.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                                <MessageSquare className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button variant="outline" className="h-10 px-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200" size="sm" asChild title="Email">
                                            <a href={`mailto:${emp.email}`}>
                                                <Mail className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        {(session?.user as any)?.role === "admin" && (
                                            <Button variant="ghost" className="h-10 px-0 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200" size="sm" asChild title="Edit Employee">
                                                <Link href={`/dashboard/admin/employees?edit=${emp.id}`}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        )}
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
