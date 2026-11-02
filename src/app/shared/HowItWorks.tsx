import Image from "next/image";
import { CalendarDays, CircleCheckBig, Clock, Search } from "lucide-react";

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

function Background() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -left-48 -top-40 h-[460px] w-[460px] rounded-full bg-gradient-to-br from-[#D6BEF9] via-[#E4D5FC] to-transparent opacity-80 blur-[40px]" />
            <div className="absolute -left-24 -top-24 h-[300px] w-[300px] rounded-full bg-[#CDB2F7]/50 blur-[60px]" />
            <div className="absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-[#D9C4FB] via-[#EADCFF] to-transparent opacity-80 blur-[40px]" />
            <div className="absolute -bottom-40 -left-32 h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-[#D6BEF9] to-transparent opacity-70 blur-[40px]" />

            <svg
                className="absolute bottom-6 right-8 h-40 w-64 text-[#8F51EA]"
                viewBox="0 0 260 150"
                fill="none"
            >
                <path
                    d="M4 140 C 60 96, 118 92, 148 108 C 168 119, 160 140, 143 140 C 126 140, 122 120, 146 104 C 174 85, 214 82, 256 20"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}

function Badge() {
    return (
        <span className="inline-block rounded-full bg-[#F0E8FF] px-5 py-2 text-sm font-semibold text-[#8F51EA]">
            {BADGE_TEXT}
        </span>
    );
}

function Heading() {
    return (
        <div className="relative inline-block">
            <h2 className="text-4xl font-extrabold tracking-tight text-[#211D35] sm:text-5xl lg:text-6xl">
                How It <span className="bg-gradient-to-r from-[#A26BF5] to-[#7C3EE8] bg-clip-text text-transparent">Works</span>
            </h2>

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

function ArrowIcon() {
    return (
        <svg
            className="hidden h-8 w-8 shrink-0 text-[#8F51EA] lg:block"
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

type Step = (typeof STEPS)[number];

function StepCard({ step }: { step: Step }) {
    const Icon = step.icon;

    return (
        <article className="flex min-w-0 flex-col items-center rounded-[28px] bg-white/90 p-6 text-center shadow-[0_18px_40px_-18px_rgba(143,81,234,0.35)] backdrop-blur-sm sm:p-7 lg:self-stretch">
            <div className="mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-[22px] bg-gradient-to-br from-[#EDE2FE] to-[#F6F0FF]">
                <Icon className="h-8 w-8 text-[#8F51EA]" strokeWidth={2.25} aria-hidden />
            </div>

            <span className="mb-3 inline-block rounded-full bg-[#d2bef9] px-4 py-1.5 text-sm font-bold text-[#8F51EA]">
                {step.step}
            </span>

            <h3 className="mb-2 text-xl font-bold text-[#211D35] sm:text-2xl">
                {step.title}
            </h3>

            <p className="mb-6 text-[15px] leading-6 text-[#77718B]">
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

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative w-full overflow-hidden bg-[#F6F2FD]">
            <Background />

            <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
                <div className="flex flex-col items-center text-center">
                    <Badge />

                    <div className="mt-5">
                        <Heading />
                    </div>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-[#77718B] sm:text-lg">
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
