"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
    ArrowRight,
    Camera,
    Clapperboard,
    EighthNotes,
    Heart,
    MapPin,
    Mic,
    Palette,
    Sparkles,
    Star,
    Volume2,
} from "lucide-react";
import type { Studio } from "@/lib/api";

function CategoryIcon({
    category,
    className,
}: {
    category: string;
    className?: string;
}) {
    switch (category.toLowerCase()) {
        case "photo studio":
            return <Camera className={className} aria-hidden />;
        case "film studio":
            return <Clapperboard className={className} aria-hidden />;
        case "sound stage":
            return <Volume2 className={className} aria-hidden />;
        case "podcast room":
            return <Mic className={className} aria-hidden />;
        case "music suite":
            return <EighthNotes className={className} aria-hidden />;
        case "art workshop":
            return <Palette className={className} aria-hidden />;
        default:
            return <Sparkles className={className} aria-hidden />;
    }
}

type StudioCardProps = {
    studio: Studio;
};

export default function StudioCard({ studio }: StudioCardProps) {
    const [saved, setSaved] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    const hasReviews =
        typeof studio.reviews === "number" && Number.isFinite(studio.reviews);

    return (
        <article className="group flex flex-col rounded-[22px] bg-white p-3 shadow-[0_18px_45px_-28px_rgba(76,29,149,0.5)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_55px_-24px_rgba(76,29,149,0.55)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-gradient-to-br from-[#EDE5FD] to-[#DCD0F7]">
                {imageFailed ? (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C4B0F5] to-[#8F51EA]">
                        <CategoryIcon
                            category={studio.category}
                            className="h-12 w-12 text-white/80"
                        />
                    </div>
                ) : (
                    <Image
                        src={studio.imageUrl}
                        alt={`${studio.title} – ${studio.category}`}
                        fill
                        sizes="(min-width: 1280px) 430px, (min-width: 768px) 45vw, 92vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                        onError={() => setImageFailed(true)}
                    />
                )}

                <span className="absolute left-3 top-3 inline-flex max-w-[calc(100%-3.5rem)] items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-purple-900/25">
                    <CategoryIcon
                        category={studio.category}
                        className="h-3.5 w-3.5 shrink-0"
                    />
                    <span className="truncate">{studio.category}</span>
                </span>

                <button
                    type="button"
                    aria-pressed={saved}
                    aria-label={
                        saved
                            ? `Remove ${studio.title} from favorites`
                            : `Add ${studio.title} to favorites`
                    }
                    onClick={() => setSaved((prev) => !prev)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#9A93AE] shadow-lg transition hover:text-[#EC4899]"
                >
                    <Heart
                        className={`h-4.5 w-4.5 transition ${saved
                            ? "fill-[#EC4899] text-[#EC4899]"
                            : "fill-transparent"
                            }`}
                        aria-hidden
                    />
                </button>
            </div>

            <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
                <h3 className="text-xl font-bold tracking-tight text-[#211D35]">
                    {studio.title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-[#3B3556]">
                        <Star
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                            aria-hidden
                        />
                        {Number(studio.rating).toFixed(1)}
                        {hasReviews && (
                            <span className="font-medium text-[#8A8499]">
                                ({studio.reviews} reviews)
                            </span>
                        )}
                    </span>

                    <span className="text-lg font-extrabold text-[#7C3AED]">
                        ${studio.pricePerHour}{" "}
                        <span className="text-sm font-semibold text-[#8A8499]">
                            / hr
                        </span>
                    </span>
                </div>

                <p className="mt-2 flex items-start gap-1.5 text-sm text-[#77718B]">
                    <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#8F51EA]"
                        aria-hidden
                    />
                    {studio.location}
                </p>

                <Link
                    href={`/studios/${studio._id}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-purple-300/40 transition duration-300 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B5CF6]"
                >
                    View Details
                    <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
            </div>
        </article>
    );
}
