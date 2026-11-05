import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StudioDetails from "@/app/studios/StudioDetails";
import { getStudioById, type Studio } from "@/app/lib/api";

// Add this line to fix the blocking prerender error
export const instant = false;

type PageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id } = await params;

    try {
        const studio = await getStudioById(id);
        console.log("Studio Metadata:", studio);

        if (!studio) {
            return { title: "Studio not found" };
        }

        return {
            title: studio.title,
            description:
                studio.description ||
                `${studio.title} – ${studio.category} in ${studio.location}. ${studio.pricePerHour} USD per hour.`,
        };
    } catch {
        return { title: "Studio Details" };
    }
}

export default async function StudioDetailsPage({
    params,
}: PageProps) {
    const { id } = await params;

    let studio: Studio | undefined;

    try {
        studio = await getStudioById(id);
    } catch (error) {
        console.error("Studio details error:", error);

        return (
            <main className="flex min-h-screen items-center justify-center bg-[#FAF7FD] px-4 dark:bg-[#15111F]">
                <div className="max-w-md rounded-2xl border border-[#EFE7FB] bg-white px-8 py-10 text-center shadow-sm dark:border-[#49375F] dark:bg-[#211A30]">
                    <h1 className="text-2xl font-bold text-[#211638] dark:text-white">
                        Unable to load this studio
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#77718B] dark:text-gray-400">
                        The studio API is not responding right now.
                        Make sure the server is running and try again.
                    </p>

                    <Link
                        href="/studios"
                        className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B5CF6]"
                    >
                        Back to studios
                    </Link>
                </div>
            </main>
        );
    }

    if (!studio) {
        notFound();
    }

    return <StudioDetails studio={studio} />;
}