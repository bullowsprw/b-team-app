"use client";

import { Logo } from "./logo";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User, LogOut } from "lucide-react";

export function Navbar() {
    const { data: session } = useSession();

    return (
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-50">
            <Logo width={120} height={40} />

            <div className="flex items-center gap-4">
                {session ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                            <User className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-600 hidden md:inline-block">
                                {session.user?.name || "Employee"}
                            </span>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
                            onClick={() => signOut()}
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/login" className="text-sm font-medium hover:underline">
                            Login
                        </Link>
                        <Button asChild size="sm">
                            <a href="/register">Register</a>
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}

// Helper Link wrapper if not imported
function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return <a href={href} className={className}>{children}</a>;
}
