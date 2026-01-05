"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, FileText, Calendar, CheckCircle, Database } from "lucide-react";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("policies");

    // Status
    const [dbStatus, setDbStatus] = useState<"unknown" | "connected" | "error">("unknown");
    const [errorMsg, setErrorMsg] = useState("");

    // Policy Form
    const [pTitle, setPTitle] = useState("");
    const [pUrl, setPUrl] = useState("");
    const [pDesc, setPDesc] = useState("");
    const [isSubmittingP, setIsSubmittingP] = useState(false);

    // Holiday Form
    const [hName, setHName] = useState("");
    const [hDate, setHDate] = useState("");
    const [isSubmittingH, setIsSubmittingH] = useState(false);

    useEffect(() => {
        // Simple check to see if we can fetch data (implies DB connection)
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
    }, []);

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
            } else {
                alert("Failed to create policy");
            }
        } catch (e) { console.error(e); alert("Error"); }
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
                alert("Holiday Added!");
                setHName(""); setHDate("");
            } else {
                alert("Failed to add holiday");
            }
        } catch (e) { console.error(e); alert("Error"); }
        setIsSubmittingH(false);
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
                    {dbStatus === 'error' && <p className="text-xs text-red-500 mt-1 mr-1">{errorMsg}</p>}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="policies">Manage Policies</TabsTrigger>
                    <TabsTrigger value="holidays">Manage Holidays</TabsTrigger>
                </TabsList>

                <TabsContent value="policies">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Policy</CardTitle>
                            <CardDescription>Share a link to a policy document (e.g. Google Drive, Dropbox PDF).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreatePolicy} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Policy Name</label>
                                    <Input placeholder="e.g. Work From Home Policy" value={pTitle} onChange={e => setPTitle(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Document URL</label>
                                    <Input placeholder="https://..." value={pUrl} onChange={e => setPUrl(e.target.value)} required />
                                    <p className="text-xs text-gray-400 mt-1">Paste a direct link to your PDF.</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Short Description</label>
                                    <Input placeholder="Brief details..." value={pDesc} onChange={e => setPDesc(e.target.value)} required />
                                </div>
                                <Button type="submit" disabled={isSubmittingP}>
                                    {isSubmittingP ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                    Create Policy
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="holidays">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Holiday</CardTitle>
                            <CardDescription>Add upcoming holidays to the company calendar.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateHoliday} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Holiday Name</label>
                                    <Input placeholder="e.g. Independence Day" value={hName} onChange={e => setHName(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Date</label>
                                    <Input type="date" value={hDate} onChange={e => setHDate(e.target.value)} required />
                                </div>
                                <Button type="submit" disabled={isSubmittingH}>
                                    {isSubmittingH ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                    Add Holiday
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
