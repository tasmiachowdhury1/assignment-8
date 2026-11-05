"use client";

import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/app/lib/auth-client";

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const initialForm = {
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

export default function AddStudio() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [formData, setFormData] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        const ownerEmail = session?.user?.email?.trim().toLowerCase();

        if (!ownerEmail) {
            toast.error("Please sign in before adding a studio.");
            return;
        }

        const rating = Number(formData.rating);
        const pricePerHour = Number(formData.pricePerHour);

        if (rating < 0 || rating > 5 || !Number.isFinite(rating)) {
            toast.error("Rating must be between 0 and 5.");
            return;
        }

        if (pricePerHour <= 0 || !Number.isFinite(pricePerHour)) {
            toast.error("Please enter a valid hourly price.");
            return;
        }

        const studioData = {
            title: formData.title.trim(),
            image: formData.imageUrl.trim(),
            imageUrl: formData.imageUrl.trim(),
            category: formData.category,
            pricePerHour,
            rating,
            location: formData.location.trim(),
            ownerEmail,
            userEmail: ownerEmail,
        };

        try {
            setIsSubmitting(true);

            const res = await fetch(`${API_URL}/add-newstudio`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(studioData),
            });

            const responseText = await res.text();

            if (!res.ok) {
                throw new Error(
                    responseText || "Failed to add studio."
                );
            }

            toast.success("Studio added successfully!");
            setFormData(initialForm);

            router.push("/my-listings");
        } catch (error) {
            console.error("Error adding studio:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F4FF] dark:bg-[#15111f]">
                <Loader2 className="h-9 w-9 animate-spin text-purple-600 dark:text-[#a875f5]" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F4FF] px-4 text-center dark:bg-[#15111f]">
                <h2 className="text-2xl font-bold text-[#292044] dark:text-white">
                    Please Sign In
                </h2>

                <p className="mt-2 text-gray-500 dark:text-[#b7a9cc]">
                    You need to sign in before adding a studio.
                </p>

                <button
                    onClick={() => router.push("/login")}
                    className="mt-5 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                >
                    Sign In
                </button>
            </div>
        );
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#F7F4FF] px-4 py-12 transition-colors duration-300 dark:bg-[#15111f]">

            {/* Decorative background blobs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 -right-24 h-[380px] w-[420px] rounded-full bg-purple-300/30 blur-3xl dark:bg-purple-700/15"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -left-24 h-[380px] w-[420px] rounded-full bg-pink-300/30 blur-3xl dark:bg-fuchsia-700/10"
            />

            <div className="relative z-10 mx-auto max-w-2xl rounded-2xl border border-purple-100 bg-white p-6 shadow-lg transition-colors duration-300 dark:border-[#49375F] dark:bg-[#211a30] sm:p-10">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#292044] dark:text-white">
                        Add Your Studio
                    </h1>

                    <p className="mt-2 text-sm text-gray-500 dark:text-[#b7a9cc]">
                        Share your creative space with others.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Studio Name */}
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-semibold text-[#292044] dark:text-[#e5d9f5]"
                        >
                            Studio Name
                        </label>

                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter studio name"
                            required
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-[#292044] outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:border-[#49375F] dark:bg-[#30243f] dark:text-white dark:placeholder:text-[#9585aa] dark:focus:border-[#a875f5] dark:focus:ring-[#a875f5]/20"
                        />
                    </div>

                    {/* Studio Image URL */}
                    <div>
                        <label
                            htmlFor="imageUrl"
                            className="mb-2 block text-sm font-semibold text-[#292044] dark:text-[#e5d9f5]"
                        >
                            Studio Image URL
                        </label>

                        <input
                            id="imageUrl"
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            required
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-[#292044] outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:border-[#49375F] dark:bg-[#30243f] dark:text-white dark:placeholder:text-[#9585aa] dark:focus:border-[#a875f5] dark:focus:ring-[#a875f5]/20"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 block text-sm font-semibold text-[#292044] dark:text-[#e5d9f5]"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-[#292044] outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:border-[#49375F] dark:bg-[#30243f] dark:text-white dark:focus:border-[#a875f5] dark:focus:ring-[#a875f5]/20"
                        >
                            <option value="">Select a category</option>

                            {categories.map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                    className="bg-white text-[#292044] dark:bg-[#30243f] dark:text-white"
                                >
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Per Hour */}
                    <div>
                        <label
                            htmlFor="pricePerHour"
                            className="mb-2 block text-sm font-semibold text-[#292044] dark:text-[#e5d9f5]"
                        >
                            Price Per Hour ($)
                        </label>

                        <input
                            id="pricePerHour"
                            type="number"
                            name="pricePerHour"
                            value={formData.pricePerHour}
                            onChange={handleChange}
                            placeholder="Enter hourly price"
                            min="1"
                            required
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-[#292044] outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:border-[#49375F] dark:bg-[#30243f] dark:text-white dark:placeholder:text-[#9585aa] dark:focus:border-[#a875f5] dark:focus:ring-[#a875f5]/20"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label
                            htmlFor="rating"
                            className="mb-2 block text-sm font-semibold text-[#292044] dark:text-[#e5d9f5]"
                        >
                            Studio Rating (0–5)
                        </label>

                        <input
                            id="rating"
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            placeholder="Example: 4.5"
                            min="0"
                            max="5"
                            step="0.1"
                            required
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-[#292044] outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:border-[#49375F] dark:bg-[#30243f] dark:text-white dark:placeholder:text-[#9585aa] dark:focus:border-[#a875f5] dark:focus:ring-[#a875f5]/20"
                        />

                        <p className="mt-1 text-xs text-gray-500 dark:text-[#a99bbd]">
                            Enter a rating between 0 and 5.
                        </p>
                    </div>

                    {/* Location */}
                    <div>
                        <label
                            htmlFor="location"
                            className="mb-2 block text-sm font-semibold text-[#292044] dark:text-[#e5d9f5]"
                        >
                            Location
                        </label>

                        <input
                            id="location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter studio location"
                            required
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-[#292044] outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:border-[#49375F] dark:bg-[#30243f] dark:text-white dark:placeholder:text-[#9585aa] dark:focus:border-[#a875f5] dark:focus:ring-[#a875f5]/20"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold text-white shadow-md transition hover:from-purple-700 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2
                                    size={19}
                                    className="animate-spin"
                                />
                                Adding Studio...
                            </>
                        ) : (
                            "Add Studio"
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}