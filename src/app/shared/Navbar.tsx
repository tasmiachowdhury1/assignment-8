
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import toast from "react-hot-toast";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/#about" },
];

const dashboardLinks = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Add New Studio",
        href: "/dashboard/add-studio",
        icon: PlusCircle,
    },
    {
        name: "My Studio Listings",
        href: "/dashboard/my-studios",
        icon: Building2,
    },
    {
        name: "My Bookings",
        href: "/dashboard/my-bookings",
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

    const user = session?.user;

    // Active route indicator
    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }

        if (href === "/studios") {
            return pathname.startsWith("/studios");
        }

        if (href.startsWith("/#")) {
            return pathname === "/";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    // Close menus
    const closeMenus = () => {
        setMenuOpen(false);
        setProfileOpen(false);
    };

    // Logout with Better Auth
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
        <header className="sticky top-0 z-50 w-full border-b border-purple-400 bg-white/90 backdrop-blur-xl">

            <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5"
                    onClick={closeMenus}
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

                {/* Desktop Navigation */}
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

                {/* Desktop Authentication */}
                <div className="hidden items-center gap-3 lg:flex">

                    {/* Logged Out */}
                    {!isPending && !user && (
                        <>
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
                        </>
                    )}

                    {/* Loading */}
                    {isPending && (
                        <div className="h-11 w-28 animate-pulse rounded-full bg-purple-100" />
                    )}

                    {/* Logged In */}
                    {!isPending && user && (
                        <div className="relative">

                            <button
                                type="button"
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2.5 rounded-full border border-purple-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:bg-purple-50"
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

                                <span className="max-w-[100px] truncate text-sm font-semibold text-[#211D35]">
                                    {user.name || "My Account"}
                                </span>

                                <ChevronDown
                                    size={17}
                                    className={`text-[#8F51EA] transition-transform ${profileOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>


                            {profileOpen && (
                                <div className="absolute right-0 top-[58px] z-50 w-[270px] overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-xl shadow-purple-200/40">


                                    <div className="border-b border-purple-100 bg-purple-50/70 p-4">
                                        <p className="truncate text-sm font-bold text-[#211D35]">
                                            {user.name}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-[#77718B]">
                                            {user.email}
                                        </p>
                                    </div>

                                    {/* Menu Links */}
                                    <div className="p-2">
                                        {dashboardLinks.map((link) => {
                                            const Icon = link.icon;

                                            return (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    onClick={closeMenus}
                                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive(link.href)
                                                        ? "bg-purple-50 text-[#8F51EA]"
                                                        : "text-[#4D475E] hover:bg-purple-50 hover:text-[#8F51EA]"
                                                        }`}
                                                >
                                                    <Icon size={19} />
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-purple-100 p-2">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <LogOut size={19} />
                                            {loggingOut
                                                ? "Logging out..."
                                                : "Logout"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
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

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="border-t border-purple-100 bg-white px-5 py-5 shadow-lg lg:hidden">

                    <div className="flex flex-col gap-2">

                        {/* Navigation Links */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={closeMenus}
                                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive(link.href)
                                    ? "bg-purple-50 text-[#8F51EA]"
                                    : "text-[#77718B] hover:bg-purple-50 hover:text-[#8F51EA]"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="mt-3 border-t border-purple-100 pt-4">

                            {/* Mobile Logged Out */}
                            {!isPending && !user && (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/login"
                                        onClick={closeMenus}
                                        className="rounded-full border border-purple-200 px-5 py-3 text-center text-sm font-semibold text-[#8F51EA]"
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
                                <div className="h-16 animate-pulse rounded-xl bg-purple-50" />
                            )}

                            {/* Mobile Logged In */}
                            {!isPending && user && (
                                <div className="space-y-3">

                                    {/* User Information */}
                                    <div className="flex items-center gap-3 rounded-xl bg-purple-50 p-3">
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
                                            <p className="truncate text-sm font-bold text-[#211D35]">
                                                {user.name}
                                            </p>

                                            <p className="truncate text-xs text-[#77718B]">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Dashboard Links */}
                                    <div className="space-y-1">
                                        {dashboardLinks.map((link) => {
                                            const Icon = link.icon;

                                            return (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    onClick={closeMenus}
                                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive(link.href)
                                                        ? "bg-purple-50 text-[#8F51EA]"
                                                        : "text-[#4D475E] hover:bg-purple-50 hover:text-[#8F51EA]"
                                                        }`}
                                                >
                                                    <Icon size={19} />
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {/* Logout */}
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="flex w-full items-center gap-3 rounded-xl border-t border-purple-100 px-4 py-4 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                    >
                                        <LogOut size={19} />
                                        {loggingOut
                                            ? "Logging out..."
                                            : "Logout"}
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
