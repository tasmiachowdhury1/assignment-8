
import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F8F3FF] px-5">
            <div className="w-full max-w-xl text-center">

                <div className="mb-6">
                    <p className="text-8xl font-extrabold tracking-tight text-purple-600 sm:text-9xl">
                        404
                    </p>
                </div>

                <h1 className="text-3xl font-bold text-[#211638] sm:text-4xl">
                    Oops! Page Not Found
                </h1>

                <p className="mx-auto mt-4 max-w-md text-gray-500 leading-7">
                    The page you're looking for doesn't exist or may have
                    been moved. Let's get you back to discovering creative
                    spaces.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>

                    <Link
                        href="/studios"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-50"
                    >
                        <Search size={18} />
                        Explore Studios
                    </Link>

                </div>

                <Link
                    href="/"
                    className="mt-8 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-purple-600"
                >
                    <ArrowLeft size={16} />
                    Return to homepage
                </Link>

                <p className="mt-12 text-xs text-gray-400">
                    © 2026 StudioSpace. All rights reserved.
                </p>

            </div>
        </main>
    );
}
