"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LifeBuoy, Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Simplified Select wrapper if shadcn Select component is not fully set up or complex to scaffold manually
// We will use standard select for simplicity in Phase 3 unless we want to scaffold all Select primitives.
// Let's stick to standard <select> for "Category" to avoid missing dependency issues with Radix UI dropdowns if not installed.
// Actually, let's try to use standard HTML elements where possible to reduce complexity/errors, 
// but styling them nicely.

interface Ticket {
    id: string;
    subject: string;
    category: string;
    status: "Open" | "In Progress" | "Closed";
    createdAt: string;
    description: string;
}

export default function SupportPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("raise");
    const [isLoading, setIsLoading] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(true);

    // Form State
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("IT");
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, [activeTab]);

    const fetchTickets = async () => {
        setLoadingTickets(true);
        try {
            const res = await fetch("/api/tickets");
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoadingTickets(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, category, description }),
            });

            if (res.ok) {
                setSubmitted(true);
                setSubject("");
                setDescription("");
                // Simulating email sent success
            }
        } catch (error) {
            console.error("Error submitting ticket", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewTicket = () => {
        setSubmitted(false);
        setActiveTab("raise");
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-6">
            <div className="mb-6">
                <Link href="/dashboard" className="text-sm text-gray-500 hover:underline mb-2 block">
                    &larr; Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Support Helpdesk</h1>
                <p className="text-gray-500">Raise queries or report issues.</p>
            </div>

            <Card className="max-w-4xl mx-auto w-full">
                <CardHeader>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="raise">Raise a Ticket</TabsTrigger>
                            <TabsTrigger value="history">My Tickets</TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            <TabsContent value="raise">
                                {submitted ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center animation-fade-in">
                                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Ticket Submitted!</h3>
                                        <p className="text-gray-500 mt-2 max-w-md">
                                            Your support request has been sent to the admin team. A confirmation email has been sent to <strong>{session?.user?.email}</strong>.
                                        </p>
                                        <div className="mt-8 flex gap-4">
                                            <Button onClick={handleNewTicket}>Raise Another</Button>
                                            <Button variant="outline" onClick={() => setActiveTab("history")}>View Status</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Subject</label>
                                                <Input
                                                    placeholder="Brief summary of the issue"
                                                    value={subject}
                                                    onChange={(e) => setSubject(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Category</label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                >
                                                    <option value="IT">IT Support</option>
                                                    <option value="HR">HR Query</option>
                                                    <option value="Admin">Admin / Facilities</option>
                                                    <option value="Payroll">Payroll</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Description</label>
                                            <textarea
                                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Please describe your issue in detail..."
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Attachment (Optional)</label>
                                            <Input type="file" className="cursor-pointer" />
                                            <p className="text-xs text-gray-400">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                                        </div>

                                        <div className="pt-4">
                                            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="mr-2 h-4 w-4" />
                                                        Submit Ticket
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </TabsContent>

                            <TabsContent value="history">
                                {loadingTickets ? (
                                    <div className="flex justify-center p-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : tickets.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <LifeBuoy className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p>No tickets found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {tickets.map((ticket) => (
                                            <div key={ticket.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                                <div className="space-y-1 mb-2 md:mb-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold text-gray-900">{ticket.subject}</h4>
                                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                                                            ticket.status === 'Closed' ? 'bg-gray-100 text-gray-700' :
                                                                'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {ticket.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 line-clamp-1">{ticket.description}</p>
                                                    <div className="text-xs text-gray-400 flex gap-2">
                                                        <span>{ticket.category}</span>
                                                        <span>•</span>
                                                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                {ticket.status === 'Open' && (
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardHeader>
            </Card>
        </div>
    );
}
