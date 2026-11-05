"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    Clock,
    MapPin,
    CreditCard,
    XCircle,
    Loader2,
    AlertCircle,
    RefreshCw,
    BadgeCheck,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";

import BookingsHeader from "@/components/BookingHeader";
import { useSession } from "@/app/lib/auth-client";

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type Booking = {
    _id: string;
    studioId: string;
    title?: string;
    studioTitle?: string;
    image?: string;
    imageUrl?: string;
    studioImage?: string;
    category?: string;
    location?: string;
    userEmail: string;
    userName?: string;
    date: string;
    time: string;
    duration: number;
    pricePerHour?: number;
    totalPrice: number;
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
    createdAt?: string;
};

const filters = [
    "All",
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
] as const;

type Filter = (typeof filters)[number];

export default function MyBookingsPage() {
    const { data: session, isPending: sessionLoading } = useSession();

    const email = session?.user?.email;

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [activeFilter, setActiveFilter] = useState<Filter>("All");
    const [loading, setLoading] = useState(true);

    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [completingId, setCompletingId] = useState<string | null>(null);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<
        "success" | "error" | ""
    >("");

    // ==========================================
    // FETCH BOOKINGS
    // ==========================================

    const fetchBookings = useCallback(async () => {
        if (sessionLoading) return;

        if (!email) {
            setBookings([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/bookings?email=${encodeURIComponent(email)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch bookings."
                );
            }

            const bookingList: Booking[] = Array.isArray(data)
                ? data
                : Array.isArray(data.bookings)
                    ? data.bookings
                    : Array.isArray(data.data)
                        ? data.data
                        : [];

            const userBookings = bookingList
                .filter(
                    (booking) =>
                        booking.userEmail?.toLowerCase() ===
                        email.toLowerCase()
                )
                .map((booking) => ({
                    ...booking,
                    title:
                        booking.title ||
                        booking.studioTitle ||
                        "Studio Booking",
                    image:
                        booking.image ||
                        booking.studioImage ||
                        booking.imageUrl ||
                        "",
                    status: booking.status || "Pending",
                }));

            userBookings.sort((a, b) => {
                const dateA = new Date(
                    a.createdAt || a.date
                ).getTime();

                const dateB = new Date(
                    b.createdAt || b.date
                ).getTime();

                return dateB - dateA;
            });

            setBookings(userBookings);
        } catch (error) {
            console.error("Fetch bookings error:", error);

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to load your bookings."
            );

            setMessageType("error");
        } finally {
            setLoading(false);
        }
    }, [email, sessionLoading]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // ==========================================
    // FILTER BOOKINGS
    // ==========================================

    const filteredBookings = useMemo(() => {
        if (activeFilter === "All") {
            return bookings;
        }

        return bookings.filter(
            (booking) => booking.status === activeFilter
        );
    }, [bookings, activeFilter]);

    // ==========================================
    // UPDATE BOOKING STATUS
    // ==========================================

    const updateBookingStatus = async (
        bookingId: string,
        action: "confirm" | "complete"
    ) => {
        const isConfirm = action === "confirm";

        const confirmed = window.confirm(
            isConfirm
                ? "Are you sure you want to confirm this booking?"
                : "Are you sure you want to mark this booking as completed?"
        );

        if (!confirmed) return;

        try {
            if (isConfirm) {
                setConfirmingId(bookingId);
            } else {
                setCompletingId(bookingId);
            }

            setMessage("");
            setMessageType("");

            const response = await fetch(
                `${API_URL}/bookings/${bookingId}/${action}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    `Failed to ${action} booking.`
                );
            }

            const newStatus =
                action === "confirm" ? "Confirmed" : "Completed";

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status: newStatus }
                        : booking
                )
            );

            setMessage(
                action === "confirm"
                    ? "Booking confirmed successfully!"
                    : "Booking completed successfully!"
            );

            setMessageType("success");

            await fetchBookings();
        } catch (error) {
            console.error(`${action} booking error:`, error);

            setMessage(
                error instanceof Error
                    ? error.message
                    : `Unable to ${action} booking.`
            );

            setMessageType("error");
        } finally {
            setConfirmingId(null);
            setCompletingId(null);
        }
    };

    // ==========================================
    // CANCEL BOOKING
    // ==========================================

    const handleCancelBooking = async (bookingId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed || !email) return;

        try {
            setCancellingId(bookingId);
            setMessage("");
            setMessageType("");

            const response = await fetch(
                `${API_URL}/bookings/${bookingId}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userEmail: email,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to cancel booking."
                );
            }

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status: "Cancelled" }
                        : booking
                )
            );

            setMessage("Booking cancelled successfully.");
            setMessageType("success");

            await fetchBookings();
        } catch (error) {
            console.error("Cancel booking error:", error);

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to cancel booking."
            );

            setMessageType("error");
        } finally {
            setCancellingId(null);
        }
    };

    // ==========================================
    // IMAGE URL
    // ==========================================

    const getImageUrl = (image?: string) => {
        if (!image) return "";

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
    };

    // ==========================================
    // STATUS COLORS
    // ==========================================

    const getStatusStyle = (status: Booking["status"]) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400";

            case "Confirmed":
                return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400";

            case "Completed":
                return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";

            case "Cancelled":
                return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";

            default:
                return "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300";
        }
    };

    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (sessionLoading || loading) {
        return (
            <main className="min-h-screen bg-[#F8F3FF] dark:bg-[#15111f]">
                <BookingsHeader />

                <div className="flex min-h-[300px] items-center justify-center">
                    <Loader2
                        className="animate-spin text-purple-600 dark:text-[#a875f5]"
                        size={35}
                    />

                    <span className="ml-3 text-gray-600 dark:text-gray-300">
                        Loading your bookings...
                    </span>
                </div>
            </main>
        );
    }

    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!email) {
        return (
            <main className="min-h-screen bg-[#F8F3FF] dark:bg-[#15111f]">
                <BookingsHeader />

                <div className="mx-auto max-w-2xl px-6 py-20 text-center">
                    <AlertCircle
                        size={45}
                        className="mx-auto mb-4 text-purple-500 dark:text-[#a875f5]"
                    />

                    <h2 className="text-2xl font-bold text-[#211638] dark:text-white">
                        Please sign in
                    </h2>

                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        Sign in to view and manage your studio bookings.
                    </p>

                    <Link
                        href="/sign-in"
                        className="mt-6 inline-block rounded-full bg-purple-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 dark:bg-[#a875f5] dark:text-[#170f25] dark:hover:bg-[#9560e8]"
                    >
                        Sign In
                    </Link>
                </div>
            </main>
        );
    }

    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (
        <main className="min-h-screen bg-[#F8F3FF] pb-20 dark:bg-[#15111f]">
            <BookingsHeader />

            <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">

                {/* PAGE HEADING */}

                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#211638] dark:text-white">
                            Your Reservations
                        </h2>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            View and manage all your studio reservations.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white px-5 py-3 shadow-sm dark:border dark:border-[#49375F] dark:bg-[#211a30]">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total Bookings
                        </p>

                        <p className="text-2xl font-bold text-purple-600 dark:text-[#a875f5]">
                            {bookings.length}
                        </p>
                    </div>
                </div>

                {/* SUCCESS / ERROR MESSAGE */}

                {message && (
                    <div
                        className={`mb-6 rounded-xl border px-4 py-3 text-sm ${messageType === "error"
                                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
                                : "border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* FILTERS */}

                <div className="mb-8 flex flex-wrap gap-3">
                    {filters.map((filter) => {
                        const count =
                            filter === "All"
                                ? bookings.length
                                : bookings.filter(
                                    (booking) =>
                                        booking.status === filter
                                ).length;

                        return (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${activeFilter === filter
                                        ? "bg-purple-600 text-white shadow-md dark:bg-[#a875f5] dark:text-[#170f25]"
                                        : "border border-purple-100 bg-white text-gray-600 hover:bg-purple-50 dark:border-[#49375F] dark:bg-[#211a30] dark:text-gray-300 dark:hover:bg-[#302441]"
                                    }`}
                            >
                                {filter} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* RETRY BUTTON */}

                {messageType === "error" && bookings.length === 0 && (
                    <div className="mb-6 text-center">
                        <button
                            onClick={fetchBookings}
                            className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 dark:bg-[#a875f5] dark:text-[#170f25] dark:hover:bg-[#9560e8]"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                    </div>
                )}

                {/* BOOKING CARDS */}

                {filteredBookings.length === 0 ? (
                    <div className="rounded-2xl border border-purple-100 bg-white px-6 py-16 text-center shadow-sm dark:border-[#49375F] dark:bg-[#211a30]">
                        <CalendarDays
                            size={48}
                            className="mx-auto mb-4 text-purple-400 dark:text-[#a875f5]"
                        />

                        <h3 className="text-xl font-bold text-[#211638] dark:text-white">
                            {bookings.length === 0
                                ? "No bookings yet"
                                : "No bookings found"}
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                            {bookings.length === 0
                                ? "You haven't booked any studios yet. Explore our studios and book your perfect creative space."
                                : `You don't have any ${activeFilter.toLowerCase()} bookings.`}
                        </p>

                        <Link
                            href="/studios"
                            className="mt-6 inline-block rounded-full bg-purple-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 dark:bg-[#a875f5] dark:text-[#170f25] dark:hover:bg-[#9560e8]"
                        >
                            Explore Studios
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {filteredBookings.map((booking) => {
                            const image = getImageUrl(
                                booking.image ||
                                booking.imageUrl ||
                                booking.studioImage
                            );

                            const isBusy =
                                cancellingId === booking._id ||
                                confirmingId === booking._id ||
                                completingId === booking._id;

                            return (
                                <article
                                    key={booking._id}
                                    className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-[#49375F] dark:bg-[#211a30] dark:hover:shadow-purple-950/30"
                                >
                                    {/* STUDIO IMAGE */}

                                    {image ? (
                                        <img
                                            src={image}
                                            alt={booking.title || "Studio"}
                                            className="h-52 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-52 items-center justify-center bg-purple-100 dark:bg-[#302441]">
                                            <CalendarDays
                                                size={45}
                                                className="text-purple-400 dark:text-[#a875f5]"
                                            />
                                        </div>
                                    )}

                                    <div className="p-6">

                                        {/* TITLE AND STATUS */}

                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-[#211638] dark:text-white">
                                                    {booking.title ||
                                                        booking.studioTitle ||
                                                        "Studio Booking"}
                                                </h3>

                                                <p className="mt-1 text-sm text-purple-600 dark:text-[#b995fa]">
                                                    {booking.category || "Studio"}
                                                </p>
                                            </div>

                                            <span
                                                className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                                                    booking.status
                                                )}`}
                                            >
                                                {booking.status || "Pending"}
                                            </span>
                                        </div>

                                        {/* BOOKING INFORMATION */}

                                        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <CalendarDays
                                                    size={17}
                                                    className="shrink-0 text-purple-500 dark:text-[#a875f5]"
                                                />
                                                <span>
                                                    {booking.date || "Date unavailable"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Clock
                                                    size={17}
                                                    className="shrink-0 text-purple-500 dark:text-[#a875f5]"
                                                />
                                                <span>
                                                    {booking.time || "Time unavailable"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <MapPin
                                                    size={17}
                                                    className="shrink-0 text-purple-500 dark:text-[#a875f5]"
                                                />
                                                <span>
                                                    {booking.location || "Location unavailable"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Clock
                                                    size={17}
                                                    className="shrink-0 text-purple-500 dark:text-[#a875f5]"
                                                />
                                                <span>
                                                    {booking.duration || 0} hours
                                                </span>
                                            </div>
                                        </div>

                                        {/* PRICE AND ACTIONS */}

                                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-purple-100 pt-5 dark:border-[#49375F]">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Total Amount
                                                </p>

                                                <p className="mt-1 flex items-center gap-1 text-xl font-bold text-purple-700 dark:text-[#b995fa]">
                                                    <CreditCard size={18} />
                                                    $
                                                    {Number(
                                                        booking.totalPrice || 0
                                                    ).toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2">

                                                {/* CONFIRM BOOKING */}

                                                {booking.status === "Pending" && (
                                                    <button
                                                        onClick={() =>
                                                            updateBookingStatus(
                                                                booking._id,
                                                                "confirm"
                                                            )
                                                        }
                                                        disabled={isBusy}
                                                        className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {confirmingId === booking._id ? (
                                                            <Loader2
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <BadgeCheck size={16} />
                                                        )}

                                                        {confirmingId === booking._id
                                                            ? "Confirming..."
                                                            : "Confirm Booking"}
                                                    </button>
                                                )}

                                                {/* COMPLETE BOOKING */}

                                                {booking.status === "Confirmed" && (
                                                    <button
                                                        onClick={() =>
                                                            updateBookingStatus(
                                                                booking._id,
                                                                "complete"
                                                            )
                                                        }
                                                        disabled={isBusy}
                                                        className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {completingId === booking._id ? (
                                                            <Loader2
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <CheckCircle2 size={16} />
                                                        )}

                                                        {completingId === booking._id
                                                            ? "Completing..."
                                                            : "Complete Booking"}
                                                    </button>
                                                )}

                                                {/* CANCEL BOOKING */}

                                                {booking.status === "Pending" && (
                                                    <button
                                                        onClick={() =>
                                                            handleCancelBooking(
                                                                booking._id
                                                            )
                                                        }
                                                        disabled={isBusy}
                                                        className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                                                    >
                                                        {cancellingId === booking._id ? (
                                                            <Loader2
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <XCircle size={16} />
                                                        )}

                                                        {cancellingId === booking._id
                                                            ? "Cancelling..."
                                                            : "Cancel Booking"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}