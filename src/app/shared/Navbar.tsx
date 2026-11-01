"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Aperture,
    Menu,
    X,
} from "lucide-react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/#about" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        if (href === "/studios") {
            return pathname.startsWith("/studios");
        }
        return false;
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-purple-400">
            <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
                <Link
                    href="/"
                    className="flex items-center gap-2.5"
                    onClick={() => setMenuOpen(false)}
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#8F51EA] to-[#FE53BB] text-white shadow-lg shadow-purple-200">
                        <Aperture size={26} strokeWidth={2.2} />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-[#211D35] sm:text-2xl">
                            Studio<span className="text-[#8F51EA]">Space</span>
                        </span>
                    </div>
                </Link>
                <div className="hidden items-center gap-8 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative py-2 text-sm font-semibold transition-colors duration-300 ${isActive(link.href)
                                ? "text-[#8F51EA]"
                                : "text-[#77718B] hover:text-[#8F51EA]"
                                }`}
                        >
                            {link.name}

                            {isActive(link.href) && (
                                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-[#8F51EA] to-[#FE53BB]" />
                            )}
                        </Link>
                    ))}
                </div>
                <div className="hidden items-center gap-3 lg:flex">
                    <Link
                        href="/login"
                        className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#8F51EA] transition hover:bg-purple-100"
                    >
                        Login
                    </Link>

                    <Link
                        href="/register"
                        className="space-btn text-sm font-semibold text-white"
                    >
                        Register
                    </Link>
                </div>
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-[#211D35] transition hover:bg-purple-50 lg:hidden"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={25} /> : <Menu size={25} />}
                </button>
            </nav>
            {menuOpen && (
                <div className="border-t border-purple-100 bg-white px-5 py-5 shadow-lg lg:hidden">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive(link.href)
                                    ? "bg-purple-50 text-[#8F51EA]"
                                    : "text-[#77718B] hover:bg-purple-50 hover:text-[#8F51EA]"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="mt-3 flex flex-col gap-3 border-t border-purple-100 pt-4">
                            <Link
                                href="/login"
                                onClick={() => setMenuOpen(false)}
                                className="rounded-full border border-purple-200 px-5 py-3 text-center text-sm font-semibold text-[#8F51EA]"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="space-btn text-sm font-semibold text-white"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}