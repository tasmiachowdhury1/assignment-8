import Image from "next/image";
import Link from "next/link";
const BADGE_TEXT = "Your Creative Space Starts Here";

const DESCRIPTION =
    "Discover, book, and create in inspiring spaces " +
    "around you. Find the perfect studio for your " +
    "next creative project.";

const HERO_IMAGE = {
    src: "/images/hero.png",
    alt: "Creative workspace at StudioSpace",
    width: 1648,
    height: 928,
} as const;
function Badge() {
    return (
        <span className="inline-block rounded-full bg-[#F0E8FF] px-4 py-2 text-sm font-semibold text-[#8F51EA]">
            {BADGE_TEXT}
        </span>
    );
}

function Heading() {
    return (
        <h1 className="text-4xl font-bold leading-tight text-[#211D35] sm:text-5xl lg:text-6xl">
            Find Your
            <span className="block text-[#8F51EA]">Perfect Studio</span>
        </h1>
    );
}

function Description() {
    return (
        <p className="max-w-lg text-base leading-7 text-[#77718B] sm:text-lg">
            {DESCRIPTION}
        </p>
    );
}

function CallToActions() {
    return (
        <div className="flex flex-wrap gap-4">
            <Link
                href="/studios"
                className="rounded-full bg-[#8F51EA] px-7 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-1 hover:bg-[#7940D0]"
            >
                Explore Studios
            </Link>

            <Link
                href="/#how-it-works"
                className="rounded-full border border-[#8F51EA] px-7 py-3 font-semibold text-[#8F51EA] transition hover:bg-[#F0E8FF]"
            >
                How It Works
            </Link>
        </div>
    );
}

function HeroImage() {
    return (
        <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-xl shadow-purple-200/50">
                <Image
                    src={HERO_IMAGE.src}
                    alt={HERO_IMAGE.alt}
                    width={HERO_IMAGE.width}
                    height={HERO_IMAGE.height}
                    priority
                    className="h-auto w-full object-cover"
                />
            </div>
        </div>
    );
}
export default function Hero() {
    return (
        <section className="w-full overflow-hidden border-b border-purple-400 bg-[#c3affa]">
            <div className="mx-auto grid max-w-[1500px] items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:px-12 lg:py-24">

                <div className="space-y-6">
                    <Badge />
                    <Heading />
                    <Description />
                    <CallToActions />
                </div>
                <HeroImage />

            </div>
        </section>
    );
}
