import {
    BadgeCheck,
    Clock,
    Headphones,
    ShieldCheck,
    type LucideIcon,
} from "lucide-react";

const DESCRIPTION =
    "We're committed to providing a safe, reliable, and inspiring " +
    "platform for your creative journey.";

type Feature = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const FEATURES: Feature[] = [
    {
        icon: ShieldCheck,
        title: "Secure Booking",
        description: "A safe and reliable booking experience.",
    },
    {
        icon: BadgeCheck,
        title: "Verified Spaces",
        description: "Find quality creative studios.",
    },
    {
        icon: Clock,
        title: "Flexible Scheduling",
        description: "Book spaces at convenient times.",
    },
    {
        icon: Headphones,
        title: "Dedicated Support",
        description: "Get help when you need it.",
    },
];

function Decorations() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#E4D4FF]/70 blur-2xl" />
            <div className="absolute -bottom-32 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#E9DCFF]/70 blur-2xl" />
        </div>
    );
}

function Eyebrow() {
    return (
        <div className="relative inline-flex items-center">
            <span className="px-5 py-2 text-4xl font-semibold text-[#8F51EA]">
                Why Choose Us?
            </span>
        </div>
    );
}

function Heading() {
    return (
        <h2 className="text-3xl font-bold tracking-tight text-[#211D35] sm:text-4xl lg:text-5xl">
            Your Trust,{" "}
            <span className="bg-gradient-to-r from-[#8F51EA] to-[rgb(254,83,187)] bg-clip-text text-transparent">
                Our Priority
            </span>
        </h2>
    );
}

function Description() {
    return (
        <p className="mx-auto max-w-2xl text-base leading-7 text-[#77718B] sm:text-lg">
            {DESCRIPTION}
        </p>
    );
}

function FeatureCard({ icon: Icon, title, description }: Feature) {
    return (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-purple-100 bg-white/80 p-7 text-center shadow-[0_4px_20px_rgba(143,81,234,0.08)] backdrop-blur-sm transition hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(143,81,234,0.18)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#A36FF5] to-[#7940D0] text-white shadow-lg shadow-purple-200">
                <Icon size={28} strokeWidth={2.2} />
            </div>

            <h3 className="text-lg font-bold text-[#211D35]">{title}</h3>

            <p className="text-sm leading-6 text-[#77718B]">{description}</p>
        </div>
    );
}

export default function WhyChooseUs() {
    return (
        <section id="why-choose" className="relative w-full overflow-hidden bg-gradient-to-b from-[#F8F5FF] to-[#F1E9FE]">
            <Decorations />

            <div className="relative mx-auto flex max-w-[1500px] flex-col items-center gap-6 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
                <Eyebrow />
                <Heading />
                <Description />

                <div className="mt-6 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
