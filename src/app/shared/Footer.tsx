"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Aperture,
    Camera,
    ChevronRight,
    Clapperboard,
    Mail,
    Mic,
    Palette,
    Video,
} from "lucide-react";

const QUICK_LINKS = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/#about" },
    { name: "Contact", href: "/#contact" },
    { name: "FAQ", href: "/#faq" },
] as const;

const CATEGORIES = [
    { name: "Photography", icon: Camera },
    { name: "Video Production", icon: Video },
    { name: "Podcast", icon: Mic },
    { name: "Design & Creative", icon: Palette },
    { name: "Film Studio", icon: Clapperboard },
] as const;

const TAGLINE = ["CREATE", "CAPTURE", "INSPIRE"] as const;

function XIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[17px] w-[17px]" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-8.481Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
        </svg>
    );
}

function YoutubeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-[19px] w-[19px]"
            aria-hidden
        >
            <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
            <circle cx="12" cy="12" r="4.25" />
            <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" />
        </svg>
    );
}

function LinkedinIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z" />
        </svg>
    );
}

const SOCIALS = [
    { name: "X", href: "https://x.com", icon: XIcon },
    { name: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
    { name: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
    { name: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
] as const;

function Background() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            {/* Decorative circles above the top divider */}
            <div className="absolute -left-16 -top-24 h-[260px] w-[260px] rounded-full bg-[#A78BF3]/40" />
            <div className="absolute left-24 -top-28 h-[240px] w-[240px] rounded-full bg-[#C4A9F7]/30" />
            <div className="absolute left-[330px] -top-24 h-[190px] w-[190px] rounded-full bg-[#D8C8FB]/30" />

            {/* Soft waves at the bottom right */}
            <svg
                className="absolute bottom-0 right-0 h-[260px] w-[720px]"
                viewBox="0 0 720 260"
                fill="none"
                preserveAspectRatio="none"
            >
                <path
                    d="M720 44 C 620 30, 520 104, 400 148 C 296 186, 168 212, 0 260 L 720 260 Z"
                    fill="#D3BCF9"
                    fillOpacity="0.4"
                />
                <path
                    d="M720 128 C 646 118, 548 164, 448 196 C 360 224, 252 240, 148 260 L 720 260 Z"
                    fill="#C6A9F7"
                    fillOpacity="0.45"
                />
            </svg>
        </div>
    );
}

function BrandColumn() {
    return (
        <div>
            <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8F51EA] to-[#FE53BB] text-white shadow-lg shadow-purple-200">
                    <Aperture size={30} strokeWidth={2.2} />
                </div>

                <span className="text-[26px] font-bold tracking-tight text-[#211D35] sm:text-[28px]">
                    Studio<span className="text-[#8F51EA]">Space</span>
                </span>
            </div>

            <p className="mt-5 max-w-[330px] text-[15px] leading-6 text-[#77718B]">
                Discover, book, and experience the perfect studio for your next creative
                project.
            </p>

            <div className="mt-6 flex gap-3">
                {SOCIALS.map((social) => {
                    const Icon = social.icon;

                    return (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={social.name}
                            className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#EFE9FC] text-[#211D35] transition hover:bg-[#E4D8FC] hover:text-[#8F51EA]"
                        >
                            <Icon />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

function QuickLinksColumn() {
    return (
        <nav aria-label="Quick links">
            <h3 className="text-xl font-bold tracking-tight text-[#211D35]">Quick Links</h3>

            <ul className="mt-5 space-y-4">
                {QUICK_LINKS.map((link) => (
                    <li key={link.name}>
                        <Link
                            href={link.href}
                            className="group inline-flex items-center gap-3.5 text-[15px] text-[#3F3A52] transition-colors hover:text-[#8F51EA]"
                        >
                            <ChevronRight
                                size={18}
                                strokeWidth={3}
                                className="shrink-0 text-[#8F51EA]"
                                aria-hidden
                            />
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

function CategoriesColumn() {
    return (
        <nav aria-label="Popular categories">
            <h3 className="text-xl font-bold tracking-tight text-[#211D35]">
                Popular Categories
            </h3>

            <ul className="mt-5 space-y-5">
                {CATEGORIES.map((category) => {
                    const Icon = category.icon;

                    return (
                        <li key={category.name}>
                            <Link
                                href="/studios"
                                className="group inline-flex items-center gap-4 text-[15px] text-[#3F3A52] transition-colors hover:text-[#8F51EA]"
                            >
                                <Icon
                                    size={24}
                                    strokeWidth={2}
                                    className="shrink-0 text-[#8F51EA]"
                                    aria-hidden
                                />
                                {category.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

function NewsletterColumn() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!email.trim()) return;
        setSubscribed(true);
        setEmail("");
    }

    return (
        <div>
            <h3 className="text-xl font-bold tracking-tight text-[#211D35]">
                Join Our Newsletter
            </h3>

            <p className="mt-3 max-w-[260px] text-sm leading-6 text-[#77718B]">
                Get the latest studio updates, deals and inspiration.
            </p>

            <form onSubmit={handleSubmit} className="relative mt-5 max-w-[380px]">
                <label htmlFor="footer-email" className="sr-only">
                    Email address
                </label>

                <Mail
                    size={20}
                    className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#9A93B0]"
                    aria-hidden
                />

                <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        setSubscribed(false);
                    }}
                    placeholder="Enter your email"
                    required
                    className="h-14 w-full rounded-full border border-[#E8DDF7] bg-white pl-14 pr-[130px] text-sm text-[#211D35] shadow-[0_8px_24px_-16px_rgba(143,81,234,0.4)] outline-none transition placeholder:text-[#9A93B0] focus:border-[#8F51EA] focus:ring-2 focus:ring-[#8F51EA]/20"
                />

                <button
                    type="submit"
                    className="absolute -right-1 top-1/2 h-16 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#8F51EA] to-[#FE53BB] px-7 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(143,81,234,0.8)] transition hover:brightness-105"
                >
                    Subscribe
                </button>
            </form>

            <p
                aria-live="polite"
                className={`mt-3 text-sm font-medium text-[#8F51EA] transition-opacity ${subscribed ? "opacity-100" : "opacity-0"}`}
            >
                Thanks for subscribing!
            </p>
        </div>
    );
}

function BottomBar() {
    return (
        <div className="flex flex-col items-center gap-5 py-8 sm:flex-row sm:justify-between sm:gap-6">
            <p className="text-center text-sm text-[#77718B] sm:text-left">
                © 2026{" "}
                <span className="font-bold text-[#8F51EA]">StudioSpace</span>. All rights
                reserved.
                <span className="mx-3 text-[#C9BEDF]">|</span>
                <Link href="/terms" className="transition-colors hover:text-[#8F51EA]">
                    Terms &amp; Conditions
                </Link>
                <span className="mx-3 text-[#C9BEDF]">|</span>
                <Link href="/privacy" className="transition-colors hover:text-[#8F51EA]">
                    Privacy Policy
                </Link>
            </p>

            <p className="flex items-center gap-3 text-xs font-extrabold tracking-[0.18em] text-[#211D35]">
                {TAGLINE.map((word, index) => (
                    <span key={word} className="flex items-center gap-3">
                        {index > 0 && (
                            <span
                                className="h-1.5 w-1.5 rounded-full bg-[#8F51EA]"
                                aria-hidden
                            />
                        )}
                        {word}
                    </span>
                ))}
            </p>
        </div>
    );
}

export default function Footer() {
    return (
        <footer className="relative w-full overflow-hidden bg-[#F7F3FD]">
            <Background />

            {/* Decorative band above the full-bleed divider */}
            <div className="relative h-[92px]" />
            <div className="relative h-px w-full bg-[#E4DAF6]" />

            <div className="relative mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12">
                <div className="grid gap-10 pb-10 pt-14 sm:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1.18fr_1.3fr] lg:gap-8 xl:gap-14">
                    <BrandColumn />
                    <QuickLinksColumn />
                    <CategoriesColumn />
                    <NewsletterColumn />
                </div>

                <div className="h-px w-full bg-[#E4DAF6]" />

                <BottomBar />
            </div>
        </footer>
    );
}
