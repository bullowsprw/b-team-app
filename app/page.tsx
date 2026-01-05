import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-4xl font-bold text-primary mb-8">B Team App</h1>
            </div>

            <div className="flex gap-4">
                <Link href="/login" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
                    Login
                </Link>
                <Link href="/register" className="px-4 py-2 border border-input rounded hover:bg-accent">
                    Register
                </Link>
            </div>
        </main>
    );
}
