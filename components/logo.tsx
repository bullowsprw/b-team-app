import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
    showText?: boolean;
    priority?: boolean;
}

export function Logo({
    className = "",
    width = 180,
    height = 60,
    showText = true,
    priority = false
}: LogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-3 hover:opacity-90 transition-opacity ${className}`}>
            <div className="relative" style={{ width, height }}>
                <Image
                    src="/logo.png"
                    alt="Bullows Logo"
                    fill
                    className="object-contain"
                    priority={priority}
                />
            </div>
            {showText && (
                <span className="text-2xl font-black tracking-tighter text-primary">
                    B TEAM
                </span>
            )}
        </Link>
    );
}
