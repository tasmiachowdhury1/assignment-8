
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
    A11y,
    Autoplay,
    Keyboard,
    Navigation,
    Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const SLIDES = [
    {
        titleTop: "Turn Your Ideas",
        titleBottom: "Into Reality",
        subtitle: "Professional studios for every creator.",
        image: {
            src: "/images/slide-1.png",
            alt: "Photo studio with a camera on a tripod and softbox lights",
        },
    },
    {
        titleTop: "Capture Your",
        titleBottom: "Best Moments",
        subtitle: "Stunning studios for photography & more.",
        image: {
            src: "/images/Lavender-lit minimalist photography studio.png",
            alt: "Lavender-lit minimalist photography studio with a white backdrop",
        },
    },
    {
        titleTop: "Find Your",
        titleBottom: "Perfect Studio",
        subtitle: "Discover inspiring creative spaces near you.",
        image: {
            src: "/images/slide-3.png",
            alt: "Creator smiling while working on a laptop in a purple-lit room",
        },
    },
] as const;

type Slide = (typeof SLIDES)[number];

function AccentMarks() {
    return (
        <svg
            className="absolute -top-5 right-0 h-8 w-9 translate-x-[55%] text-[#7C3EE8] sm:-top-6 sm:h-10 sm:w-11"
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

function CallsToActions() {
    return (
        <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
                href="/studios"
                className="group inline-flex items-center gap-2 rounded-full bg-[#8F51EA] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-400/40 transition hover:-translate-y-0.5 hover:bg-[#7940D0] sm:text-base"
            >
                Explore Studios
                <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                />
            </Link>

            <Link
                href="/studios"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#7C3EE8] shadow-lg shadow-purple-300/30 transition hover:-translate-y-0.5 hover:bg-[#F0E8FF] dark:bg-[#211A30] dark:text-[#C7A5FF] dark:shadow-black/20 dark:hover:bg-[#302341] sm:text-base"
            >
                Host Your Space
            </Link>
        </div>
    );
}

function SlideContent({ slide }: { slide: Slide }) {
    return (
        <div className="relative z-10 flex min-h-[400px] flex-col justify-center py-14 pl-16 pr-6 sm:min-h-[430px] sm:pl-20 sm:pr-12 lg:min-h-[470px] lg:pl-24 lg:pr-16">
            <div className="max-w-[540px]">
                <div className="relative inline-block">
                    <h2 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-[#211D35] dark:text-white sm:text-4xl lg:text-[3.25rem]">
                        <span className="block">{slide.titleTop}</span>
                        <span className="block text-[#7C3EE8] dark:text-[#D0B5FF]">
                            {slide.titleBottom}
                        </span>
                    </h2>
                    <AccentMarks />
                </div>

                <p className="mt-4 max-w-[440px] text-base font-medium leading-6 text-[#454063] dark:text-[#E2D8F5] sm:text-lg">
                    {slide.subtitle}
                </p>

                <CallsToActions />
            </div>
        </div>
    );
}

function SlideBody({ slide, priority = false }: { slide: Slide; priority?: boolean }) {
    return (
        <div className="relative">
            <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                sizes="(min-width: 1024px) 1400px, 100vw"
                className="object-cover"
                priority={priority}
            />

            <div className="absolute inset-0 bg-[#A48AF2]/15 dark:bg-[#171020]/35" aria-hidden />

            <div
                className="absolute inset-0 bg-gradient-to-b from-[#A48AF2] via-[#A48AF2]/92 to-[#A48AF2]/60 dark:from-[#21152F]/95 dark:via-[#291B3D]/90 dark:to-[#291B3D]/65 lg:hidden"
                aria-hidden
            />

            <div
                className="absolute inset-0 hidden bg-gradient-to-r from-[#A48AF2]/95 from-10% via-[#A48AF2]/78 via-45% to-[#A48AF2]/10 to-90% dark:from-[#21152F]/95 dark:via-[#291B3D]/85 dark:to-[#291B3D]/10 lg:block"
                aria-hidden
            />

            <SlideContent slide={slide} />
        </div>
    );
}

export default function Hero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#E9DDFC] via-[#F3EDFD] to-[#F6F2FD] transition-colors duration-300 dark:from-[#15111F] dark:via-[#1B1428] dark:to-[#15111F]">
            <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
                <div className="relative overflow-hidden rounded-[24px] shadow-[0_25px_50px_-15px_rgba(76,29,149,0.4)] dark:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.65)] lg:rounded-[28px]">
                    {mounted ? (
                        <Swiper
                            modules={[A11y, Autoplay, Keyboard, Navigation, Pagination]}
                            className="hero-swiper"
                            slidesPerView={1}
                            loop
                            speed={700}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            keyboard={{ enabled: true }}
                            navigation={{
                                prevEl: ".hero-arrow-prev",
                                nextEl: ".hero-arrow-next",
                            }}
                            pagination={{ el: ".hero-pagination", clickable: true }}
                        >
                            {SLIDES.map((slide, index) => (
                                <SwiperSlide key={slide.titleTop}>
                                    <SlideBody slide={slide} priority={index === 0} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <SlideBody slide={SLIDES[0]} priority />
                    )}

                    <button
                        type="button"
                        aria-label="Previous slide"
                        className="hero-arrow-prev absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8F51EA] shadow-lg shadow-purple-300/40 transition hover:bg-[#F0E8FF] dark:bg-[#211A30] dark:text-[#D0B5FF] dark:shadow-black/30 dark:hover:bg-[#38294C] sm:left-4 sm:h-10 sm:w-10 lg:left-5 lg:h-12 lg:w-12"
                    >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                    </button>

                    <button
                        type="button"
                        aria-label="Next slide"
                        className="hero-arrow-next absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8F51EA] shadow-lg shadow-purple-300/40 transition hover:bg-[#F0E8FF] dark:bg-[#211A30] dark:text-[#D0B5FF] dark:shadow-black/30 dark:hover:bg-[#38294C] sm:right-4 sm:h-10 sm:w-10 lg:right-5 lg:h-12 lg:w-12"
                    >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                    </button>

                    <div className="hero-pagination absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center" />
                </div>
            </div>
        </section>
    );
}
