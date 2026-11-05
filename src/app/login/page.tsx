
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

import {
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";

import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Get the intended destination, or go to homepage.
    const getRedirectPath = () => {
        const params = new URLSearchParams(window.location.search);
        const callbackURL = params.get("callbackUrl");

        if (
            callbackURL?.startsWith("/") &&
            !callbackURL.startsWith("//")
        ) {
            return callbackURL;
        }

        return "/";
    };

    // Email and Password Login
    const handleLogin = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            const callbackURL = getRedirectPath();

            const { error } = await authClient.signIn.email({
                email,
                password,
                rememberMe,
            });

            if (error) {
                toast.error(
                    error.message || "Invalid email or password."
                );
                return;
            }

            toast.success("Login successful!");

            router.push(callbackURL);
            router.refresh();

        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Google Login
    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);

            const callbackURL = getRedirectPath();

            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL,
            });

            if (error) {
                toast.error(
                    error.message || "Unable to login with Google."
                );
                setGoogleLoading(false);
            }

        } catch {
            toast.error("Unable to login with Google.");
            setGoogleLoading(false);
        }
    };

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

                {/* Login Card */}
                <section className="flex w-full max-w-[430px] items-center justify-center">
                    <div className="w-full rounded-2xl border border-white/70 bg-white/90 p-6 shadow-2xl shadow-purple-300/40 backdrop-blur-md sm:p-8">

                        {/* Heading */}
                        <div className="mb-7 text-center">
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#211D35] sm:text-4xl">
                                Welcome{" "}
                                <span className="text-[#8F51EA]">
                                    Back!
                                </span>
                            </h1>

                            <p className="mt-2 text-sm text-[#77718B]">
                                Sign in to access your account
                            </p>
                        </div>

                        {/* Login / Register Tabs */}
                        <div className="mb-6 grid grid-cols-2 border-b border-purple-100">
                            <Link
                                href="/login"
                                className="border-b-2 border-[#8F51EA] py-3 text-center text-sm font-bold text-[#8F51EA]"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="py-3 text-center text-sm font-semibold text-[#77718B] transition hover:text-[#8F51EA]"
                            >
                                Register
                            </Link>
                        </div>

                        {/* Login Form */}
                        <form
                            onSubmit={handleLogin}
                            className="space-y-4"
                        >

                            {/* Email */}
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#77718B]"
                                />

                                <Input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Email Address"
                                    required
                                    autoComplete="email"
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
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Password"
                                    required
                                    autoComplete="current-password"
                                    className="h-12 rounded-xl border-purple-100 bg-white pl-11 pr-12 text-sm text-[#211D35] placeholder:text-[#A49BB5] focus-visible:ring-[#8F51EA]"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9389A8] transition hover:text-[#8F51EA]"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            {/* Remember Me / Forgot Password */}
                            <div className="flex items-center justify-between gap-3 text-xs">
                                <label className="flex cursor-pointer items-center gap-2 text-[#77718B]">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(e.target.checked)
                                        }
                                        className="h-4 w-4 accent-[#8F51EA]"
                                    />
                                    Remember me
                                </label>

                                <Link
                                    href="/forgot-password"
                                    className="font-semibold text-[#8F51EA] hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <Button
                                type="submit"
                                disabled={loading || googleLoading}
                                className="h-12 w-full rounded-xl bg-gradient-to-r from-[#8F51EA] to-[#D878F5] text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:from-[#7940D0] hover:to-[#C45BE8]"
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Login"}

                                {!loading && (
                                    <ArrowRight
                                        size={18}
                                        className="ml-2"
                                    />
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-purple-100" />

                            <span className="text-xs text-[#9389A8]">
                                or continue with
                            </span>

                            <div className="h-px flex-1 bg-purple-100" />
                        </div>

                        {/* Google Login */}
                        <Button
                            type="button"
                            variant="outline"
                            disabled={googleLoading || loading}
                            onClick={handleGoogleLogin}
                            className="h-12 w-full rounded-xl border-purple-200 bg-white text-sm font-semibold text-[#211D35] transition hover:bg-purple-50"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                className="mr-2 h-5 w-5 shrink-0"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M23.64 12.2045c0-.6381-.0573-1.2518-.1636-1.8409H12v3.4818h6.5218c-.2809 1.5045-1.1355 2.7736-2.4164 3.6273v3.0164h3.9109c2.2882-2.1082 3.6027-5.2145 3.6027-8.8846z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 24c3.27 0 6.015-1.0882 8.0209-2.9455l-3.9109-3.0164c-1.0882.73-2.4791 1.1618-4.11 1.1618-3.1582 0-5.8309-2.13-6.7909-5.0018H1.1564v3.12C3.1527 21.3136 7.2218 24 12 24z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.2091 14.1982c-.24-.72-.3764-1.4891-.3764-2.28s.1364-1.56.3764-2.28V6.5182H1.1564C.4227 7.9727 0 9.6409 0 11.3773s.4227 3.4045 1.1564 4.8591l4.0527-3.0382z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 4.7455c1.7782 0 3.3709.6109 4.6227 1.8136l3.4636-3.4636C17.9918 1.1564 15.24 0 12 0 7.2218 0 3.1527 2.6864 1.1564 6.5182l4.0527 3.12C6.1691 6.7455 8.8418 4.7455 12 4.7455z"
                                />
                            </svg>

                            {googleLoading
                                ? "Connecting..."
                                : "Continue with Google"}
                        </Button>

                        {/* Register Link */}
                        <p className="mt-7 text-center text-xs text-[#77718B]">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-bold text-[#8F51EA] hover:underline"
                            >
                                Register
                            </Link>
                        </p>

                    </div>
                </section>
            </div>
        </main>
    );
}
