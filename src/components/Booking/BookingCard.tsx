"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    CalendarDays,
    CheckCircle2,
    Clock,
    Star,
    X,
} from "lucide-react";

type Host = {
    name: string;
    photo?: string | null;
    email?: string | null;
};

type Availability = {
    openingTime?: string | null;
    closingTime?: string | null;
};

type Booking = {
    date: string;
    time: string;
    duration: string;
    name: string;
    email: string;
};

type BookingCardProps = {
    host?: Host | null;
    rating?: number;
    totalReviews?: number;
    studioTitle?: string;
    availability?: Availability | null;
    getImageUrl?: (path: string) => string;
    studio: {
        _id?: string;
        id?: string;
        title: string;
        category?: string;
        location?: string;
        image?: string | null;
        imageUrl?: string;
        images?: string[];
        price?: number;
        hourlyRate?: number;
        pricePerHour?: number;
        securityDeposit?: number;
    };
};

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const getToday = () => {
    const today = new Date();

    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");
};

const inputClass =
    "mt-2 w-full rounded-xl border border-[#E7DBFC] bg-white p-3 text-[#211638] outline-none transition placeholder:text-gray-400 focus:border-[#8F51EA] focus:ring-2 focus:ring-[#F0E7FE] dark:border-[#49375F] dark:bg-[#15111f] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-[#a875f5] dark:focus:ring-purple-900/40";

const labelClass =
    "block text-sm font-semibold text-[#211638] dark:text-gray-200";

