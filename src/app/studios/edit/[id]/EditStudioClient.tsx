
"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Loader2,
    Save,
    User,
    Mail,
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

type FormData = {
    title: string;
    imageUrl: string;
    category: string;
    pricePerHour: string;
    rating: string;
    location: string;
};

const initialForm: FormData = {
    title: "",
    imageUrl: "",
    category: "",
    pricePerHour: "",
    rating: "",
    location: "",
};

const categories = [
    "Photo Studio",
    "Sound Stage",
    "Podcast Room",
    "Music Suite",
    "Art Workshop",
];

export default function EditStudioPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: session, isPending } = useSession();
    const email = session?.user?.email?.trim().toLowerCase();
    const hostName = session?.user?.name || "Studio Host";

    const [formData, setFormData] = useState<FormData>(initialForm);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [studio, setStudio] = useState<Studio | null>(null);

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/login");
        }
    }, [isPending, session, router]);

    const fetchStudio = useCallback(async () => {
        if (!id || !email) return;

        try {
            setIsLoading(true);

            const response = await fetch(`${API_URL}/studios/${id}`, {
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Failed to load studio information.");
            }

            const data: Studio = await response.json();

            const ownerEmail = (
                data.ownerEmail || data.userEmail || ""
            ).trim().toLowerCase();

            if (ownerEmail !== email) {
                toast.error("You are not authorized to edit this studio.");
                router.replace("/my-listings");
                return;
            }

            setStudio(data);

            setFormData({
                title: data.title || "",
                imageUrl: data.imageUrl || data.image || "",
                category: data.category || "",
                pricePerHour: String(data.pricePerHour ?? ""),
                rating: String(data.rating ?? 0),
                location: data.location || "",
            });
        } catch (error) {
            console.error("Error loading studio:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsLoading(false);
        }
    }, [id, email, router]);

    useEffect(() => {
        if (email && id) {
            fetchStudio();
        }
    }, [email, id, fetchStudio]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !studio) {
            toast.error("Unable to verify studio ownership.");
            return;
        }

        const pricePerHour = Number(formData.pricePerHour);
        const rating = Number(formData.rating);

        if (!formData.title.trim() || !formData.location.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!Number.isFinite(pricePerHour) || pricePerHour <= 0) {
            toast.error("Please enter a valid hourly price.");
            return;
        }

        if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
            toast.error("Rating must be between 0 and 5.");
            return;
        }

        const updatedData = {
            title: formData.title.trim(),
            image: formData.imageUrl.trim(),
            imageUrl: formData.imageUrl.trim(),
            category: formData.category,
            pricePerHour,
            rating,
            location: formData.location.trim(),
            userEmail: email,
        };

        try {
            setIsSubmitting(true);

            const response = await fetch(`${API_URL}/studios/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(
                    responseText || "Failed to update studio."
                );
            }

            toast.success("Studio updated successfully!");
            router.push("/my-listings");
            router.refresh();
        } catch (error) {
            console.error("Update error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update studio."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPending || isLoading || (!session && !isPending)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F4FF]">
                <Loader2 className="h-9 w-9 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!studio) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F4FF] px-4 text-center">
                <h2 className="text-2xl font-bold text-[#292044]">
                    Studio Not Found
                </h2>

                <p className="mt-2 text-gray-500">
                    This studio could not be found or you cannot edit it.
                </p>

                <Link
                    href="/my-listings"
                    className="mt-6 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
                >
                    Back to My Listings
                </Link>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#F7F4FF] px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/my-listings"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 transition hover:text-purple-900"
                >
                    <ArrowLeft size={18} />
                    Back to My Listings
                </Link>

                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-600">
                        Manage Your Listing
                    </p>

                    <h1 className="text-3xl font-bold text-[#292044] sm:text-4xl">
                        Update Studio
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Update your studio information below.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-lg sm:p-9"
                >
                    {/* Read-only host information */}
                    <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">
                        <h2 className="mb-4 flex items-center gap-2 font-bold text-[#292044]">
                            <User size={19} className="text-purple-600" />
                            Host Information
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="mb-1 text-xs font-medium text-gray-500">
                                    Host Name
                                </p>

                                <div className="flex items-center gap-2 rounded-lg border border-purple-100 bg-white px-3 py-3 text-sm text-gray-700">
                                    <User size={16} className="text-purple-500" />
                                    {hostName}
                                </div>
                            </div>

                            <div>
                                <p className="mb-1 text-xs font-medium text-gray-500">
                                    Host Email
                                </p>

                                <div className="flex items-center gap-2 rounded-lg border border-purple-100 bg-white px-3 py-3 text-sm text-gray-700">
                                    <Mail size={16} className="shrink-0 text-purple-500" />
                                    <span className="truncate">{email}</span>
                                </div>
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-gray-500">
                            Host information cannot be changed.
                        </p>
                    </div>

                    {/* Studio name */}
                    <div>
                        <label htmlFor="title" className="mb-2 block text-sm font-semibold text-[#292044]">
                            Studio Name
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter studio name"
                            className="w-full rounded-lg border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label htmlFor="imageUrl" className="mb-2 block text-sm font-semibold text-[#292044]">
                            Studio Image URL
                        </label>

                        <input
                            id="imageUrl"
                            name="imageUrl"
                            type="url"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            required
                            placeholder="https://example.com/image.jpg"
                            className="w-full rounded-lg border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="mb-2 block text-sm font-semibold text-[#292044]">
                            Category
                        </label>

                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        >
                            <option value="">Select a category</option>

                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Hourly price */}
                    <div>
                        <label htmlFor="pricePerHour" className="mb-2 block text-sm font-semibold text-[#292044]">
                            Price Per Hour ($)
                        </label>

                        <input
                            id="pricePerHour"
                            name="pricePerHour"
                            type="number"
                            min="1"
                            value={formData.pricePerHour}
                            onChange={handleChange}
                            required
                            placeholder="Enter hourly price"
                            className="w-full rounded-lg border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label htmlFor="rating" className="mb-2 block text-sm font-semibold text-[#292044]">
                            Studio Rating (0–5)
                        </label>

                        <input
                            id="rating"
                            name="rating"
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={formData.rating}
                            onChange={handleChange}
                            required
                            placeholder="Example: 4.5"
                            className="w-full rounded-lg border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="mb-2 block text-sm font-semibold text-[#292044]">
                            Location
                        </label>

                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="Enter studio location"
                            className="w-full rounded-lg border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                        <Link
                            href="/my-listings"
                            className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 font-semibold text-white shadow-md transition hover:from-purple-700 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={19} className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={19} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
