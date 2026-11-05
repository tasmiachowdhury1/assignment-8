import Link from "next/link";
import type { ReactNode } from "react";
import { LayoutGrid, TriangleAlert } from "lucide-react";
import { getStudios, type Studio } from "@/app/lib/api";
import StudioCard from "./StudioCard";

type SearchParams = Promise<{
    category?: string | string[] | undefined;
}>;

type CategoryGroup = {
    label: string;
    categories: string[];
};

const CATEGORY_GROUPS: Record<string, CategoryGroup> = {
    "photo-studios": {
        label: "Photo Studios",
        categories: ["Photo Studio", "Film Studio"],
    },
    "sound-stages": {
        label: "Sound Stages",
        categories: ["Sound Stage"],
    },
    "podcast-rooms": {
        label: "Podcast Rooms",
        categories: ["Podcast Room"],
    },
    "music-suites": {
        label: "Music Suites",
        categories: ["Music Suite"],
    },
    "art-workshops": {
        label: "Art Workshops",
        categories: ["Art Workshop"],
    },
};

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

function matchesCategory(studio: Studio, slug: string) {
    const group = CATEGORY_GROUPS[slug];

    if (group?.categories.includes(studio.category)) {
        return true;
    }

    return slugify(studio.category) === slug;
}

function CardSkeleton() {
    return (
        <div className="rounded-[22px] border border-transparent bg-white p-3 shadow-[0_18px_45px_-28px_rgba(76,29,149,0.4)] dark:border-[#49375F] dark:bg-[#211A30] dark:shadow-[0_18px_45px_-28px_rgba(0,0,0,0.8)]">
            <div className="aspect-[16/10] animate-pulse rounded-[16px] bg-[#EDE7FB] dark:bg-[#352747]" />

            <div className="space-y-3 px-2 pb-2 pt-4">
                <div className="h-5 w-2/3 animate-pulse rounded-md bg-[#EDE7FB] dark:bg-[#352747]" />
                <div className="h-4 w-1/2 animate-pulse rounded-md bg-[#F3EEFD] dark:bg-[#30243F]" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-[#F3EEFD] dark:bg-[#30243F]" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-[#EDE7FB] dark:bg-[#352747]" />
            </div>
        </div>
    );
}

export function StudioGridSkeleton() {
    return (
        <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="status"
            aria-label="Loading studios"
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
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-[22px] border border-transparent bg-white px-6 py-12 text-center shadow-[0_18px_45px_-28px_rgba(76,29,149,0.5)] transition-colors duration-300 dark:border-[#49375F] dark:bg-[#211A30] dark:shadow-[0_18px_45px_-28px_rgba(0,0,0,0.8)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0E7FE] text-[#8F51EA] dark:bg-[#352747] dark:text-[#B995F8]">
                {icon}
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#211D35] dark:text-white">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#77718B] dark:text-gray-400">
                {description}
            </p>

            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

const GRID_CLASS = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

export default async function StudioGrid({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;

    const rawCategory = Array.isArray(params.category)
        ? params.category[0]
        : params.category;

    const category = rawCategory?.trim() || undefined;

    let studios: Studio[];

    try {
        studios = await getStudios();
    } catch (error) {
        // React aborts in-flight fetches when prerendering finishes; let it
        // keep the Suspense fallback instead of showing an error state.
        if (
            (error as { digest?: string } | null)?.digest ===
            "HANGING_PROMISE_REJECTION"
        ) {
            throw error;
        }

        console.error("Unable to load studios:", error);

        return (
            <StatusCard
                icon={<TriangleAlert className="h-6 w-6" aria-hidden />}
                title="We couldn't load the studios"
                description="The studio API is not responding right now. Make sure the server is running on port 5000 and try again."
                action={
                    <Link
                        href="/studios"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B5CF6]"
                    >
                        Try again
                    </Link>
                }
            />
        );
    }

    const activeCategory = category
        ? CATEGORY_GROUPS[category]
        : undefined;

    const visibleStudios = category
        ? studios.filter((studio) => matchesCategory(studio, category))
        : studios;

    if (visibleStudios.length === 0) {
        return (
            <div className="space-y-6">
                {activeCategory && (
                    <CategoryNotice label={activeCategory.label} count={0} />
                )}

                <StatusCard
                    icon={<LayoutGrid className="h-6 w-6" aria-hidden />}
                    title="No studios found"
                    description={
                        activeCategory
                            ? `There are no ${activeCategory.label} available yet.`
                            : "Studios added from the Add Studio page will show up here."
                    }
                    action={
                        <Link
                            href="/studios"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B5CF6]"
                        >
                            Browse all studios
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {activeCategory && (
                <CategoryNotice
                    label={activeCategory.label}
                    count={visibleStudios.length}
                />
            )}

            <div className={GRID_CLASS}>
                {visibleStudios.map((studio) => (
                    <StudioCard key={studio._id} studio={studio} />
                ))}
            </div>
        </div>
    );
}

function CategoryNotice({
    label,
    count,
}: {
    label: string;
    count: number;
}) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#77718B] dark:text-gray-400">
            <span>
                Showing{" "}
                <strong className="font-bold text-[#211D35] dark:text-white">
                    {count > 0 ? count : "no"}
                </strong>{" "}
                {label}
            </span>

            <Link
                href="/studios"
                className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#8F51EA] shadow-sm transition hover:bg-[#F0E7FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B5CF6] dark:border dark:border-[#49375F] dark:bg-[#211A30] dark:text-[#B995F8] dark:hover:bg-[#352747]"
            >
                Show all studios
            </Link>
        </div>
    );
}