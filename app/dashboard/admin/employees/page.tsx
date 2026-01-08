export const dynamic = 'force-dynamic';

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    Save,
    Loader2,
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Building2
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Employee {
    id: string;
    name: string;
    email: string;
    employeeCode: string;
    designation: string;
    department: string;
    mobile: string;
    whatsapp: string;
    location: string;
}

export default function AdminEmployeesPage() {
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (editId && employees.length > 0) {
            const emp = employees.find(e => e.id === editId);
            if (emp) {
                setEditingEmployee(emp);
                setIsEditing(true);
                // Optional: Clear searchQuery if you want to ensure the edit modal is focused correctly
                setSearchQuery("");
            }
        }
    }, [editId, employees]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/employees");
            const data = await res.json();
            setEmployees(data);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const isNew = !editingEmployee?.id;
            const url = isNew ? "/api/employees" : `/api/employees/${editingEmployee.id}`;
            const method = isNew ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingEmployee),
            });

            if (res.ok) {
                await fetchEmployees();
                setIsEditing(false);
                setEditingEmployee(null);
            }
        } catch (error) {
            console.error("Failed to save employee:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this employee?")) return;

        try {
            const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
            if (res.ok) {
                setEmployees(employees.filter(emp => emp.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete employee:", error);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50 p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors mb-4">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manage Employees</h1>
                    <p className="text-gray-500 text-lg">Create, edit, and manage employee records.</p>
                </div>
                <Button onClick={() => { setEditingEmployee({}); setIsEditing(true); }} className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6">
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Employee
                </Button>
            </div>

            {isEditing ? (
                <Card className="max-w-4xl mx-auto border-none shadow-lg">
                    <CardHeader className="border-b bg-gray-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-black text-gray-800">
                                {editingEmployee?.id ? "Edit Employee Details" : "Register New Employee"}
                            </CardTitle>
                            <Button variant="ghost" onClick={() => setIsEditing(false)} className="h-8 w-8 p-0 rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider text-xs">
                                        <User className="h-4 w-4 text-primary" /> Full Name
                                    </label>
                                    <Input
                                        required
                                        value={editingEmployee?.name || ""}
                                        onChange={e => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                                        placeholder="e.g. John Doe"
                                        className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider text-xs">
                                        <Mail className="h-4 w-4 text-primary" /> Email ID
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        value={editingEmployee?.email || ""}
                                        onChange={e => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                                        placeholder="john@bullows.com"
                                        className="h-12 border-gray-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider text-xs">
                                        <Briefcase className="h-4 w-4 text-primary" /> Designation
                                    </label>
                                    <Input
                                        value={editingEmployee?.designation || ""}
                                        onChange={e => setEditingEmployee({ ...editingEmployee, designation: e.target.value })}
                                        placeholder="e.g. Sales Manager"
                                        className="h-12 border-gray-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider text-xs">
                                        <Building2 className="h-4 w-4 text-primary" /> Department
                                    </label>
                                    <Input
                                        value={editingEmployee?.department || ""}
                                        onChange={e => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                                        placeholder="e.g. Marketing"
                                        className="h-12 border-gray-200"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider text-xs">
                                        <div className="h-4 w-4 text-primary flex items-center justify-center font-black text-[10px] border border-primary rounded-sm">ID</div> Employee ID
                                    </label>
                                    <Input
                                        value={editingEmployee?.employeeCode || ""}
                                        onChange={e => setEditingEmployee({ ...editingEmployee, employeeCode: e.target.value })}
                                        placeholder="EMP001"
                                        className="h-12 border-gray-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider text-xs">
                                        <Phone className="h-4 w-4 text-primary" /> Contact No
                                    </label>
                                    <Input
                                        value={editingEmployee?.mobile || ""}
                                        onChange={e => setEditingEmployee({ ...editingEmployee, mobile: e.target.value })}
                                        placeholder="+91 00000 00000"
                                        className="h-12 border-gray-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider text-xs">
                                        <span className="text-green-600 font-bold text-lg leading-none mr-1">W</span> WhatsApp No
                                    </label>
                                    <Input
                                        value={editingEmployee?.whatsapp || ""}
                                        onChange={e => setEditingEmployee({ ...editingEmployee, whatsapp: e.target.value })}
                                        placeholder="+91 00000 00000"
                                        className="h-12 border-gray-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider text-xs">
                                        <MapPin className="h-4 w-4 text-primary" /> Location
                                    </label>
                                    <Input
                                        value={editingEmployee?.location || ""}
                                        onChange={e => setEditingEmployee({ ...editingEmployee, location: e.target.value })}
                                        placeholder="Mumbai, India"
                                        className="h-12 border-gray-200"
                                    />
                                </div>
                            </div>
                            <div className="col-span-full pt-6 flex gap-3">
                                <Button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 uppercase tracking-widest">
                                    {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                                    Save Employee
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1 h-12 border-2 hover:bg-gray-50 uppercase tracking-widest">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Search by name, ID, or email..."
                            className="h-12 pl-11 bg-white border-none shadow-sm"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Card className="border-none shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left bg-white">
                                <thead className="bg-gray-50 border-b text-[10px] uppercase tracking-widest font-black text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4">Employee</th>
                                        <th className="px-6 py-4">ID / Dept</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary/30" />
                                                Loading employees...
                                            </td>
                                        </tr>
                                    ) : filteredEmployees.length > 0 ? (
                                        filteredEmployees.map(emp => (
                                            <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{emp.name}</div>
                                                    <div className="text-xs text-gray-500">{emp.designation}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-700">{emp.employeeCode}</div>
                                                    <div className="text-xs text-gray-500">{emp.department}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-700">{emp.email}</div>
                                                    <div className="text-xs text-primary font-medium">{emp.mobile}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-700">{emp.location || "Not Set"}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => { setEditingEmployee(emp); setIsEditing(true); }}
                                                            className="h-9 w-9 p-0 hover:text-blue-600 hover:border-blue-200"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(emp.id)}
                                                            className="h-9 w-9 p-0 hover:text-red-600 hover:border-red-200"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                                                No employees found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
