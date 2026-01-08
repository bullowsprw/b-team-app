import { Navbar } from "@/components/navbar";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex flex-1 flex-col items-center justify-center p-24 bg-gray-50">
                <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col mb-12">
                    <h1 className="text-5xl font-black text-primary mb-2 text-center">B TEAM</h1>
                    <p className="text-gray-500 text-lg uppercase tracking-widest">Internal Engagement Platform</p>
                </div>

                <div className="flex gap-4">
                    <Link href="/login" className="px-8 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 font-bold transition-all hover:scale-105">
                        Login
                    </Link>
                    <Link href="/register" className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 font-bold transition-all hover:scale-105">
                        Register
                    </Link>
                </div>
            </main>
        </div>
    );
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return <a href={href} className={className}>{children}</a>;
}
