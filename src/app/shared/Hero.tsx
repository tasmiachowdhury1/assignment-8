import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const STUDIO_PHOTO = {
    src: "/images/Neon Create More Studio.png",
    alt: "Purple-lit photo studio with a neon Create More sign, softbox lights and a camera on a tripod",
};

type Polaroid = {
    src: string;
    alt: string;
    sizes: string;
    className: string;
};

const DESKTOP_POLAROIDS: Polaroid[] = [
    {
        src: "/images/Podcast-Rooms.png",
        alt: "Podcast room with two microphones and a glowing ON AIR sign",
        sizes: "215px",
        className: "left-[46%] top-[9%] w-[215px] -rotate-[4deg] lg:left-[52%] xl:left-[46%]",
    },
    {
        src: "/images/Music-Suites.png",
        alt: "Music suite with a keyboard, studio monitors and guitars",
        sizes: "235px",
        className: "left-[44.5%] top-[47%] w-[235px] rotate-[3deg]",
    },
    {
        src: "/images/Art-Workshops.png",
        alt: "Art workshop with easels, canvases and paint brushes",
        sizes: "200px",
        className: "right-[2%] top-[70%] w-[200px] -rotate-[4deg]",
    },
];

function Background() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Soft lavender canvas behind the corner blob */}
            <div className="absolute -left-32 -top-44 h-[540px] w-[600px] rounded-[50%] bg-[#E3D2FD]" />

            {/* Purple corner blob */}
            <div className="absolute -left-28 -top-40 h-[440px] w-[480px] rounded-[58%_42%_60%_40%/55%_50%_50%_45%] bg-[#C2A0F5]/90" />

            {/* White sweep that carves the wavy bottom edge of the blob */}
            <div className="absolute -left-48 top-[190px] h-[460px] w-[640px] rounded-[50%] bg-[#FCFAFF]" />

            {/* Faint tint in the bottom-left corner */}
            <div className="absolute -bottom-36 -left-28 h-[360px] w-[360px] rounded-full bg-[#E9DBFE]/50 blur-sm" />
        </div>
    );
}

function PhotoClip() {
    return (
        <svg className="absolute h-0 w-0" aria-hidden focusable="false">
            <defs>
                {/* Curve mapped to the photo container (left: 42% of the section) so the
                    image keeps the original framing (full height, sides cropped). */}
                <clipPath id="heroPhotoClip" clipPathUnits="objectBoundingBox">
                    <path d="M0.4224,0 C0.3362,0.1 0.1983,0.17 0.1293,0.28 C0.0603,0.39 0.031,0.51 0.0362,0.64 C0.0414,0.75 0.0948,0.86 0.2328,0.93 C0.3103,0.965 0.3707,0.985 0.4224,1 L1,1 L1,0 Z" />
                </clipPath>
            </defs>
        </svg>
    );
}

function Swoosh() {
    return (
        <svg
            className="mt-1 h-7 w-full sm:h-8"
            viewBox="0 0 480 36"
            preserveAspectRatio="none"
            aria-hidden
        >
            <defs>
                <linearGradient id="heroSwooshGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8F51EA" />
                    <stop offset="55%" stopColor="#B14BE9" />
                    <stop offset="100%" stopColor="#FE53BB" />
                </linearGradient>
            </defs>
            <path
                d="M10 14 C90 22 250 26 370 22 C420 20 455 14 477 5 C465 20 430 30 370 33 C250 38 90 34 12 30 C5 27 5 17 10 14 Z"
                fill="url(#heroSwooshGradient)"
            />
        </svg>
    );
}

function AccentMarks({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 76 96" fill="none" aria-hidden>
            <path d="M14 62 4 42" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <path d="M44 44 34 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <path d="M70 34 62 6" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        </svg>
    );
}

function Sparkle({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden>
            <path
                d="M24 1c2.4 12.6 10.4 20.6 23 23-12.6 2.4-20.6 10.4-23 23-2.4-12.6-10.4-20.6-23-23C13.6 21.6 21.6 13.6 24 1Z"
                fill="currentColor"
            />
        </svg>
    );
}

function PolaroidFrame({ src, alt, sizes, className }: Polaroid) {
    return (
        <div
            className={`absolute rounded-[10px] bg-white p-2.5 pb-3.5 shadow-[0_18px_40px_rgba(28,14,56,0.3)] ${className}`}
        >
            <div className="relative aspect-[6/5] w-full overflow-hidden rounded-[4px] bg-[#EDE4FE]">
                <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
            </div>
        </div>
    );
}

