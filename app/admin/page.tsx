"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Database, User, Megaphone, Calendar, FileText } from "lucide-react";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("policies");

    // Status
    const [dbStatus, setDbStatus] = useState<"unknown" | "connected" | "error">("unknown");
    const [errorMsg, setErrorMsg] = useState("");

    // Data Lists
    const [holidays, setHolidays] = useState<any[]>([]);
    const [news, setNews] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    // Policy Form
    const [pTitle, setPTitle] = useState("");
    const [pUrl, setPUrl] = useState("");
    const [pDesc, setPDesc] = useState("");
    const [isSubmittingP, setIsSubmittingP] = useState(false);

    // Holiday Form
    const [hName, setHName] = useState("");
    const [hDate, setHDate] = useState("");
    const [isSubmittingH, setIsSubmittingH] = useState(false);

    // News Form
    const [nTitle, setNTitle] = useState("");
    const [nContent, setNContent] = useState("");
    const [isSubmittingN, setIsSubmittingN] = useState(false);

    useEffect(() => {
        checkDb();
        fetchData();
    }, []);

    const checkDb = () => {
        fetch("/api/policies")
            .then(async res => {
                if (res.ok) {
                    setDbStatus("connected");
                    setErrorMsg("");
                } else {
                    setDbStatus("error");
                    try {
                        const err = await res.json();
                        setErrorMsg(err.error || res.statusText);
                    } catch { setErrorMsg("Connection Failed"); }
                }
            })
            .catch((e) => {
                setDbStatus("error");
                setErrorMsg(e.message || "Network Error");
            });
    };

    const fetchData = async () => {
        // Fetch Holidays
        fetch("/api/holidays").then(res => res.json()).then(data => {
            if (Array.isArray(data)) setHolidays(data);
        }).catch(err => console.error(err));

        // Fetch News
        fetch("/api/news").then(res => res.json()).then(data => {
            if (Array.isArray(data)) setNews(data);
        }).catch(err => console.error(err));

        // Fetch Users
        fetch("/api/users").then(res => res.json()).then(data => {
            if (Array.isArray(data)) setUsers(data);
        }).catch(err => console.error(err));
    };

    // --- Actions ---

    const handleCreatePolicy = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingP(true);
        try {
            const res = await fetch("/api/policies", {
                method: "POST",
                body: JSON.stringify({ title: pTitle, fileUrl: pUrl, description: pDesc, version: "1.0" }),
            });
            if (res.ok) {
                alert("Policy Created!");
                setPTitle(""); setPUrl(""); setPDesc("");
            } else alert("Failed to create policy");
        } catch (e) { alert("Error"); }
        setIsSubmittingP(false);
    };

    const handleCreateHoliday = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingH(true);
        try {
            const res = await fetch("/api/holidays", {
                method: "POST",
                body: JSON.stringify({ name: hName, date: hDate, type: "public" }),
            });
            if (res.ok) {
                setHName(""); setHDate("");
                fetchData(); // Refresh list
            } else alert("Failed to add holiday");
        } catch (e) { alert("Error"); }
        setIsSubmittingH(false);
    };

    const handleDeleteHoliday = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/holidays?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
        } catch (e) { alert("Delete Failed"); }
    };

    const handleCreateNews = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingN(true);
        try {
            const res = await fetch("/api/news", {
                method: "POST",
                body: JSON.stringify({ title: nTitle, content: nContent }),
            });
            if (res.ok) {
                setNTitle(""); setNContent("");
                fetchData(); // Refresh list
            } else alert("Failed to add news");
        } catch (e) { alert("Error"); }
        setIsSubmittingN(false);
    };

    const handleDeleteNews = async (id: string) => {
        if (!confirm("Delete this announcement?")) return;
        try {
            const res = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
        } catch (e) { alert("Delete Failed"); }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                    <p className="text-gray-500">Manage your organization's data.</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm">
                        <Database className={`h-4 w-4 ${dbStatus === 'connected' ? 'text-green-500' : dbStatus === 'error' ? 'text-red-500' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">
                            {dbStatus === 'connected' ? 'Database Connected' : dbStatus === 'error' ? 'Connection Error' : 'Checking Connection...'}
                        </span>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-5xl mx-auto">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="policies">Policies</TabsTrigger>
                    <TabsTrigger value="holidays">Holidays</TabsTrigger>
                    <TabsTrigger value="news">News Portal</TabsTrigger>
                    <TabsTrigger value="users">Users Data</TabsTrigger>
                </TabsList>

                {/* --- POLICIES --- */}
                <TabsContent value="policies">
                    <Card>
                        <CardHeader><CardTitle>Add New Policy</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreatePolicy} className="space-y-4">
                                <Input placeholder="Policy Name" value={pTitle} onChange={e => setPTitle(e.target.value)} required />
                                <Input placeholder="Document URL" value={pUrl} onChange={e => setPUrl(e.target.value)} required />
                                <Input placeholder="Description" value={pDesc} onChange={e => setPDesc(e.target.value)} required />
                                <Button type="submit" disabled={isSubmittingP}>
                                    {isSubmittingP ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                    Create Policy
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- HOLIDAYS --- */}
                <TabsContent value="holidays">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader><CardTitle>Add Holiday</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateHoliday} className="space-y-4">
                                    <Input placeholder="Holiday Name" value={hName} onChange={e => setHName(e.target.value)} required />
                                    <Input type="date" value={hDate} onChange={e => setHDate(e.target.value)} required />
                                    <Button type="submit" disabled={isSubmittingH}>
                                        {isSubmittingH ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                        Add Holiday
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Existing Holidays</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {holidays.length === 0 && <p className="text-gray-500 text-sm">No holidays found.</p>}
                                    {holidays.map((h) => (
                                        <div key={h.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                                            <div>
                                                <p className="font-medium text-sm">{h.name}</p>
                                                <p className="text-xs text-gray-500">{new Date(h.date).toLocaleDateString()}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteHoliday(h.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- NEWS --- */}
                <TabsContent value="news">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader><CardTitle>Post Announcement</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateNews} className="space-y-4">
                                    <Input placeholder="Title (e.g. Office Closed)" value={nTitle} onChange={e => setNTitle(e.target.value)} required />
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="News content..."
                                        value={nContent}
                                        onChange={e => setNContent(e.target.value)}
                                        required
                                    />
                                    <Button type="submit" disabled={isSubmittingN}>
                                        {isSubmittingN ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Megaphone className="mr-2 h-4 w-4" />}
                                        Post News
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Recent News</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {news.length === 0 && <p className="text-gray-500 text-sm">No announcements yet.</p>}
                                    {news.map((n) => (
                                        <div key={n.id} className="flex items-start justify-between p-3 border rounded-lg bg-white">
                                            <div>
                                                <p className="font-medium text-sm">{n.title}</p>
                                                <p className="text-xs text-gray-500 line-clamp-2">{n.content}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.date).toLocaleDateString()}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteNews(n.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- USERS --- */}
                <TabsContent value="users">
                    <Card>
                        <CardHeader><CardTitle>Registered Users</CardTitle></CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-700 font-medium">
                                        <tr>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3">Designation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {users.length === 0 && (
                                            <tr><td colSpan={4} className="p-4 text-center text-gray-500">No users found.</td></tr>
                                        )}
                                        {users.map((u) => (
                                            <tr key={u.id}>
                                                <td className="p-3 font-medium">{u.name || "N/A"}</td>
                                                <td className="p-3 text-gray-500">{u.email}</td>
                                                <td className="p-3"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{u.role}</span></td>
                                                <td className="p-3 text-gray-500">{u.designation || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