export default function BookingCard({
    host,
    rating = 0,
    totalReviews = 0,
    studioTitle,
    availability,
    getImageUrl = (path) => path,
    studio,
}: BookingCardProps) {
    const [showBooking, setShowBooking] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [booking, setBooking] = useState<Booking>({
        date: "",
        time: "",
        duration: "1",
        name: "",
        email: "",
    });

    const price = Number(
        studio.pricePerHour ??
        studio.price ??
        studio.hourlyRate ??
        0
    );

    const securityDeposit = Number(studio.securityDeposit ?? 0);

    const image = studio.image || studio.imageUrl || studio.images?.[0];

    const mainImage = image ? getImageUrl(image) : null;

    const total = price * Number(booking.duration);

    const currency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);

    const formatDate = (date: string) =>
        new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
        }).format(new Date(`${date}T00:00:00`));

    const closeBooking = () => {
        if (isSubmitting) return;

        setShowBooking(false);
        setBookingConfirmed(false);
        setBookingError("");
    };

    const updateBooking = (field: keyof Booking, value: string) => {
        setBooking((current) => ({
            ...current,
            [field]: value,
        }));

        setBookingError("");
    };

    const confirmBooking = async () => {
        if (!booking.date || !booking.time) {
            setBookingError("Please select a date and start time.");
            return;
        }

        if (booking.date < getToday()) {
            setBookingError("Please select today or a future date.");
            return;
        }

        if (!booking.name.trim() || !booking.email.trim()) {
            setBookingError("Please enter your name and email.");
            return;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                booking.email.trim()
            )
        ) {
            setBookingError("Please enter a valid email address.");
            return;
        }

        const studioId = studio._id || studio.id;

        if (!studioId) {
            setBookingError("Studio ID is missing. Please refresh the page.");
            return;
        }

        try {
            setIsSubmitting(true);
            setBookingError("");

            const duration = Number(booking.duration);

            const response = await fetch(`${API_URL}/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studioId: String(studioId),
                    title: studio.title,
                    image: image || "",
                    category: studio.category || "",
                    location: studio.location || "",
                    userName: booking.name.trim(),
                    userEmail: booking.email.trim().toLowerCase(),
                    date: booking.date,
                    time: booking.time,
                    duration,
                    pricePerHour: price,
                    totalPrice: price * duration,
                    status: "Pending",
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Could not save your booking."
                );
            }

            setBookingConfirmed(true);
        } catch (error) {
            console.error("Booking error:", error);

            setBookingError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {/* BOOKING BUTTON AND HOST DETAILS */}
            <aside className="space-y-5">
                <button
                    type="button"
                    onClick={() => {
                        setBookingConfirmed(false);
                        setBookingError("");
                        setShowBooking(true);
                    }}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-purple-300/40 transition hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
                >
                    <CalendarDays className="h-5 w-5" />
                    Book Workspace Now
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>

                {/* HOST INFORMATION */}
                <div className="rounded-2xl border border-[#EFE7FB] bg-white p-5 shadow-lg transition-colors duration-300 dark:border-[#49375F] dark:bg-[#211a30] dark:shadow-black/20">
                    <h2 className="text-lg font-bold text-[#211638] dark:text-gray-100">
                        Hosted by
                    </h2>

                    {host ? (
                        <>
                            <div className="mt-4 flex items-center gap-3">
                                {host.photo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={getImageUrl(host.photo)}
                                        alt={host.name}
                                        className="h-[72px] w-[72px] rounded-2xl object-cover"
                                    />
                                ) : (
                                    <span className="grid h-[72px] w-[72px] place-items-center rounded-2xl bg-gradient-to-br from-[#8F51EA] to-[#EC4899] text-xl font-bold text-white">
                                        {host.name
                                            .split(/\s+/)
                                            .slice(0, 2)
                                            .map((part) => part[0]?.toUpperCase())
                                            .join("")}
                                    </span>
                                )}

                                <div className="min-w-0">
                                    <h3 className="flex items-center gap-1.5 font-bold text-[#211638] dark:text-gray-100">
                                        <span className="truncate">
                                            {host.name}
                                        </span>
                                        <BadgeCheck className="h-4 w-4 shrink-0 fill-[#8F51EA] text-white" />
                                    </h3>

                                    <p className="mt-1 text-sm text-[#77718B] dark:text-gray-400">
                                        Studio Host
                                    </p>

                                    <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#5B5470] dark:text-gray-300">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        {rating.toFixed(1)} ({totalReviews} reviews)
                                    </p>
                                </div>
                            </div>

                            {host.email && (
                                <a
                                    href={`mailto:${host.email}`}
                                    className="mt-4 block break-all text-sm font-medium text-[#8F51EA] hover:underline dark:text-[#b995f8]"
                                >
                                    {host.email}
                                </a>
                            )}

                            <div className="mt-4 rounded-xl bg-[#FBF7FF] p-3.5 text-sm leading-6 text-[#5B5470] dark:bg-[#2b2140] dark:text-gray-300">
                                &ldquo;Creating is better together. Welcome to{" "}
                                {studioTitle || studio.title}.&rdquo;
                            </div>
                        </>
                    ) : (
                        <p className="mt-3 text-sm text-[#77718B] dark:text-gray-400">
                            Host details are not available.
                        </p>
                    )}

                    {availability && (
                        <p className="mt-4 flex items-center gap-2 border-t border-[#F1E9FD] pt-4 text-sm text-[#5B5470] dark:border-[#49375F] dark:text-gray-300">
                            <Clock className="h-4 w-4 shrink-0 text-[#8F51EA] dark:text-[#a875f5]" />
                            {availability.openingTime && availability.closingTime
                                ? `Available ${availability.openingTime} – ${availability.closingTime}`
                                : `Available ${availability.openingTime ||
                                availability.closingTime ||
                                "by arrangement"
                                }`}
                        </p>
                    )}
                </div>
            </aside>

            {/* BOOKING MODAL */}
            {showBooking && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#160c2a]/60 p-3 backdrop-blur-sm sm:p-5"
                    onClick={closeBooking}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="booking-title"
                        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#EFE7FB] bg-white shadow-2xl transition-colors duration-300 dark:border-[#49375F] dark:bg-[#211a30]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* MODAL HEADER */}
                        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#F1E9FD] p-5 dark:border-[#49375F] sm:p-6">
                            <div>
                                <h2
                                    id="booking-title"
                                    className="text-2xl font-bold text-[#211638] dark:text-gray-100"
                                >
                                    Book This Workspace
                                </h2>

                                <p className="mt-1 text-sm text-[#77718B] dark:text-gray-400">
                                    Reserve {studio.title} for your next session.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeBooking}
                                disabled={isSubmitting}
                                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#77718B] transition hover:bg-[#F5EFFE] hover:text-[#8F51EA] disabled:opacity-50 dark:text-gray-400 dark:hover:bg-[#352747] dark:hover:text-[#c5a6ff]"
                                aria-label="Close booking modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* SUCCESS MESSAGE */}
                        {bookingConfirmed ? (
                            <div className="overflow-y-auto p-6 text-center">
                                <CheckCircle2 className="mx-auto h-14 w-14 text-green-500 dark:text-green-400" />

                                <h3 className="mt-4 text-xl font-bold text-[#211638] dark:text-gray-100">
                                    Booking Submitted!
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-[#5B5470] dark:text-gray-300">
                                    Your reservation has been saved successfully.
                                    Its current status is Pending until the host confirms it.
                                </p>

                                <div className="mt-4 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                    Status: Pending
                                </div>

                                <p className="mt-4 text-sm text-[#5B5470] dark:text-gray-300">
                                    {booking.name}, your booking is for{" "}
                                    {formatDate(booking.date)} at {booking.time}.
                                </p>

                                <div className="mt-6 flex flex-wrap justify-center gap-3">
                                    <Link
                                        href="/my-booking"
                                        onClick={() => setShowBooking(false)}
                                        className="rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-3 text-sm font-bold text-white transition hover:brightness-110"
                                    >
                                        View My Bookings
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={closeBooking}
                                        className="rounded-xl border border-[#E7DBFC] px-6 py-3 text-sm font-bold text-[#5B5470] transition hover:bg-[#F5EFFE] dark:border-[#49375F] dark:text-gray-300 dark:hover:bg-[#352747]"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* SCROLLABLE FORM CONTENT */}
                                <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        {/* STUDIO INFORMATION */}
                                        <div>
                                            {mainImage ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={mainImage}
                                                    alt={studio.title}
                                                    className="h-40 w-full rounded-xl object-cover"
                                                />
                                            ) : (
                                                <div className="grid h-40 place-items-center rounded-xl bg-[#F1E9FD] dark:bg-[#352747]">
                                                    <span className="text-3xl text-[#8F51EA] dark:text-[#b995f8]">
                                                        ✦
                                                    </span>
                                                </div>
                                            )}

                                            <h3 className="mt-3 text-lg font-bold text-[#211638] dark:text-gray-100">
                                                {studio.title}
                                            </h3>

                                            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#77718B] dark:text-gray-400">
                                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                {rating.toFixed(1)} ({totalReviews} reviews)
                                            </p>

                                            <p className="mt-3 text-2xl font-extrabold text-[#7C3AED] dark:text-[#b995f8]">
                                                {currency(price)}
                                                <span className="text-sm font-semibold text-[#8A8499] dark:text-gray-400">
                                                    {" "}/ hr
                                                </span>
                                            </p>

                                            {studio.securityDeposit !== undefined && (
                                                <p className="mt-1 text-sm text-[#77718B] dark:text-gray-400">
                                                    Deposit: {currency(securityDeposit)}
                                                </p>
                                            )}
                                        </div>

                                        {/* BOOKING FORM */}
                                        <div className="space-y-4">
                                            <label className={labelClass}>
                                                Select Date

                                                <div className="relative">
                                                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8F51EA] dark:text-[#a875f5]" />

                                                    <input
                                                        type="date"
                                                        min={getToday()}
                                                        value={booking.date}
                                                        onChange={(event) =>
                                                            updateBooking("date", event.target.value)
                                                        }
                                                        required
                                                        className={`${inputClass} cursor-pointer pl-11`}
                                                    />
                                                </div>
                                            </label>

                                            <label className={labelClass}>
                                                Select Time

                                                <div className="relative">
                                                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8F51EA] dark:text-[#a875f5]" />

                                                    <input
                                                        type="time"
                                                        value={booking.time}
                                                        onChange={(event) =>
                                                            updateBooking("time", event.target.value)
                                                        }
                                                        required
                                                        className={`${inputClass} cursor-pointer pl-11`}
                                                    />
                                                </div>
                                            </label>

                                            <label className={labelClass}>
                                                Duration

                                                <select
                                                    value={booking.duration}
                                                    onChange={(event) =>
                                                        updateBooking("duration", event.target.value)
                                                    }
                                                    className={inputClass}
                                                >
                                                    {Array.from(
                                                        { length: 6 },
                                                        (_, index) => index + 1
                                                    ).map((hours) => (
                                                        <option key={hours} value={hours}>
                                                            {hours} {hours === 1 ? "hour" : "hours"}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>

                                            <label className={labelClass}>
                                                Your Name

                                                <input
                                                    type="text"
                                                    value={booking.name}
                                                    onChange={(event) =>
                                                        updateBooking("name", event.target.value)
                                                    }
                                                    placeholder="Enter your name"
                                                    required
                                                    className={inputClass}
                                                />
                                            </label>

                                            <label className={labelClass}>
                                                Email Address

                                                <input
                                                    type="email"
                                                    value={booking.email}
                                                    onChange={(event) =>
                                                        updateBooking("email", event.target.value)
                                                    }
                                                    placeholder="you@example.com"
                                                    required
                                                    className={inputClass}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {bookingError && (
                                        <p
                                            className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600 dark:border dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
                                            role="alert"
                                        >
                                            {bookingError}
                                        </p>
                                    )}
                                </div>

                                {/* ALWAYS VISIBLE CONFIRM BUTTON */}
                                <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-[#F1E9FD] bg-white p-5 dark:border-[#49375F] dark:bg-[#211a30] sm:p-6">
                                    <div>
                                        <p className="text-sm text-[#77718B] dark:text-gray-400">
                                            Estimated Total
                                        </p>

                                        <p className="text-2xl font-extrabold text-[#7C3AED] dark:text-[#b995f8]">
                                            {currency(total)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={confirmBooking}
                                        disabled={isSubmitting}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-7 py-3 font-bold text-white shadow-lg shadow-purple-200 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-purple-950/30"
                                    >
                                        {isSubmitting
                                            ? "Saving Booking..."
                                            : "Confirm Booking"}
                                        {!isSubmitting && (
                                            <ArrowRight size={18} />
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}