import Image from "next/image";
import {
    CalendarDays,
    CircleCheckBig,
    Clock,
    Search,
    Sparkles,
    Star,
} from "lucide-react";

const BADGE_TEXT = "Simple & Hassle-Free";

const SUBTITLE =
    "Find and book your perfect studio in just a few simple steps.";

const STEPS = [
    {
        step: "Step 1",
        title: "Discover Spaces",
        description: "Explore a variety of creative spaces near you.",
        icon: Search,
        image: {
            src: "/images/Discover Spaces.png",
            alt: "Creative studio desk with laptop and plants",
            width: 344,
            height: 168,
        },
    },
    {
        step: "Step 2",
        title: "Select Shoot Hours",
        description: "Choose the time slots that fit your schedule.",
        icon: Clock,
        image: {
            src: "/images/hour.png",
            alt: "Calendar with time slots highlighted for booking",
            width: 345,
            height: 168,
        },
    },
    {
        step: "Step 3",
        title: "Book Instantly",
        description: "Confirm your booking and get ready to create.",
        icon: CalendarDays,
        image: {
            src: "/images/booking.png",
            alt: "Phone showing a booking confirmation beside a desk calendar",
            width: 345,
            height: 168,
        },
    },
    {
        step: "Step 4",
        title: "Create & Produce",
        description: "Step into your creative space and bring your ideas to life.",
        icon: CircleCheckBig,
        image: {
            src: "/images/Create & Enjoy.png",
            alt: "Photo studio with lighting and backdrop",
            width: 346,
            height: 168,
        },
    },
] as const;

// Background
function Background() {
    return (
        <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden
        >
            <div className="absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#D6C3FA]/70 via-[#E4D5FC]/50 to-transparent dark:from-[#6B45A0]/20 dark:via-[#49316C]/15" />

            <div className="absolute -left-10 -top-24 h-[260px] w-[260px] rounded-full bg-[#CDB2F7]/40 dark:bg-[#8056B5]/10" />

            <div className="absolute -right-40 top-1/4 h-[460px] w-[460px] rounded-full bg-gradient-to-bl from-[#D9C4FB]/60 via-[#EADCFF]/40 to-transparent dark:from-[#704A9D]/20 dark:via-[#49316C]/10" />

            <div className="absolute -bottom-48 -right-24 h-[380px] w-[380px] rounded-full bg-[#D6BEF9]/40 dark:bg-[#8056B5]/10" />
        </div>
    );
}

// Badge
function Badge() {
    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F0E8FF] px-5 py-2 text-sm font-semibold text-[#8F51EA] dark:bg-[#302341] dark:text-[#C4A9F7]">
            <Star
                className="h-4 w-4 fill-[#8F51EA] text-[#8F51EA] dark:fill-[#C4A9F7] dark:text-[#C4A9F7]"
                aria-hidden
            />
            {BADGE_TEXT}
        </span>
    );
}

// Heading decorations
function AccentMarks() {
    return (
        <svg
            className="absolute -left-12 top-1/2 hidden h-9 w-10 -translate-y-1/2 text-[#8F51EA] dark:text-[#C4A9F7] sm:block"
            viewBox="0 0 56 48"
            fill="none"
            aria-hidden
        >
            <path
                d="M14 40 L 4 28"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <path
                d="M34 34 L 30 18"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <path
                d="M52 38 L 58 26"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function Sparkle() {
    return (
        <Sparkles
            className="absolute -right-10 -top-8 hidden h-10 w-10 text-[#A26BF5] dark:text-[#C4A9F7] lg:block"
            aria-hidden
        />
    );
}

// Heading
function Heading() {
    return (
        <div className="relative inline-block">
            <h2 className="text-4xl font-extrabold tracking-tight text-[#211D35] dark:text-[#F5F0FF] sm:text-5xl">
                How It{" "}
                <span className="bg-gradient-to-r from-[#A26BF5] to-[#FE53BB] bg-clip-text text-transparent">
                    Works
                </span>
            </h2>

            <AccentMarks />
            <Sparkle />
        </div>
    );
}

type Step = (typeof STEPS)[number];

function StepCard({ step }: { step: Step }) {
    const Icon = step.icon;

    return (
        <article className="flex min-w-0 flex-col items-center rounded-[28px] bg-white/90 p-6 text-center shadow-[0_18px_40px_-18px_rgba(143,81,234,0.35)] backdrop-blur-sm transition-colors duration-300 dark:bg-[#211A30]/90 dark:shadow-black/30 sm:p-7 lg:self-stretch">
            <div className="mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-[22px] bg-gradient-to-br from-[#EDE2FE] to-[#F6F0FF] dark:from-[#49316C] dark:to-[#302341]">
                <Icon
                    className="h-8 w-8 text-[#8F51EA] dark:text-[#C4A9F7]"
                    strokeWidth={2.25}
                    aria-hidden
                />
            </div>

            <span className="mb-3 inline-block rounded-full bg-[#d2bef9] px-4 py-1.5 text-sm font-bold text-[#8F51EA] dark:bg-[#49316C] dark:text-[#E2D2FF]">
                {step.step}
            </span>

            <h3 className="mb-2 text-xl font-bold text-[#211D35] dark:text-[#F5F0FF] sm:text-2xl">
                {step.title}
            </h3>

            <p className="mb-6 text-[15px] leading-6 text-[#77718B] dark:text-[#B6AFC7]">
                {step.description}
            </p>

            <div className="mt-auto w-full overflow-hidden rounded-2xl">
                <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    width={step.image.width}
                    height={step.image.height}
                    className="h-auto w-full object-cover"
                />
            </div>
        </article>
    );
}

function ArrowIcon() {
    return (
        <svg
            className="hidden h-8 w-8 shrink-0 text-[#8F51EA] dark:text-[#C4A9F7] lg:block"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}

export default function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="relative w-full overflow-hidden bg-gradient-to-b from-[#F9F6FF] to-[#F2ECFE] transition-colors duration-300 dark:from-[#15111F] dark:to-[#1C1629]"
        >
            <Background />

            <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">

                <div className="flex flex-col items-center text-center">
                    <Badge />

                    <div className="mt-6">
                        <Heading />
                    </div>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-[#77718B] dark:text-[#B6AFC7] sm:text-lg">
                        {SUBTITLE}
                    </p>
                </div>

                <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center lg:gap-4">
                    {STEPS.map((step, index) => (
                        <div key={step.step} className="contents">
                            <StepCard step={step} />

                            {index < STEPS.length - 1 && <ArrowIcon />}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}