import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Camera,
    EighthNotes,
    Mic,
    Palette,
    Volume2,
} from "lucide-react";

const CATEGORIES = [
    {
        name: "Photo Studios",
        slug: "photo-studios",
        description: "Professional spaces for stunning photography.",
        icon: Camera,
        gradient: "from-[#B794F6] to-[#7C3EE8]",
        image: "/images/Photo-Studios.png",
    },
    {
        name: "Sound Stages",
        slug: "sound-stages",
        description: "Record, produce and bring your audio to life.",
        icon: Volume2,
        gradient: "from-[#A78BFA] to-[#6D28D9]",
        image: "/images/Sound-Stages.png",
    },
    {
        name: "Podcast Rooms",
        slug: "podcast-rooms",
        description: "Create, record and share your podcast.",
        icon: Mic,
        gradient: "from-[#C084FC] to-[#9333EA]",
        image: "/images/Podcast-Rooms.png",
    },
    {
        name: "Music Suites",
        slug: "music-suites",
        description: "Produce and perform in world-class spaces.",
        icon: EighthNotes,
        gradient: "from-[#818CF8] to-[#6366F1]",
        image: "/images/Music-Suites.png",
    },
    {
        name: "Art Workshops",
        slug: "art-workshops",
        description: "Get creative in inspiring art spaces.",
        icon: Palette,
        gradient: "from-[#F0ABFC] to-[#D946EF]",
        image: "/images/Art-Workshops.png",
    },
] as const;

type Category = (typeof CATEGORIES)[number];

function Background() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#D6C3FA]/70 via-[#E4D5FC]/50 to-transparent" />
            <div className="absolute -left-10 -top-24 h-[260px] w-[260px] rounded-full bg-[#CDB2F7]/40" />
            <div className="absolute -right-40 top-1/4 h-[460px] w-[460px] rounded-full bg-gradient-to-bl from-[#D9C4FB]/60 via-[#EADCFF]/40 to-transparent" />
            <div className="absolute -bottom-48 -right-24 h-[380px] w-[380px] rounded-full bg-[#D6BEF9]/40" />
        </div>
    );
}

function AccentMarks() {
    return (
        <svg
            className="absolute -right-11 -top-5 h-9 w-10 text-[#8F51EA] sm:-right-14 sm:-top-6 sm:h-11 sm:w-12"
            viewBox="0 0 56 48"
            fill="none"
            aria-hidden
        >
            <path d="M10 22 L 2 12" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M28 14 L 24 2" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M44 18 L 52 8" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
    );
}

function SectionHeading() {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-4">
                <span className="h-px w-14 bg-[#D8CCF2] sm:w-24" aria-hidden />
                <span className="rounded-full bg-[#F0E8FF] px-5 py-2 text-sm font-semibold text-[#8F51EA]">
                    Studio Categories
                </span>
                <span className="h-px w-14 bg-[#D8CCF2] sm:w-24" aria-hidden />
            </div>

            <div className="relative mt-6 inline-block">
                <h2 className="text-4xl font-extrabold tracking-tight text-[#211D35] sm:text-5xl">
                    Explore Our Studio{" "}
                    <span className="bg-gradient-to-r from-[#A26BF5] to-[#FE53BB] bg-clip-text text-transparent">
                        Types
                    </span>
                </h2>
                <AccentMarks />
            </div>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#77718B] sm:text-lg">
                Find the perfect space for your creative project.
            </p>
        </div>
    );
}

function CategoryCard({ category }: { category: Category }) {
    const Icon = category.icon;

    return (
        <Link
            href={`/studios?category=${category.slug}`}
            className="group flex flex-col items-center rounded-[28px] bg-white p-5 text-center shadow-[0_16px_40px_-22px_rgba(76,29,149,0.35)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(76,29,149,0.45)] sm:p-6"
        >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F0E7FE]">
                <Icon className="h-7 w-7 text-[#8F51EA]" strokeWidth={2.25} aria-hidden />
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#211D35] sm:text-xl">
                {category.name}
            </h3>

            <p className="mt-2 min-h-[40px] text-sm leading-5 text-[#77718B]">
                {category.description}
            </p>

            <div
                className={`relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-gradient-to-br ${category.gradient}`}
            >
                <Image
                    src={category.image}
                    alt={`${category.name} space`}
                    fill
                    sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                />

                <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8F51EA] shadow-lg transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="h-5 w-5" aria-hidden />
                </span>
            </div>
        </Link>
    );
}

export default function StudioCategories() {
    return (
        <section
            id="studio-categories"
            className="relative w-full overflow-hidden bg-gradient-to-b from-[#F9F6FF] to-[#F2ECFE]"
        >
            <Background />

            <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
                <SectionHeading />

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:mt-16">
                    {CATEGORIES.map((category) => (
                        <CategoryCard key={category.slug} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
}
