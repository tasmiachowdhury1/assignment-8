import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ArrowRight, Sparkles, Star, TriangleAlert } from "lucide-react";
import { type Studio } from "@/app/lib/api";
import { getFeaturedStudios } from "@/app/lib/db";
import StudioCard from "@/app/studios/StudioCard";

function Background() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#D6C3FA]/70 via-[#E4D5FC]/50 to-transparent dark:from-[#6B45A0]/20 dark:via-[#49316C]/15" />
            <div className="absolute -left-10 -top-24 h-[260px] w-[260px] rounded-full bg-[#CDB2F7]/40 dark:bg-[#8056B5]/10" />
            <div className="absolute -right-40 top-1/4 h-[460px] w-[460px] rounded-full bg-gradient-to-bl from-[#D9C4FB]/60 via-[#EADCFF]/40 to-transparent dark:from-[#704A9D]/20 dark:via-[#49316C]/10" />
            <div className="absolute -bottom-48 -right-24 h-[380px] w-[380px] rounded-full bg-[#D6BEF9]/40 dark:bg-[#8056B5]/10" />
        </div>
    );
}

function AccentMarks() {
    return (
        <svg
            className="absolute -left-12 top-1/2 hidden h-9 w-10 -translate-y-1/2 text-[#8F51EA] dark:text-[#C4A9F7] sm:block"
            viewBox="0 0 56 48"
            fill="none"
            aria-hidden
        >
            <path d="M14 40 L 4 28" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M34 34 L 30 18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M52 38 L 58 26" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
    );
}

function Sparkle() {
    return (
        <Sparkles
            className="absolute -right-10 -top-8 hidden h-10 w-10 text-[#A26BF5] dark:text-[#D0B5FF] lg:block"
            aria-hidden
        />
    );
}

function SectionHeading() {
    return (
        <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F0E8FF] px-5 py-2 text-sm font-semibold text-[#8F51EA] dark:bg-[#302341] dark:text-[#C4A9F7]">
                <Star className="h-4 w-4 fill-[#8F51EA] text-[#8F51EA] dark:fill-[#C4A9F7] dark:text-[#C4A9F7]" aria-hidden />
                Featured Studios
            </span>

            <div className="relative mt-6 inline-block">
                <h2 className="text-4xl font-extrabold tracking-tight text-[#211D35] dark:text-[#F5F0FF] sm:text-5xl">
                    Featured{" "}
                    <span className="bg-gradient-to-r from-[#A26BF5] to-[#FE53BB] bg-clip-text text-transparent">
                        Studios
                    </span>
                </h2>
                <AccentMarks />
                <Sparkle />
            </div>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#77718B] dark:text-[#B6AFC7] sm:text-lg">
                Discover our top-rated studio spaces, perfect for your next
                creative project.
            </p>
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="rounded-[22px] bg-white p-3 shadow-[0_18px_45px_-28px_rgba(76,29,149,0.4)] dark:bg-[#211A30] dark:shadow-black/20">
            <div className="aspect-[16/10] animate-pulse rounded-[16px] bg-[#EDE7FB] dark:bg-[#352844]" />
            <div className="space-y-3 px-2 pb-2 pt-4">
                <div className="h-5 w-2/3 animate-pulse rounded-md bg-[#EDE7FB] dark:bg-[#352844]" />
                <div className="h-4 w-1/2 animate-pulse rounded-md bg-[#F3EEFD] dark:bg-[#302341]" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-[#F3EEFD] dark:bg-[#302341]" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-[#EDE7FB] dark:bg-[#352844]" />
            </div>
        </div>
    );
}

function FeaturedStudiosSkeleton() {
    return (
        <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="status"
            aria-label="Loading featured studios"
        >
            {Array.from({ length: 6 }, (_, index) => (
                <CardSkeleton key={index} />
            ))}
        </div>
    );
}

function StatusCard({
    icon,
    title,
    description,
    action,
}: {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-[22px] bg-white px-6 py-12 text-center shadow-[0_18px_45px_-28px_rgba(76,29,149,0.5)] dark:bg-[#211A30] dark:shadow-black/30">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0E7FE] text-[#8F51EA] dark:bg-[#3A2A50] dark:text-[#C4A9F7]">
                {icon}
            </div>

            <h3 className="mt-4 text-xl font-bold text-[#211D35] dark:text-[#F5F0FF]">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#77718B] dark:text-[#B6AFC7]">
                {description}
            </p>

            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

const GRID_CLASS = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

async function FeaturedStudiosGrid() {
    let studios: Studio[];

    try {
        studios = await getFeaturedStudios(6);
    } catch (error) {
        // React aborts in-flight data reads when prerendering finishes; let it
        // keep the Suspense fallback instead of showing an error state.
        if (
            (error as { digest?: string } | null)?.digest ===
            "HANGING_PROMISE_REJECTION"
        ) {
            throw error;
        }

        console.error("Unable to load featured studios:", error);

        return (
            <StatusCard
                icon={<TriangleAlert className="h-6 w-6" aria-hidden />}
                title="We couldn't load the featured studios"
                description="MongoDB is not responding right now. Check the connection string and try again."
                action={
                    <Link
                        href="/studios"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
                    >
                        Browse all studios
                    </Link>
                }
            />
        );
    }

    if (studios.length === 0) {
        return (
            <StatusCard
                icon={<Sparkles className="h-6 w-6" aria-hidden />}
                title="No studios featured yet"
                description="Studios added from the Add Studio page will show up here."
                action={
                    <Link
                        href="/studios"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
                    >
                        Browse all studios
                    </Link>
                }
            />
        );
    }

    return (
        <div className={GRID_CLASS}>
            {studios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
            ))}
        </div>
    );
}

export default function FeaturedStudios() {
    return (
        <section
            id="featured-studios"
            className="relative w-full overflow-hidden bg-gradient-to-b from-[#F9F6FF] to-[#F2ECFE] transition-colors duration-300 dark:from-[#15111F] dark:to-[#1C1629]"
        >
            <Background />

            <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
                <SectionHeading />

                <div className="mt-12 lg:mt-16">
                    <Suspense fallback={<FeaturedStudiosSkeleton />}>
                        <FeaturedStudiosGrid />
                    </Suspense>
                </div>

                <div className="mt-10 flex justify-center">
                    <Link
                        href="/studios"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-[#8F51EA] bg-white px-7 py-3 text-sm font-semibold text-[#8F51EA] shadow-sm transition duration-300 hover:bg-[#F0E8FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8F51EA] dark:border-[#A875F5] dark:bg-[#211A30] dark:text-[#C4A9F7] dark:hover:bg-[#302341]"
                    >
                        Explore All Studios
                        <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}