
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    MapPin,
    Plus,
    Pencil,
    Trash2,
    Star,
    Loader2,
    Building2,
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/app/lib/auth-client";

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type Studio = {
    _id: string;
    title: string;
    image?: string;
    imageUrl?: string;
    category: string;
    pricePerHour: number;
    rating?: number;
    location: string;
    ownerEmail?: string;
    userEmail?: string;
};

export default function MyListingsPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [studios, setStudios] = useState<Studio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const email = session?.user?.email?.trim().toLowerCase();

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/login");
        }
    }, [isPending, session, router]);

    const fetchMyStudios = useCallback(async () => {
        if (!email) return;

        try {
            setIsLoading(true);

            const response = await fetch(`${API_URL}/studios`, {
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Failed to load studio listings.");
            }

            const data: Studio[] = await response.json();

            const myStudios = data.filter((studio) => {
                const ownerEmail = (
                    studio.ownerEmail || studio.userEmail || ""
                ).trim().toLowerCase();

                return ownerEmail === email;
            });

            setStudios(myStudios);
        } catch (error) {
            console.error("Error fetching studios:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsLoading(false);
        }
    }, [email]);

    useEffect(() => {
        if (email) {
            fetchMyStudios();
        }
    }, [email, fetchMyStudios]);

    const handleDelete = async () => {
        if (!deleteId || !email) return;

        try {
            setIsDeleting(true);

            const response = await fetch(
                `${API_URL}/studios/${deleteId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userEmail: email }),
                }
            );

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(
                    responseText || "Failed to delete studio."
                );
            }

            setStudios((prev) =>
                prev.filter((studio) => studio._id !== deleteId)
            );

            setDeleteId(null);
            toast.success("Studio deleted successfully!");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete studio."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    if (isPending || (!session && !isPending)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F4FF]">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#F7F4FF] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
                            StudioSpace Dashboard
                        </p>

                        <h1 className="text-3xl font-bold text-[#292044] sm:text-4xl">
                            My Studio Listings
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage and update your creative spaces.
                        </p>
                    </div>

                    <Link
                        href="/add-newstudio"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02] hover:from-purple-700 hover:to-pink-600"
                    >
                        <Plus size={20} />
                        Add New Studio
                    </Link>
                </div>

                {/* Count */}
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                    <Building2 size={18} className="text-purple-600" />
                    <span>
                        You have{" "}
                        <strong className="text-[#292044]">
                            {studios.length}
                        </strong>{" "}
                        studio listing(s).
                    </span>
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                    </div>
                ) : studios.length === 0 ? (
                    /* Empty state */
                    <div className="rounded-2xl border border-purple-100 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
                            <Building2
                                size={30}
                                className="text-purple-600"
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-[#292044]">
                            No Studios Found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-gray-500">
                            You haven't added any studios yet. Add your
                            first studio and share your creative space.
                        </p>

                        <Link
                            href="/add-newstudio"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                        >
                            <Plus size={19} />
                            Add Your First Studio
                        </Link>
                    </div>
                ) : (
                    /* Studio cards */
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {studios.map((studio) => (
                            <div
                                key={studio._id}
                                className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="relative h-56 w-full bg-purple-50">
                                    <Image
                                        src={
                                            studio.image ||
                                            studio.imageUrl ||
                                            "/placeholder-studio.jpg"
                                        }
                                        alt={studio.title}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />

                                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-purple-700 shadow-sm">
                                        {studio.category}
                                    </span>
                                </div>

                                <div className="p-5">
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <h2 className="text-xl font-bold text-[#292044]">
                                            {studio.title}
                                        </h2>

                                        <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-yellow-500">
                                            <Star
                                                size={16}
                                                fill="currentColor"
                                            />
                                            {studio.rating ?? "N/A"}
                                        </div>
                                    </div>

                                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin
                                            size={17}
                                            className="shrink-0 text-purple-500"
                                        />
                                        <span>{studio.location}</span>
                                    </div>

                                    <p className="mb-5 text-lg font-bold text-purple-700">
                                        ${studio.pricePerHour}
                                        <span className="text-sm font-normal text-gray-500">
                                            {" "}/ hour
                                        </span>
                                    </p>

                                    <div className="flex gap-3 border-t border-gray-100 pt-4">
                                        <Link
                                            href={`/studios/edit/${studio._id}`}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-purple-200 px-3 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                                        >
                                            <Pencil size={16} />
                                            Update
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeleteId(studio._id)
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete confirmation modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setDeleteId(null)}
                            disabled={isDeleting}
                            aria-label="Close confirmation"
                            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                            <Trash2 size={26} className="text-red-600" />
                        </div>

                        <h2 className="text-center text-2xl font-bold text-[#292044]">
                            Delete Studio?
                        </h2>

                        <p className="mt-3 text-center leading-relaxed text-gray-500">
                            Are you sure you want to delete this studio?
                            This action cannot be undone.
                        </p>

                        <div className="mt-7 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteId(null)}
                                disabled={isDeleting}
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={17} />
                                        Yes, Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
