
import { CalendarDays, Sparkles } from "lucide-react";

export default function BookingsHeader() {
    return (
        <section className="relative overflow-hidden bg-[#F8F3FF] px-6 py-14 text-center">

            {/* Background decorations */}
            <div className="absolute -left-16 top-5 h-40 w-40 rounded-full bg-purple-200/30 blur-3xl" />
            <div className="absolute -right-16 bottom-0 h-44 w-44 rounded-full bg-pink-200/40 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">

                {/* Small label */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-2 shadow-sm">
                    <CalendarDays
                        size={15}
                        className="text-purple-600"
                    />
                    <span className="text-xs font-semibold tracking-wide text-purple-700">
                        MY BOOKINGS
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold tracking-tight text-[#211638] md:text-5xl">
                    My{" "}
                    <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Bookings
                    </span>
                    <Sparkles
                        size={22}
                        className="ml-2 inline-block text-purple-400"
                    />
                </h1>

                {/* Description */}
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 md:text-base">
                    Manage your studio reservations, track booking status,
                    and keep all your creative sessions organized in one place.
                </p>

                {/* Decorative divider */}
                <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-400" />

            </div>
        </section>
    );
}
