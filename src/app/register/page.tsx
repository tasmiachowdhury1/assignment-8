
"use client";

import { useState } from "react";
import Link from "next/link";
import {
    User,
    Mail,
    Image as ImageIcon,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main
            className="relative min-h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/images/login-bg.png')",
            }}
        >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-purple-200/5" />

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen items-center justify-end px-4 py-8 sm:px-8 lg:pr-[8%]">

                {/* Registration Card */}
                <section className="flex w-full max-w-[450px] items-center justify-center">
                    <div className="w-full rounded-2xl border border-white/70 bg-white/90 p-6 shadow-2xl shadow-purple-300/40 backdrop-blur-md sm:p-8">

                        {/* Heading */}
                        <div className="mb-6 text-center">
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#211D35] sm:text-4xl">
                                Create Your{" "}
                                <span className="text-[#8F51EA]">
                                    Account!
                                </span>
                            </h1>

                            <p className="mt-2 text-sm text-[#77718B]">
                                Join StudioSpace and start creating
                            </p>
                        </div>

                        {/* Login / Register Tabs */}
                        <div className="mb-6 grid grid-cols-2 border-b border-purple-100">
                            <Link
                                href="/login"
                                className="py-3 text-center text-sm font-semibold text-[#77718B] transition hover:text-[#8F51EA]"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="border-b-2 border-[#8F51EA] py-3 text-center text-sm font-bold text-[#8F51EA]"
                            >
                                Register
                            </Link>
                        </div>

                        {/* Registration Form */}
                        <form className="space-y-4">

                            {/* Name */}
                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#77718B]"
                                />

                                <Input
                                    type="text"
                                    placeholder="Full Name"
                                    className="h-12 rounded-xl border-purple-100 bg-white pl-11 text-sm text-[#211D35] placeholder:text-[#A49BB5] focus-visible:ring-[#8F51EA]"
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#77718B]"
                                />

                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    className="h-12 rounded-xl border-purple-100 bg-white pl-11 text-sm text-[#211D35] placeholder:text-[#A49BB5] focus-visible:ring-[#8F51EA]"
                                />
                            </div>

                            {/* Photo URL */}
                            <div className="relative">
                                <ImageIcon
                                    size={18}
                                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#77718B]"
                                />

                                <Input
                                    type="url"
                                    placeholder="Photo URL"
                                    className="h-12 rounded-xl border-purple-100 bg-white pl-11 text-sm text-[#211D35] placeholder:text-[#A49BB5] focus-visible:ring-[#8F51EA]"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#77718B]"
                                />

                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="h-12 rounded-xl border-purple-100 bg-white pl-11 pr-12 text-sm text-[#211D35] placeholder:text-[#A49BB5] focus-visible:ring-[#8F51EA]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9389A8] transition hover:text-[#8F51EA]"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            {/* Password Requirements */}
                            <div className="space-y-1.5 text-xs">
                                <p className="font-semibold text-[#77718B]">
                                    Password must contain:
                                </p>

                                <p className="text-[#9389A8]">
                                    ○ At least one uppercase letter
                                </p>

                                <p className="text-[#9389A8]">
                                    ○ At least one lowercase letter
                                </p>

                                <p className="text-[#9389A8]">
                                    ○ At least 6 characters
                                </p>
                            </div>

                            {/* Register Button */}
                            <Button
                                type="button"
                                className="h-12 w-full rounded-xl bg-gradient-to-r from-[#8F51EA] to-[#D878F5] text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:from-[#7940D0] hover:to-[#C45BE8]"
                            >
                                Register
                                <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="my-5 flex items-center gap-3">
                            <div className="h-px flex-1 bg-purple-100" />

                            <span className="text-xs text-[#9389A8]">
                                or continue with
                            </span>

                            <div className="h-px flex-1 bg-purple-100" />
                        </div>

                        {/* Google Button */}
                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 w-full rounded-xl border-purple-200 bg-white text-sm font-semibold text-[#211D35] transition hover:bg-purple-50 cursor-pointer"
                        >
                            <span className="mr-2 text-lg font-bold text-[#4285F4]">
                                G
                            </span>
                            Continue with Google
                        </Button>

                        {/* Login Link */}
                        <p className="mt-6 text-center text-xs text-[#77718B]">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-bold text-[#8F51EA] hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
