"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import {
    ArrowRight,
    Camera,
    Check,
    LoaderCircle,
    Mail,
    Pencil,
    Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authClient } from "@/app/lib/auth-client";

type Profile = {
    name: string;
    email: string;
    phone: string;
    image: string;
};

const FALLBACK_PROFILE: Profile = {
    name: "Sarah Ahmed",
    email: "sarah.ahmed@example.com",
    phone: "+880 1712 345678",
    image: "",
};

const phoneStorageKey = (userId: string) =>
    "studiospace:phone:" + userId;

const getStoredPhone = (userId: string) => {
    if (typeof window === "undefined") return null;

    try {
        return window.localStorage.getItem(phoneStorageKey(userId));
    } catch {
        return null;
    }
};

const storePhone = (userId: string, phone: string) => {
    try {
        window.localStorage.setItem(phoneStorageKey(userId), phone);
    } catch {
        // Ignore storage failures.
    }
};

const subscribePhone = (onChange: () => void) => {
    window.addEventListener("storage", onChange);
    return () => window.removeEventListener("storage", onChange);
};

const useStoredPhone = (userId?: string) =>
    useSyncExternalStore(
        subscribePhone,
        () => (userId ? getStoredPhone(userId) : null),
        () => null
    );

const readImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () =>
            reject(new Error("Could not read the selected file."));

        reader.onload = () => {
            const source = document.createElement("img");

            source.onerror = () =>
                reject(new Error("The selected file is not an image."));

            source.onload = () => {
                const maxSize = 512;
                const scale = Math.min(
                    1,
                    maxSize / Math.max(source.width, source.height)
                );

                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.round(source.width * scale));
                canvas.height = Math.max(1, Math.round(source.height * scale));

                const context = canvas.getContext("2d");

                if (!context) {
                    reject(new Error("Canvas is not supported."));
                    return;
                }

                context.drawImage(
                    source,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                resolve(canvas.toDataURL("image/jpeg", 0.85));
            };

            source.src = reader.result as string;
        };

        reader.readAsDataURL(file);
    });
};

