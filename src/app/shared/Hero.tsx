import Image from "next/image";
import Link from "next/link";
const BADGE_TEXT = "Your Creative Space Starts Here";

const DESCRIPTION =
    "Discover, book, and create in inspiring spaces " +
    "around you. Find the perfect studio for your " +
    "next creative project.";

const CTAS = [
    {
        href: "/studios",
        label: "Explore Studios",
        variant: "primary" as const,
    },
    {
        href: "/#how-it-works",
        label: "How It Works",
        variant: "secondary" as const,
    },
];

const HERO_IMAGE = {
    src: "/images/hero.png",
    alt: "Creative workspace at StudioSpace",
    width: 1648,
    height: 928,
} as const;

function Background() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -left-48 -top-40 h-[460px] w-[460px] rounded-full bg-gradient-to-br from-[#D6BEF9] via-[#E4D5FC] to-transparent opacity-80 blur-[40px]" />
            <div className="absolute -right-40 top-1/4 h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-[#D9C4FB] via-[#EADCFF] to-transparent opacity-80 blur-[40px]" />
            <div className="absolute -bottom-48 left-1/3 h-[380px] w-[380px] rounded-full bg-gradient-to-tr from-[#E9D9FF] to-transparent opacity-70 blur-[40px]" />
        </div>
    );
}

function Badge() {
    return (
        <span className="inline-block rounded-full bg-[#d2bef9] px-5 py-2 text-sm font-semibold text-[#8F51EA]">
            {BADGE_TEXT}
        </span>
    );
}

function Heading() {
    return (
        <div className="relative inline-block">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[#211D35] sm:text-5xl lg:text-6xl">
                Find Your
                <span className="block bg-gradient-to-r from-[#A26BF5] to-[#7C3EE8] bg-clip-text text-transparent">
                    Perfect Studio
                </span>
            </h1>

            <svg
                className="absolute -right-12 -top-6 h-10 w-12 text-[#8F51EA] sm:-right-16 sm:h-12 sm:w-14"
                viewBox="0 0 56 48"
                fill="none"
                aria-hidden
            >
                <path d="M10 22 L 2 12" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <path d="M28 14 L 24 2" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <path d="M44 18 L 52 8" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
        </div>
    );
}

function Description() {
    return (
        <p className="max-w-lg text-base leading-7 text-[#77718B] sm:text-lg">
            {DESCRIPTION}
        </p>
    );
}

function CallToActions() {
    return (
        <div className="flex flex-wrap gap-4">
            {CTAS.map((cta) =>
                cta.variant === "primary" ? (
                    <Link
                        key={cta.href}
                        href={cta.href}
                        className="space-btn text-sm font-semibold text-white"
                    >
                        {cta.label}
                    </Link>
                ) : (
                    <Link
                        key={cta.href}
                        href={cta.href}
                        className="inline-flex h-[42px] items-center justify-center rounded-full border border-[#8F51EA] px-7 text-sm font-semibold text-[#8F51EA] transition hover:bg-[#F0E8FF]"
                    >
                        {cta.label}
                    </Link>
                )
            )}
        </div>
    );
}

function HeroImage() {
    return (
        <div className="relative">
            {/* Blob behind the image */}
            <div
                aria-hidden
                className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-[#D6BEF9] via-[#EADCFF] to-transparent opacity-80 blur-2xl"
            />

            <div className="relative overflow-hidden rounded-[28px] bg-white/90 p-2.5 shadow-[0_18px_40px_-18px_rgba(143,81,234,0.35)] backdrop-blur-sm">
                <Image
                    src={HERO_IMAGE.src}
                    alt={HERO_IMAGE.alt}
                    width={HERO_IMAGE.width}
                    height={HERO_IMAGE.height}
                    priority
                    className="h-auto w-full rounded-[20px] object-cover"
                />
            </div>

            {/* Sparkle marks */}
            <svg
                className="absolute -left-5 -top-5 h-10 w-10 text-[#8F51EA]"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden
            >
                <path
                    d="M20 4 L22.5 17.5 L36 20 L22.5 22.5 L20 36 L17.5 22.5 L4 20 L17.5 17.5 Z"
                    fill="currentColor"
                />
            </svg>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export default function Hero() {
    return (
        <section className="relative w-full overflow-hidden bg-[#F6F2FD]">
            <Background />

            <div className="relative mx-auto grid max-w-[1500px] items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:px-12 lg:py-24">
                {/* Left Content */}
                <div className="flex flex-col items-start gap-6">
                    <Badge />
                    <Heading />
                    <Description />
                    <CallToActions />
                </div>

                {/* Right Image */}
                <HeroImage />
            </div>
        </section>
    );
}
