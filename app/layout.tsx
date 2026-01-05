import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Font optimization requires setup, skipping import for manual scaffold simplicity initially or using standard text
import "./globals.css";

import { Providers } from "@/components/providers";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "B Team App",
    description: "Employee Engagement Platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background font-sans antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
