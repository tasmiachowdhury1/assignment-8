import { Suspense } from "react";
import type { Metadata } from "next";
import StudioGrid, { StudioGridSkeleton } from "./StudioGrid";
import SortBySelect from "./SortBySelect";

export const instant = false;

export const metadata: Metadata = {
    title: "Explore Studios",
    description:
        "Browse every available creative workspace with its category, hourly rate, rating and location.",
};

type SearchParams = Promise<{
    category?: string | string[] | undefined;
}>;

function Background() {
    return (
        <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden
        >
            <div className="absolute -left-40 -top-56 h-[460px] w-[460px] rounded-full bg-gradient-to-br from-[#D6C3FA]/70 via-[#E4D5FC]/45 to-transparent dark:from-[#7544B8]/20 dark:via-[#5A367F]/10 dark:to-transparent" />
            <div className="absolute -right-48 -top-40 h-[520px] w-[520px] rounded-full bg-gradient-to-bl from-[#D9C4FB]/65 via-[#EADCFF]/40 to-transparent dark:from-[#8B5CF6]/15 dark:via-[#653A91]/10 dark:to-transparent" />
            <div className="absolute -bottom-56 -left-24 h-[420px] w-[420px] rounded-full bg-[#E6DAFD]/50 dark:bg-[#7544B8]/10" />
            <div className="absolute -bottom-40 right-1/4 h-[360px] w-[360px] rounded-full bg-[#EDE3FE]/60 dark:bg-[#8B5CF6]/10" />
        </div>
    );
}

function PageHeading() {
    return (
        <header className="relative flex flex-col items-center text-center">
            <div className="flex items-center gap-4">
                <span
                    className="h-px w-14 bg-[#D8CCF2] dark:bg-[#49375F] sm:w-24"
                    aria-hidden
                />

                <span className="rounded-full bg-white/80 px-5 py-2 text-sm font-semibold text-[#8F51EA] shadow-sm ring-1 ring-[#E7DBFC] dark:bg-[#211A30]/80 dark:text-[#B990FF] dark:ring-[#49375F]">
                    Discover Your Perfect Space
                </span>

                <span
                    className="h-px w-14 bg-[#D8CCF2] dark:bg-[#49375F] sm:w-24"
                    aria-hidden
                />
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#211D35] dark:text-[#F4EEFF] sm:text-5xl lg:text-[3.5rem]">
                Explore{" "}
                <span className="bg-gradient-to-r from-[#8B5CF6] via-[#C13BE8] to-[#FE53BB] bg-clip-text text-transparent">
                    Studios
                </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#77718B] dark:text-[#B8ADC9] sm:text-lg">
                Discover inspiring creative spaces designed to bring your ideas
                to life. From professional photography studios to fully
                equipped podcast and music rooms, find the perfect space for
                your next project.
            </p>
        </header>
    );
}

export default async function AllStudiosPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;

    const rawCategory = Array.isArray(params.category)
        ? params.category[0]
        : params.category;

    const activeCategory = rawCategory?.trim() || "all";

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#EDE4FE] via-[#F6F1FE] to-[#FBFAFF] dark:from-[#15111F] dark:via-[#191426] dark:to-[#15111F]">
            <Background />

            <div className="relative mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 lg:px-12 lg:pt-16">
                <PageHeading />

                <div className="mt-10 flex justify-end lg:mt-14">
                    <SortBySelect value={activeCategory} />
                </div>

                <div className="mt-6 lg:mt-8">
                    <Suspense fallback={<StudioGridSkeleton />}>
                        <StudioGrid searchParams={searchParams} />
                    </Suspense>
                </div>
            </div>
        </section>
    );
}