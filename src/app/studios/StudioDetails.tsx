
"use client";

import Link from "next/link";
import { useState } from "react";
import {
    ArrowRight,
    Building2,
    Camera,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clapperboard,
    Coffee,
    Clock,
    Lightbulb,
    MapPin,
    Mic,
    Music,
    Package,
    Palette,
    Sofa,
    Sparkles,
    Star,
    Users,
    Volume2,
    Wifi,
    Wind,
} from "lucide-react";

import type { GuestReview, Studio } from "@/app/lib/api";
import { parseJsonField, trimKeys } from "@/app/lib/json";
import BookingCard from "@/components/Booking/BookingCard";

type Host = {
    name: string;
    email?: string;
    photo?: string;
};

type StudioAvailability = {
    openingTime?: string;
    closingTime?: string;
};

type ExtendedStudio = Studio & {
    image?: string;
    overview?: string;
    host?: string | Host | null;
    reviews?: string | GuestReview[];
    guestReviews?: string | GuestReview[];
    amenities?: string | string[];
    gallery?: string | string[];
    availability?: string | StudioAvailability | null;
};

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const currency = (value: number) =>
    value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    });

const formatDate = (value: string) => {
    if (!value) return "";

    const parsed = new Date(
        /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? `${value}T00:00:00`
            : value
    );

    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

function getImageUrl(path?: string | null) {
    if (!path) return "";

    return path.startsWith("http")
        ? path
        : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

function CategoryGlyph({
    category,
    className,
}: {
    category: string;
    className?: string;
}) {
    switch (category?.toLowerCase()) {
        case "photo studio":
            return <Camera className={className} aria-hidden />;

        case "film studio":
            return <Clapperboard className={className} aria-hidden />;

        case "sound stage":
            return <Volume2 className={className} aria-hidden />;

        case "podcast room":
            return <Mic className={className} aria-hidden />;

        case "music suite":
            return <Music className={className} aria-hidden />;

        case "art workshop":
            return <Palette className={className} aria-hidden />;

        default:
            return <Sparkles className={className} aria-hidden />;
    }
}

function AmenityGlyph({
    label,
    className,
}: {
    label: string;
    className?: string;
}) {
    const value = label.toLowerCase();

    if (value.includes("wifi") || value.includes("internet")) {
        return <Wifi className={className} aria-hidden />;
    }

    if (value.includes("light")) {
        return <Lightbulb className={className} aria-hidden />;
    }

    if (
        value.includes("air") ||
        value === "ac" ||
        value.includes("climate")
    ) {
        return <Wind className={className} aria-hidden />;
    }

    if (value.includes("coffee") || value.includes("drink")) {
        return <Coffee className={className} aria-hidden />;
    }

    if (value.includes("mic")) {
        return <Mic className={className} aria-hidden />;
    }

    if (
        value.includes("camera") ||
        value.includes("backdrop") ||
        value.includes("photo") ||
        value.includes("green screen")
    ) {
        return <Camera className={className} aria-hidden />;
    }

    if (
        value.includes("sound") ||
        value.includes("speaker") ||
        value.includes("record") ||
        value.includes("audio")
    ) {
        return <Volume2 className={className} aria-hidden />;
    }

    if (
        value.includes("lounge") ||
        value.includes("seating") ||
        value.includes("comfort") ||
        value.includes("sofa")
    ) {
        return <Sofa className={className} aria-hidden />;
    }

    if (
        value.includes("paint") ||
        value.includes("art") ||
        value.includes("easel")
    ) {
        return <Palette className={className} aria-hidden />;
    }

    if (value.includes("instrument")) {
        return <Music className={className} aria-hidden />;
    }

    if (
        value.includes("storage") ||
        value.includes("space") ||
        value.includes("equipment")
    ) {
        return <Package className={className} aria-hidden />;
    }

    return <CheckCircle2 className={className} aria-hidden />;
}

function RatingStars({
    rating,
    className = "",
}: {
    rating: number;
    className?: string;
}) {
    const filled = Math.max(0, Math.min(5, Math.round(rating)));

    return (
        <span
            className={`inline-flex items-center gap-0.5 ${className}`}
            aria-label={`${rating} out of 5 stars`}
        >
            {Array.from({ length: 5 }, (_, index) => (
                <Star
                    key={index}
                    className={`h-4 w-4 ${index < filled
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-amber-300"
                        }`}
                    aria-hidden
                />
            ))}
        </span>
    );
}

function ReviewerAvatar({ name }: { name: string }) {
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    return (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#EDE4FE] to-[#F6E4F3] text-sm font-bold text-[#8F51EA]">
            {initials || "?"}
        </span>
    );
}

export default function StudioDetails({
    studio,
}: {
    studio: Studio;
}) {
    const rawStudio = trimKeys(studio as ExtendedStudio);

    // Host
    const parsedHost = parseJsonField<Host | null>(
        rawStudio.host,
        null
    );

    const host =
        parsedHost &&
            typeof parsedHost === "object" &&
            typeof parsedHost.name === "string"
            ? parsedHost
            : null;

    // Gallery
    const parsedGallery = parseJsonField<unknown>(
        rawStudio.gallery,
        []
    );

    const gallery: string[] = Array.isArray(parsedGallery)
        ? parsedGallery.filter(
            (item): item is string => typeof item === "string"
        )
        : [];

    // Amenities
    const parsedAmenities = parseJsonField<unknown>(
        rawStudio.amenities,
        []
    );

    const amenities: string[] = Array.isArray(parsedAmenities)
        ? parsedAmenities.filter(
            (item): item is string => typeof item === "string"
        )
        : [];

    // Reviews
    const parsedReviews = parseJsonField<unknown>(
        rawStudio.reviews ?? rawStudio.guestReviews,
        []
    );

    const reviews: GuestReview[] = Array.isArray(parsedReviews)
        ? parsedReviews
        : [];

    const totalReviews =
        Number(rawStudio.totalReviews ?? reviews.length) ||
        reviews.length;

    // Availability
    const parsedAvailability =
        parseJsonField<StudioAvailability | null>(
            rawStudio.availability,
            null
        );

    const availability = parsedAvailability;

    // Images
    const mainImage = getImageUrl(
        rawStudio.image || studio.imageUrl
    );

    const images = [
        mainImage,
        ...gallery.map((image) => getImageUrl(image)),
    ].filter(
        (image, index, list) =>
            Boolean(image) && list.indexOf(image) === index
    );

    // Studio information
    const rating = Number(studio.rating ?? 0);
    const pricePerHour = Number(studio.pricePerHour ?? 0);
    const securityDeposit = Number(
        studio.securityDeposit ?? 0
    );

    const description =
        studio.description ||
        rawStudio.overview ||
        `Discover ${studio.title}, a ${studio.category.toLowerCase()} in ${studio.location}. Book the space for your next creative project.`;

    // UI state
    const [activeImage, setActiveImage] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);

    const activeSrc = images[activeImage] ?? images[0];

    const highlightedAmenities = amenities.slice(0, 3);

    const price = currency(pricePerHour);

    return (
        <main className="min-h-screen bg-[#FAF7FD] text-[#211638]">
            <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-10 lg:py-10">

                {/* Breadcrumb */}
                <nav
                    className="mb-5 flex flex-wrap items-center gap-2 text-sm text-[#8A8499]"
                    aria-label="Breadcrumb"
                >
                    <Link
                        href="/"
                        className="transition hover:text-[#8F51EA]"
                    >
                        Home
                    </Link>

                    <span aria-hidden>/</span>

                    <Link
                        href="/studios"
                        className="transition hover:text-[#8F51EA]"
                    >
                        Explore Studios
                    </Link>

                    <span aria-hidden>/</span>

                    <span className="font-semibold text-[#211638]">
                        {studio.title}
                    </span>
                </nav>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.95fr)_300px] xl:gap-7">

                    {/* Gallery */}
                    <div className="min-w-0">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#EADFFB] to-[#D9C8F7] shadow-[0_20px_45px_-30px_rgba(76,29,149,0.55)]">
                            {activeSrc ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={activeSrc}
                                    alt={`${studio.title} – ${studio.category}`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <CategoryGlyph
                                        category={studio.category}
                                        className="h-20 w-20 text-white/80"
                                    />
                                </div>
                            )}

                            <span className="absolute left-4 top-4 inline-flex max-w-[calc(100%-7rem)] items-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-900/25">
                                <CategoryGlyph
                                    category={studio.category}
                                    className="h-3.5 w-3.5 shrink-0"
                                />
                                <span className="truncate">
                                    {studio.category}
                                </span>
                            </span>

                            <span className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                                {images.length > 0
                                    ? activeImage + 1
                                    : 0}{" "}
                                / {images.length}
                            </span>

                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveImage(
                                                (activeImage -
                                                    1 +
                                                    images.length) %
                                                images.length
                                            )
                                        }
                                        className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white shadow-lg backdrop-blur transition hover:bg-white/40"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft
                                            className="h-6 w-6"
                                            aria-hidden
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveImage(
                                                (activeImage + 1) %
                                                images.length
                                            )
                                        }
                                        className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white shadow-lg backdrop-blur transition hover:bg-white/40"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight
                                            className="h-6 w-6"
                                            aria-hidden
                                        />
                                    </button>
                                </>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="mt-4 grid grid-cols-5 gap-2.5 sm:gap-3">
                                {images.slice(0, 5).map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() =>
                                            setActiveImage(index)
                                        }
                                        aria-label={`Show image ${index + 1}`}
                                        aria-current={
                                            activeImage === index
                                        }
                                        className={`aspect-[4/3] overflow-hidden rounded-xl border-2 bg-[#EDE7FB] transition ${activeImage === index
                                            ? "border-[#8F51EA] shadow-md shadow-purple-200"
                                            : "border-transparent opacity-80 hover:opacity-100"
                                            }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={image}
                                            alt={`${studio.title} gallery ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Studio information */}
                    <div className="min-w-0 xl:py-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#211638] sm:text-4xl">
                            {studio.title}
                        </h1>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Star
                                className="h-5 w-5 fill-[#8F51EA] text-[#8F51EA]"
                                aria-hidden
                            />

                            <span className="text-lg font-bold">
                                {rating.toFixed(1)}
                            </span>

                            <span className="text-sm text-[#77718B]">
                                ({totalReviews} reviews)
                            </span>
                        </div>

                        <p className="mt-4 text-[15px] leading-7 text-[#5B5470]">
                            {description}
                        </p>

                        {/* Quick facts */}
                        <div className="mt-5 flex flex-wrap gap-2.5">
                            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-[#3B3556] shadow-sm ring-1 ring-[#EFE7FB]">
                                <MapPin className="h-4 w-4 shrink-0 text-[#8F51EA]" />
                                {studio.location || "Location on request"}
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-[#3B3556] shadow-sm ring-1 ring-[#EFE7FB]">
                                <Clock className="h-4 w-4 shrink-0 text-[#8F51EA]" />
                                {price} / hr
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-[#3B3556] shadow-sm ring-1 ring-[#EFE7FB]">
                                <Users className="h-4 w-4 shrink-0 text-[#8F51EA]" />
                                {studio.maxCapacity
                                    ? `Up to ${studio.maxCapacity} people`
                                    : "Flexible capacity"}
                            </span>
                        </div>

                        {/* Amenities */}
                        <div className="mt-7">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-[#211638]">
                                <Sparkles className="h-5 w-5 fill-[#8F51EA]/20 text-[#8F51EA]" />
                                Amenities
                            </h2>

                            {amenities.length > 0 ? (
                                <ul className="mt-4 grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-2">
                                    {amenities.map((amenity) => (
                                        <li
                                            key={amenity}
                                            className="flex items-center gap-2.5 text-sm font-medium text-[#4A4360]"
                                        >
                                            <AmenityGlyph
                                                label={amenity}
                                                className="h-[18px] w-[18px] shrink-0 text-[#8F51EA]"
                                            />
                                            {amenity}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-3 text-sm text-[#77718B]">
                                    No amenities have been listed for this
                                    studio yet.
                                </p>
                            )}

                            {studio.securityDeposit !== undefined && (
                                <p className="mt-5 text-sm text-[#77718B]">
                                    Security deposit:{" "}
                                    <span className="font-bold text-[#211638]">
                                        {currency(securityDeposit)}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Booking card: button + host + booking modal */}
                    <BookingCard
                        studio={{
                            ...studio,
                            _id: (studio as Studio & { _id?: string })._id,
                            image: rawStudio.image || studio.imageUrl,
                            pricePerHour,
                            securityDeposit,
                        }}
                        host={host}
                        rating={rating}
                        totalReviews={totalReviews}
                        studioTitle={studio.title}
                        availability={availability}
                        getImageUrl={getImageUrl}
                    />
                </section>

                {/* Reviews + about */}
                <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Reviews */}
                    <div className="rounded-2xl border border-[#EFE7FB] bg-white p-5 shadow-[0_18px_45px_-38px_rgba(76,29,149,0.5)] sm:p-6">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-[#211638]">
                                <Star className="h-5 w-5 fill-[#8F51EA] text-[#8F51EA]" />
                                Reviews ({totalReviews})
                            </h2>

                            {reviews.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAllReviews(
                                            (previous) => !previous
                                        )
                                    }
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8F51EA] hover:underline"
                                >
                                    {showAllReviews
                                        ? "Show less"
                                        : "See all reviews"}

                                    <ArrowRight
                                        className={`h-4 w-4 transition ${showAllReviews
                                            ? "rotate-180"
                                            : ""
                                            }`}
                                        aria-hidden
                                    />
                                </button>
                            )}
                        </div>

                        {reviews.length > 0 ? (
                            <ul className="divide-y divide-[#F3ECFD]">
                                {(showAllReviews
                                    ? reviews
                                    : reviews.slice(0, 2)
                                ).map((review, index) => (
                                    <li
                                        key={`${review.name}-${index}`}
                                        className="flex gap-3 py-4 first:pt-1 last:pb-0"
                                    >
                                        <ReviewerAvatar name={review.name} />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                                                <h3 className="font-bold text-[#211638]">
                                                    {review.name}
                                                </h3>

                                                <span className="text-xs text-[#9A93AE]">
                                                    {formatDate(review.date)}
                                                </span>
                                            </div>

                                            <RatingStars
                                                rating={Number(
                                                    review.rating ?? 0
                                                )}
                                                className="mt-1.5"
                                            />

                                            <p className="mt-2 text-sm leading-6 text-[#5B5470]">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-[#77718B]">
                                No reviews have been written for this studio
                                yet.
                            </p>
                        )}
                    </div>

                    {/* About studio */}
                    <div className="relative overflow-hidden rounded-2xl border border-[#EFE7FB] bg-gradient-to-br from-white via-[#FBF7FF] to-[#F1E4FE] p-5 sm:p-6">
                        <div
                            className="pointer-events-none absolute -bottom-6 -right-2 hidden text-[#8F51EA]/10 sm:block"
                            aria-hidden
                        >
                            <Camera
                                className="h-44 w-44"
                                strokeWidth={1.2}
                            />

                            <Sparkles className="absolute right-3 top-3 h-8 w-8 text-[#EC4899]/20" />
                        </div>

                        <div className="relative">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-[#211638]">
                                <Building2 className="h-5 w-5 text-[#8F51EA]" />
                                About {studio.title}
                            </h2>

                            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#5B5470]">
                                {description}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[#5B5470]">
                                {[studio.category, ...highlightedAmenities]
                                    .filter(Boolean)
                                    .slice(0, 3)
                                    .map((item) => (
                                        <span
                                            key={item}
                                            className="inline-flex items-center gap-1.5"
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-[#8F51EA]" />
                                            {item}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
