"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Aperture,
    Menu,
    X,
    UserRound,
    LayoutDashboard,
    PlusCircle,
    Building2,
    CalendarCheck,
    LogOut,
    ChevronDown,
} from "lucide-react";

import { authClient } from "@/app/lib/auth-client";
import ThemeToggle from "@/components/ThemeToogle";
import toast from "react-hot-toast";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Why Choose Us", href: "/#why-choose" },
];

const dashboardLinks = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Add New Studio",
        href: "/add-newstudio",
        icon: PlusCircle,
    },
    {
        name: "My Studio Listings",
        href: "/my-listings",
        icon: Building2,
    },
    {
        name: "My Bookings",
        href: "/my-bookings",
        icon: CalendarCheck,
    },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [activeHash, setActiveHash] = useState("");

    const user = session?.user;

    useEffect(() => {
        setActiveHash(window.location.hash);

        const handleHashChange = () => {
            setActiveHash(window.location.hash);
        };

        window.addEventListener("hashchange", handleHashChange);

        const sections = document.querySelectorAll("section[id], div[id]");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveHash(`#${entry.target.id}`);
                    }
                });
            },
            { threshold: 0.3 }
        );

        sections.forEach((section) => observer.observe(section));

        return () => {
            window.removeEventListener("hashchange", handleHashChange);
            observer.disconnect();
        };
    }, []);

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/" && !activeHash;
        }

        if (href === "/studios") {
            return pathname.startsWith("/studios");
        }

        if (href.startsWith("/#")) {
            const linkHash = href.substring(1);
            return pathname === "/" && activeHash === linkHash;
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const closeMenus = () => {
        setMenuOpen(false);
        setProfileOpen(false);
    };

    const handleLogout = async () => {
        try {
            setLoggingOut(true);

            const { error } = await authClient.signOut();

            if (error) {
                toast.error(error.message || "Logout failed.");
                return;
            }

            closeMenus();
            toast.success("Logged out successfully!");

            router.push("/");
            router.refresh();
        } catch {
            toast.error("Unable to logout. Please try again.");
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/90 backdrop-blur-xl transition-colors dark:border-[#352844] dark:bg-[#1c1629]/90">
            <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5"
                    onClick={closeMenus}
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#8F51EA] to-[#FE53BB] text-white shadow-lg shadow-purple-200 dark:shadow-purple-950/30">
                        <Aperture size={26} strokeWidth={2.2} />
                    </div>

                    <span className="text-xl font-bold tracking-tight text-[#211D35] dark:text-[#F5F0FF] sm:text-2xl">
                        Studio<span className="text-[#8F51EA]">Space</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 lg:flex xl:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative py-2 text-sm font-semibold transition-colors duration-300 ${isActive(link.href)
                                ? "text-[#8F51EA]"
                                : "text-[#77718B] hover:text-[#8F51EA] dark:text-[#B6AFC7] dark:hover:text-[#C4A9F7]"
                                }`}
                        >
                            {link.name}

                            {isActive(link.href) && (
                                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-[#8F51EA] to-[#FE53BB]" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Desktop Authentication */}
                <div className="hidden items-center gap-3 lg:flex">
                    <ThemeToggle />

                    {!isPending && !user && (
                        <>
                            <Link
                                href="/login"
                                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#8F51EA] transition hover:bg-purple-100 dark:hover:bg-[#302341]"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="space-btn text-sm font-semibold text-white"
                            >
                                Register
                            </Link>
                        </>
                    )}

                    {isPending && (
                        <div className="h-11 w-28 animate-pulse rounded-full bg-purple-100 dark:bg-[#302341]" />
                    )}

                    {!isPending && user && (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2.5 rounded-full border border-purple-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:bg-purple-50 dark:border-[#49375F] dark:bg-[#211A30] dark:hover:bg-[#302341]"
                                aria-label="User profile menu"
                                aria-expanded={profileOpen}
                            >
                                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#8F51EA] to-[#FE53BB] text-white">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user.name || "User"}
                                            fill
                                            unoptimized
                                            sizes="40px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase() || (
                                            <UserRound size={20} />
                                        )
                                    )}
                                </div>

                                <span className="max-w-[100px] truncate text-sm font-semibold text-[#211D35] dark:text-[#F5F0FF]">
                                    {user.name || "My Account"}
                                </span>

                                <ChevronDown
                                    size={17}
                                    className={`text-[#8F51EA] transition-transform ${profileOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-[58px] z-50 w-[270px] overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-xl shadow-purple-200/40 dark:border-[#49375F] dark:bg-[#211A30] dark:shadow-black/30">
                                    <div className="border-b border-purple-100 bg-purple-50/70 p-4 dark:border-[#49375F] dark:bg-[#302341]">
                                        <p className="truncate text-sm font-bold text-[#211D35] dark:text-[#F5F0FF]">
                                            {user.name}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-[#77718B] dark:text-[#B6AFC7]">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        {dashboardLinks.map((link) => {
                                            const Icon = link.icon;

                                            return (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    onClick={closeMenus}
                                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive(link.href)
                                                        ? "bg-purple-50 text-[#8F51EA] dark:bg-[#3A2A50] dark:text-[#C4A9F7]"
                                                        : "text-[#4D475E] hover:bg-purple-50 hover:text-[#8F51EA] dark:text-[#D5CDE5] dark:hover:bg-[#302341] dark:hover:text-[#C4A9F7]"
                                                        }`}
                                                >
                                                    <Icon size={19} />
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <div className="border-t border-purple-100 p-2 dark:border-[#49375F]">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
                                        >
                                            <LogOut size={19} />
                                            {loggingOut ? "Logging out..." : "Logout"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Controls */}
                <div className="flex items-center gap-3 lg:hidden">
                    <ThemeToggle />

                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-[#211D35] transition hover:bg-purple-50 dark:text-[#F5F0FF] dark:hover:bg-[#302341]"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <X size={25} /> : <Menu size={25} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="border-t border-purple-100 bg-white px-5 py-5 shadow-lg dark:border-[#352844] dark:bg-[#1c1629] lg:hidden">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={closeMenus}
                                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive(link.href)
                                    ? "bg-purple-50 text-[#8F51EA] dark:bg-[#302341] dark:text-[#C4A9F7]"
                                    : "text-[#77718B] hover:bg-purple-50 hover:text-[#8F51EA] dark:text-[#B6AFC7] dark:hover:bg-[#302341] dark:hover:text-[#C4A9F7]"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="mt-3 border-t border-purple-100 pt-4 dark:border-[#49375F]">
                            {!isPending && !user && (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/login"
                                        onClick={closeMenus}
                                        className="rounded-full border border-purple-200 px-5 py-3 text-center text-sm font-semibold text-[#8F51EA] dark:border-[#49375F] dark:hover:bg-[#302341]"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        onClick={closeMenus}
                                        className="space-btn text-center text-sm font-semibold text-white"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}

                            {isPending && (
                                <div className="h-16 animate-pulse rounded-xl bg-purple-50 dark:bg-[#302341]" />
                            )}

                            {!isPending && user && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 rounded-xl bg-purple-50 p-3 dark:bg-[#302341]">
                                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#8F51EA] to-[#FE53BB] text-white">
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name || "User"}
                                                    fill
                                                    unoptimized
                                                    sizes="44px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                user.name?.charAt(0).toUpperCase() || (
                                                    <UserRound size={20} />
                                                )
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-[#211D35] dark:text-[#F5F0FF]">
                                                {user.name}
                                            </p>

                                            <p className="truncate text-xs text-[#77718B] dark:text-[#B6AFC7]">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        {dashboardLinks.map((link) => {
                                            const Icon = link.icon;

                                            return (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    onClick={closeMenus}
                                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive(link.href)
                                                        ? "bg-purple-50 text-[#8F51EA] dark:bg-[#3A2A50] dark:text-[#C4A9F7]"
                                                        : "text-[#4D475E] hover:bg-purple-50 hover:text-[#8F51EA] dark:text-[#D5CDE5] dark:hover:bg-[#302341] dark:hover:text-[#C4A9F7]"
                                                        }`}
                                                >
                                                    <Icon size={19} />
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="flex w-full items-center gap-3 rounded-xl border-t border-purple-100 px-4 py-4 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:border-[#49375F] dark:hover:bg-red-950/30"
                                    >
                                        <LogOut size={19} />
                                        {loggingOut ? "Logging out..." : "Logout"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}