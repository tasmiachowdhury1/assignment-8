
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const STUDIO_PHOTO = {
    src: "/images/Neon Create More Studio.png",
    alt: "Purple-lit photo studio with a neon Create More sign, softbox lights and a camera on a tripod",
};

function Background() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            {/* Soft lavender background */}
            <div className="absolute -left-32 -top-44 h-[540px] w-[600px] rounded-[50%] bg-[#E3D2FD] dark:bg-[#302044]" />

            {/* Purple corner blob */}
            <div className="absolute -left-28 -top-40 h-[440px] w-[480px] rounded-[58%_42%_60%_40%/55%_50%_50%_45%] bg-[#C2A0F5]/90 dark:bg-[#573477]/70" />

            {/* White curved background */}
            <div className="absolute -left-48 top-[190px] h-[460px] w-[640px] rounded-[50%] bg-[#FCFAFF] dark:bg-[#1D1729]" />

            {/* Bottom-left tint */}
            <div className="absolute -bottom-36 -left-28 h-[360px] w-[360px] rounded-full bg-[#E9DBFE]/50 blur-sm dark:bg-[#51316D]/30" />

            {/* Soft right-side glow */}
            <div className="absolute -right-40 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#F1DDFB]/40 blur-3xl dark:bg-[#713B91]/15" />
        </div>
    );
}

function Swoosh() {
    return (
        <svg
            className="mt-2 h-7 w-full sm:h-8"
            viewBox="0 0 480 36"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id="heroSwooshGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                >
                    <stop offset="0%" stopColor="#8F51EA" />
                    <stop offset="55%" stopColor="#B14BE9" />
                    <stop offset="100%" stopColor="#FE53BB" />
                </linearGradient>
            </defs>

            <path
                d="M10 14 C90 22 250 26 370 22 C420 20 455 14 477 5 C465 20 430 30 370 33 C250 38 90 34 12 30 C5 27 5 17 10 14 Z"
                fill="url(#heroSwooshGradient)"
            />
        </svg>
    );
}

function AccentMarks({
    className = "",
}: {
    className?: string;
}) {
    return (
        <svg
            className={className}
            viewBox="0 0 76 96"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M14 62 4 42"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
            />

            <path
                d="M44 44 34 10"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
            />

            <path
                d="M70 34 62 6"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function Sparkle({
    className = "",
}: {
    className?: string;
}) {
    return (
        <svg
            className={className}
            viewBox="0 0 48 48"
            aria-hidden="true"
        >
            <path
                d="M24 1c2.4 12.6 10.4 20.6 23 23-12.6 2.4-20.6 10.4-23 23-2.4-12.6-10.4-20.6-23-23C13.6 21.6 21.6 13.6 24 1Z"
                fill="currentColor"
            />
        </svg>
    );
}

function Badge() {
    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-[#EFE4FE] px-4 py-2.5 text-sm font-bold text-[#8F51EA] dark:bg-[#39264F] dark:text-[#D0B5FF] sm:px-5 sm:text-[15px]">
            <Star
                className="h-4 w-4 fill-[#8F51EA] text-[#8F51EA] dark:fill-[#D0B5FF] dark:text-[#D0B5FF]"
                aria-hidden="true"
            />

            About Us
        </span>
    );
}

function Heading() {
    return (
        <div className="relative mt-5 inline-block max-w-full">
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight">
                <span className="block text-[#211D35] dark:text-[#F5F0FF]">
                    Welcome to
                </span>

                <span className="block bg-gradient-to-r from-[#8F51EA] via-[#B14BE9] to-[#FE53BB] bg-clip-text text-transparent">
                    StudioSpace
                </span>
            </h1>

            <Swoosh />

            <AccentMarks className="absolute -right-12 -top-16 hidden h-24 w-16 text-[#8B44EE] dark:text-[#C49AFF] lg:block" />
        </div>
    );
}

function Copy() {
    return (
        <>
            <p className="mt-6 text-lg font-bold leading-[1.4] text-[#211D35] dark:text-[#F5F0FF] sm:text-xl lg:text-[1.375rem]">
                Your Creative Space, Our Passion
            </p>

            <p className="mt-5 text-base leading-7 text-[#454063] dark:text-[#C9BEDC] sm:text-lg">
                At StudioSpace, we believe creativity deserves the
                perfect space. We&rsquo;re here to connect creators,
                artists, and dreamers with exceptional studios
                &mdash; from photo studios and music suites to
                podcast rooms and more.
            </p>

            <p className="mt-4 text-base leading-7 text-[#454063] dark:text-[#C9BEDC] sm:text-lg">
                Our mission is to make studio booking simple,
                reliable, and enjoyable, so you can focus on what
                you do best &mdash; creating.
            </p>

            <Link
                href="/studios"
                className="group mt-7 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#8F51EA] to-[#FE53BB] px-6 py-3.5 text-base font-semibold text-white shadow-[0_16px_32px_-12px_rgba(143,81,234,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(143,81,234,0.8)] sm:px-8 sm:py-4 sm:text-lg"
            >
                Explore Studios

                <ArrowRight
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                />
            </Link>
        </>
    );
}

function StudioImage() {
    return (
        <div className="relative w-full">
            {/* Normal rectangular studio image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_24px_50px_-20px_rgba(76,29,149,0.35)] dark:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.65)] sm:rounded-3xl lg:aspect-[5/4] xl:aspect-[4/3]">
                <Image
                    src={STUDIO_PHOTO.src}
                    alt={STUDIO_PHOTO.alt}
                    fill
                    priority
                    sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, (min-width: 640px) 85vw, calc(100vw - 40px)"
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
            </div>

            {/* Decorative sparkle */}
            <Sparkle className="absolute -right-4 -top-5 hidden h-12 w-12 text-[#8B44EE] dark:text-[#C49AFF] lg:block" />

            {/* Decorative accent */}
            <AccentMarks className="absolute -bottom-8 -left-5 hidden h-20 w-16 text-[#B14BE9] dark:text-[#B98BFA] lg:block" />
        </div>
    );
}

export default function Hero() {
    return (
        <section
            id="about"
            className="relative isolate w-full overflow-hidden bg-gradient-to-br from-[#F7F2FE] via-white to-[#F5EEFE] transition-colors duration-300 dark:from-[#15111F] dark:via-[#1D1729] dark:to-[#21172E]"
        >
            <Background />

            <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-5 py-14 sm:gap-12 sm:px-8 sm:py-20 lg:min-h-[680px] lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-20 xl:gap-16 xl:px-16 2xl:px-20">

                {/* Left side: text content */}
                <div className="relative z-10 mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-[520px]">
                    <Badge />

                    <Heading />

                    <Copy />
                </div>

                {/* Right side: normal image */}
                <div className="relative z-10 mx-auto w-full max-w-[680px] lg:mx-0 lg:max-w-none">
                    <StudioImage />
                </div>

            </div>
        </section>
    );
}
