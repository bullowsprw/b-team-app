"use client";

import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft,
    Search,
    Loader2,
    Ticket,
    X,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    Mail,
    Phone,
    Building2,
    Calendar,
    Tag
} from "lucide-react";
import Link from "next/link";

interface TicketData {
    id: string;
    subject: string;
    category: string;
    description: string;
    status: "Open" | "In Progress" | "Closed";
    createdAt: string;
    userName: string;
    userEmail: string;
    userDepartment: string;
    userMobile?: string;
    userDesignation?: string;
}

function AdminTicketsContent() {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/tickets");
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateTicketStatus = async (ticketId: string, newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/tickets/${ticketId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // Update local state
                setTickets(tickets.map(t =>
                    t.id === ticketId ? { ...t, status: newStatus as any } : t
                ));
                if (selectedTicket?.id === ticketId) {
                    setSelectedTicket({ ...selectedTicket, status: newStatus as any });
                }
            }
        } catch (error) {
            console.error("Failed to update ticket:", error);
        } finally {
            setUpdating(false);
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: tickets.length,
        Open: tickets.filter(t => t.status === "Open").length,
        "In Progress": tickets.filter(t => t.status === "In Progress").length,
        Closed: tickets.filter(t => t.status === "Closed").length,
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Open": return <AlertCircle className="h-4 w-4" />;
            case "In Progress": return <Clock className="h-4 w-4" />;
            case "Closed": return <CheckCircle2 className="h-4 w-4" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Open": return "bg-blue-100 text-blue-700 border-blue-200";
            case "In Progress": return "bg-orange-100 text-orange-700 border-orange-200";
            case "Closed": return "bg-gray-100 text-gray-600 border-gray-200";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50 p-6">
            <div className="mb-6">
                <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Dashboard
                </Link>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manage Tickets</h1>
                <p className="text-gray-500 text-lg">View and manage all support tickets.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "All Tickets", value: statusCounts.all, filter: "all", color: "bg-primary" },
                    { label: "Open", value: statusCounts.Open, filter: "Open", color: "bg-blue-500" },
                    { label: "In Progress", value: statusCounts["In Progress"], filter: "In Progress", color: "bg-orange-500" },
                    { label: "Closed", value: statusCounts.Closed, filter: "Closed", color: "bg-gray-500" },
                ].map((stat) => (
                    <button
                        key={stat.filter}
                        onClick={() => setStatusFilter(stat.filter)}
                        className={`p-4 rounded-lg border-2 transition-all ${statusFilter === stat.filter
                                ? "border-primary bg-primary/5"
                                : "border-transparent bg-white hover:border-gray-200"
                            }`}
                    >
                        <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                        <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    placeholder="Search by subject, name, or ID..."
                    className="h-12 pl-11 bg-white border-none shadow-sm"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Tickets List */}
            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {filteredTickets.map((ticket) => (
                        <Card
                            key={ticket.id}
                            className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
                            style={{ borderLeftColor: ticket.status === "Open" ? "#3b82f6" : ticket.status === "In Progress" ? "#f97316" : "#9ca3af" }}
                            onClick={() => setSelectedTicket(ticket)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-gray-400">#{ticket.id}</span>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                {ticket.category}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 truncate">{ticket.subject}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">{ticket.description}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {ticket.userName || "Unknown"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredTickets.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            <Ticket className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No tickets found.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Ticket Detail Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTicket(null)}>
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <CardHeader className="border-b flex flex-row items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-mono text-gray-400">#{selectedTicket.id}</span>
                                    <span className={`text-xs uppercase font-bold px-2 py-1 rounded-full border ${getStatusColor(selectedTicket.status)}`}>
                                        {getStatusIcon(selectedTicket.status)}
                                        <span className="ml-1">{selectedTicket.status}</span>
                                    </span>
                                </div>
                                <CardTitle className="text-xl">{selectedTicket.subject}</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedTicket(null)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Employee Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Submitted By</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium">{selectedTicket.userName || "Unknown"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span>{selectedTicket.userEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                        <span>{selectedTicket.userDepartment || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Details */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                    <span className="text-xs font-bold uppercase text-gray-500">Category</span>
                                    <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{selectedTicket.category}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Description</h4>
                                <div className="bg-white border rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                                    {selectedTicket.description}
                                </div>
                            </div>

                            {/* Status Actions */}
                            <div className="border-t pt-6">
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Change Status</h4>
                                <div className="flex flex-wrap gap-2">
                                    {["Open", "In Progress", "Closed"].map((status) => (
                                        <Button
                                            key={status}
                                            variant={selectedTicket.status === status ? "default" : "outline"}
                                            size="sm"
                                            disabled={updating || selectedTicket.status === status}
                                            onClick={() => updateTicketStatus(selectedTicket.id, status)}
                                            className="gap-2"
                                        >
                                            {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : getStatusIcon(status)}
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default function AdminTicketsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <AdminTicketsContent />
        </Suspense>
    );
}