export default function DashboardPage() {
    const { data: session, isPending } = authClient.useSession();
    const sessionUser = session?.user;

    const [edits, setEdits] = useState<Partial<Profile>>({});
    const [editOpen, setEditOpen] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "" });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const storedPhone = useStoredPhone(sessionUser?.id);

    const profile: Profile = {
        name: edits.name || sessionUser?.name || FALLBACK_PROFILE.name,
        email: sessionUser?.email || FALLBACK_PROFILE.email,
        phone: edits.phone || storedPhone || FALLBACK_PROFILE.phone,
        image: edits.image ?? sessionUser?.image ?? FALLBACK_PROFILE.image,
    };

    const openEdit = () => {
        setForm({
            name: profile.name,
            phone: profile.phone,
        });
        setEditOpen(true);
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        e.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            return;
        }

        try {
            setUploading(true);

            const image = await readImageFile(file);

            if (sessionUser) {
                const { error } = await authClient.updateUser({ image });

                if (error) {
                    toast.error(
                        error.message || "Could not update your photo."
                    );
                    return;
                }
            }

            setEdits((prev) => ({ ...prev, image }));
            toast.success("Profile photo updated!");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not read that image."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const name = form.name.trim();
        const phone = form.phone.trim();

        if (!name) {
            toast.error("Please enter your name.");
            return;
        }

        if (!phone) {
            toast.error("Please enter your phone number.");
            return;
        }

        setSaving(true);

        try {
            if (sessionUser && name !== sessionUser.name) {
                const { error } = await authClient.updateUser({ name });

                if (error) {
                    toast.error(
                        error.message || "Could not update your profile."
                    );
                    return;
                }
            }

            if (sessionUser) {
                storePhone(sessionUser.id, phone);
            }

            setEdits((prev) => ({ ...prev, name, phone }));
            setEditOpen(false);
            toast.success("Profile updated successfully!");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const initial =
        profile.name.trim().charAt(0).toUpperCase() || "U";

    return (
        <section className="relative min-h-[75vh] overflow-hidden bg-gradient-to-br from-[#F4EEFF] via-[#FBF3FF] to-[#FDEFF8] px-4 py-12 transition-colors duration-300 dark:from-[#15111f] dark:via-[#1c1528] dark:to-[#211a30] sm:px-8 sm:py-16 lg:px-12">

            {/* Decorative background blobs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-36 -right-24 h-[420px] w-[540px] rounded-[50%] bg-purple-300/50 dark:bg-purple-700/15"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-44 -right-40 h-[340px] w-[440px] rounded-[50%] bg-pink-300/40 dark:bg-fuchsia-700/10"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-44 -left-32 h-[440px] w-[500px] rounded-[50%] bg-purple-300/40 dark:bg-purple-700/15"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-36 right-12 h-[320px] w-[400px] rounded-[50%] bg-fuchsia-200/50 dark:bg-fuchsia-700/10"
            />

            <div className="relative z-10 mx-auto max-w-5xl">

                {/* Page Heading */}
                <header className="mb-8 sm:mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#1B1533] dark:text-white sm:text-5xl">
                        My Profile
                    </h1>

                    <p className="mt-3 text-sm text-[#77718B] dark:text-[#b7a9cc] sm:text-base">
                        View and manage your profile information
                    </p>
                </header>

                {isPending ? (
                    /* Loading Skeleton */
                    <div className="animate-pulse rounded-[28px] border border-white/80 bg-white/95 p-6 shadow-[0_30px_60px_-25px_rgba(143,81,234,0.45)] dark:border-[#49375F] dark:bg-[#211a30] sm:p-10">
                        <div className="grid gap-8 md:grid-cols-[300px_1fr] md:items-center md:gap-10">
                            <div className="flex justify-center md:justify-start">
                                <div className="h-44 w-44 rounded-full bg-purple-100 dark:bg-[#38294b] sm:h-52 sm:w-52" />
                            </div>

                            <div className="space-y-5 md:border-l md:border-purple-100 dark:md:border-[#49375F] md:pl-10">
                                <div className="h-9 w-56 rounded-lg bg-purple-100 dark:bg-[#38294b]" />
                                <div className="h-5 w-72 max-w-full rounded-lg bg-purple-50 dark:bg-[#30243f]" />
                                <div className="h-5 w-48 max-w-full rounded-lg bg-purple-50 dark:bg-[#30243f]" />
                                <div className="h-12 w-48 rounded-full bg-purple-100 dark:bg-[#38294b]" />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Profile Card */
                    <div className="rounded-[28px] border border-white/80 bg-white/95 p-6 shadow-[0_30px_60px_-25px_rgba(143,81,234,0.45)] backdrop-blur-sm transition-colors duration-300 dark:border-[#49375F] dark:bg-[#211a30]/95 sm:p-10">
                        <div className="grid gap-8 md:grid-cols-[300px_1fr] md:items-center md:gap-10">

                            {/* Avatar */}
                            <div className="flex justify-center md:justify-start">
                                <div className="relative">

                                    {/* Accent strokes */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute -left-5 top-0 z-10 hidden sm:block"
                                    >
                                        <span className="absolute top-1 h-1.5 w-8 rotate-[35deg] rounded-full bg-[#8F51EA] dark:bg-[#a875f5]" />
                                        <span className="absolute top-6 left-2 h-1.5 w-6 rotate-[10deg] rounded-full bg-[#8F51EA] dark:bg-[#a875f5]" />
                                        <span className="absolute top-11 left-4 h-1.5 w-5 -rotate-[15deg] rounded-full bg-[#8F51EA] dark:bg-[#a875f5]" />
                                    </div>

                                    <div className="inline-block rounded-full border-[3px] border-[#A55BF2]/70 bg-white p-2 shadow-[0_18px_40px_-18px_rgba(143,81,234,0.8)] dark:border-[#a875f5]/80 dark:bg-[#30243f]">
                                        <div className="relative h-44 w-44 overflow-hidden rounded-full bg-gradient-to-br from-[#EFE6FF] to-[#FCE7F3] dark:from-[#38294b] dark:to-[#49304d] sm:h-52 sm:w-52">
                                            {profile.image ? (
                                                <Image
                                                    src={profile.image}
                                                    alt={
                                                        profile.name ||
                                                        "Profile photo"
                                                    }
                                                    fill
                                                    unoptimized
                                                    sizes="(min-width: 640px) 208px, 176px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="absolute inset-0 flex items-center justify-center text-5xl font-extrabold text-[#8F51EA] dark:text-[#c4a2ff] sm:text-6xl">
                                                    {initial}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Change Photo Button */}
                                    <button
                                        type="button"
                                        onClick={handlePhotoClick}
                                        disabled={uploading}
                                        aria-label="Change profile photo"
                                        className="absolute right-1 bottom-1 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8F51EA] to-[#C46BF0] text-white shadow-lg ring-4 ring-white transition hover:scale-105 disabled:opacity-60 dark:ring-[#211a30]"
                                    >
                                        {uploading ? (
                                            <LoaderCircle
                                                size={21}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Camera size={21} />
                                        )}
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="md:border-l md:border-purple-100 dark:md:border-[#49375F] md:pl-10">
                                <div className="flex flex-col gap-6">

                                    {/* Name + Verified badge */}
                                    <div className="flex items-center gap-3">
                                        <h2 className="break-words text-3xl font-extrabold tracking-tight text-[#1B1533] dark:text-white sm:text-4xl">
                                            {profile.name}
                                        </h2>

                                        <span
                                            title="Verified member"
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8F51EA] to-[#B95CF0] text-white shadow-md shadow-purple-200 dark:shadow-purple-950/40"
                                        >
                                            <Check size={16} strokeWidth={3.5} />
                                        </span>
                                    </div>

                                    {/* Contact Details */}
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-4">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8F51EA] to-[#C46BF0] text-white shadow-md shadow-purple-200 dark:shadow-purple-950/40">
                                                <Mail size={19} />
                                            </span>

                                            <span className="min-w-0 break-all text-sm text-[#4D475E] dark:text-[#d0c3e2] sm:text-base">
                                                {profile.email}
                                            </span>
                                        </li>

                                        <li className="flex items-center gap-4">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#8F51EA] dark:text-[#b995ff]">
                                                <Phone
                                                    size={22}
                                                    strokeWidth={2.4}
                                                />
                                            </span>

                                            <span className="min-w-0 text-sm text-[#4D475E] dark:text-[#d0c3e2] sm:text-base">
                                                {profile.phone}
                                            </span>
                                        </li>
                                    </ul>

                                    {/* Edit Profile Button */}
                                    <div>
                                        <Button
                                            type="button"
                                            onClick={openEdit}
                                            className="group h-12 w-fit gap-2.5 rounded-full bg-gradient-to-r from-[#8F51EA] via-[#C45BE8] to-[#F86FC4] px-7 text-sm font-bold text-white shadow-lg shadow-purple-300/50 transition hover:-translate-y-0.5 hover:shadow-xl sm:px-8 sm:text-base"
                                        >
                                            <Pencil size={17} />
                                            Edit Profile
                                            <ArrowRight
                                                size={17}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="border-purple-100 bg-white dark:border-[#49375F] dark:bg-[#211a30] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-[#211D35] dark:text-white">
                            Edit Profile
                        </DialogTitle>

                        <DialogDescription className="text-[#77718B] dark:text-[#b7a9cc]">
                            Update your personal details.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleSave}
                        className="space-y-4"
                    >
                        {/* Name */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="profile-name"
                                className="text-[#211D35] dark:text-[#e5d9f5]"
                            >
                                Full Name
                            </Label>

                            <Input
                                id="profile-name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Your full name"
                                required
                                autoComplete="name"
                                className="h-11 rounded-xl border-purple-100 bg-white px-4 text-sm text-[#211D35] placeholder:text-[#A49BB5] focus-visible:ring-[#8F51EA] dark:border-[#49375F] dark:bg-[#30243f] dark:text-white dark:placeholder:text-[#9585aa] dark:focus-visible:ring-[#a875f5]"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="profile-email"
                                className="text-[#211D35] dark:text-[#e5d9f5]"
                            >
                                Email
                            </Label>

                            <Input
                                id="profile-email"
                                value={profile.email}
                                disabled
                                className="h-11 rounded-xl border-purple-100 bg-purple-50/60 px-4 text-sm text-[#77718B] disabled:opacity-100 dark:border-[#49375F] dark:bg-[#30243f] dark:text-[#a99bbd]"
                            />

                            <p className="text-xs text-[#9389A8] dark:text-[#a99bbd]">
                                This is your sign-in email and can&apos;t be
                                changed here.
                            </p>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="profile-phone"
                                className="text-[#211D35] dark:text-[#e5d9f5]"
                            >
                                Phone Number
                            </Label>

                            <Input
                                id="profile-phone"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        phone: e.target.value,
                                    }))
                                }
                                placeholder="+880 1712 345678"
                                required
                                autoComplete="tel"
                                className="h-11 rounded-xl border-purple-100 bg-white px-4 text-sm text-[#211D35] placeholder:text-[#A49BB5] focus-visible:ring-[#8F51EA] dark:border-[#49375F] dark:bg-[#30243f] dark:text-white dark:placeholder:text-[#9585aa] dark:focus-visible:ring-[#a875f5]"
                            />
                        </div>

                        <DialogFooter className="mt-6 gap-2 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditOpen(false)}
                                disabled={saving}
                                className="h-11 rounded-xl border-purple-200 bg-white px-5 text-sm font-semibold text-[#4D475E] transition hover:bg-purple-50 dark:border-[#59456f] dark:bg-[#30243f] dark:text-[#e5d9f5] dark:hover:bg-[#3b2c4e]"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={saving}
                                className="h-11 rounded-xl bg-gradient-to-r from-[#8F51EA] to-[#F86FC4] px-6 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:from-[#7940D0] hover:to-[#E85FB4] dark:shadow-purple-950/40"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}