function Badge() {
    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-[#EFE4FE] px-5 py-2.5 text-[15px] font-bold text-[#8F51EA]">
            <Star className="h-4 w-4 fill-[#8F51EA] text-[#8F51EA]" aria-hidden />
            About Us
        </span>
    );
}

function Heading() {
    return (
        <div className="relative mt-5 inline-block">
            <h1 className="whitespace-nowrap text-[2.75rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5rem]">
                <span className="text-[#211D35]">Create</span>{" "}
                <span className="bg-gradient-to-r from-[#8F51EA] via-[#B14BE9] to-[#FE53BB] bg-clip-text text-transparent">
                    More
                </span>
            </h1>

            <Swoosh />

            <AccentMarks className="absolute -right-16 -top-20 hidden h-24 w-16 text-[#8B44EE] lg:block" />
        </div>
    );
}

function Copy() {
    return (
        <>
            <p className="mt-6 text-lg font-bold leading-[1.4] text-[#211D35] sm:text-[1.375rem]">
                At StudioSpace, we&rsquo;re more than just a booking platform &mdash; we&rsquo;re a
                community for dreamers, creators, and innovators.
            </p>

            <p className="mt-6 text-base leading-7 text-[#454063] sm:text-lg">
                Our mission is to make professional studios accessible to everyone, from
                photographers and filmmakers to podcasters and artists. We believe that great ideas
                deserve the perfect space to grow.
            </p>

            <Link
                href="/studios"
                className="group mt-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#8F51EA] to-[#FE53BB] px-8 py-4 text-base font-semibold text-white shadow-[0_16px_32px_-12px_rgba(143,81,234,0.7)] transition hover:-translate-y-0.5 sm:text-lg"
            >
                Explore Studios
                <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden
                />
            </Link>
        </>
    );
}

export default function Hero() {
    return (
        <section
            id="about"
            className="relative w-full overflow-hidden bg-gradient-to-br from-[#F7F2FE] via-white to-[#F5EEFE]"
        >
            <PhotoClip />
            <Background />

            {/* Desktop photo with the wavy left edge */}
            <div
                className="absolute inset-y-0 right-0 left-[42%] hidden lg:block"
                style={{ clipPath: "url(#heroPhotoClip)" }}
                aria-hidden
            >
                <Image
                    src={STUDIO_PHOTO.src}
                    alt={STUDIO_PHOTO.alt}
                    fill
                    priority
                    sizes="90vw"
                    className="object-cover"
                />
            </div>

            {/* Floating polaroids over the desktop photo */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
            >
                {DESKTOP_POLAROIDS.map((polaroid) => (
                    <PolaroidFrame key={polaroid.src} {...polaroid} />
                ))}
            </div>

            <AccentMarks className="absolute left-[42%] top-[39%] z-10 hidden h-24 w-16 text-[#8B44EE] lg:block" />

            <Sparkle className="absolute right-[4%] top-[7%] z-10 hidden h-12 w-12 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] lg:block" />

            {/* Content */}
            <div className="relative z-20 mx-auto flex max-w-[1500px] flex-col px-6 py-14 sm:px-10 lg:min-h-[640px] lg:justify-center lg:px-10 lg:py-16 xl:px-16 2xl:px-[85px]">
                <div className="w-full max-w-[540px] lg:max-w-[400px] xl:max-w-[485px] 2xl:max-w-[510px]">
                    <Badge />
                    <Heading />
                    <Copy />
                </div>
            </div>

            {/* Mobile photo collage */}
            <div className="relative z-10 mx-6 mt-12 sm:mx-10 lg:hidden">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_24px_50px_-20px_rgba(76,29,149,0.45)]">
                    <Image
                        src={STUDIO_PHOTO.src}
                        alt={STUDIO_PHOTO.alt}
                        fill
                        sizes="(min-width: 1024px) 0px, calc(100vw - 48px)"
                        className="object-cover"
                    />
                </div>

                <PolaroidFrame
                    src="/images/Podcast-Rooms.png"
                    alt="Podcast room with two microphones and a glowing ON AIR sign"
                    sizes="180px"
                    className="absolute -top-6 right-3 w-[46%] max-w-[180px] -rotate-[4deg]"
                />
                <PolaroidFrame
                    src="/images/Art-Workshops.png"
                    alt="Art workshop with easels, canvases and paint brushes"
                    sizes="165px"
                    className="absolute -bottom-7 left-4 w-[42%] max-w-[165px] rotate-[3deg]"
                />
            </div>
        </section>
    );
}
