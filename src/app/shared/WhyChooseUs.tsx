import {
    BadgeCheck,
    Clock,
    Headphones,
    ShieldCheck,
    Sparkles,
    ArrowUpRight,
    type LucideIcon,
} from "lucide-react";

const DESCRIPTION =
    "We're committed to providing a safe, reliable, and inspiring " +
    "platform for your creative journey.";

type Feature = {
    icon: LucideIcon;
    title: string;
    description: string;
    number: string;
};

const FEATURES: Feature[] = [
    {
        icon: ShieldCheck,
        title: "Secure Booking",
        description:
            "Enjoy a safe and reliable booking experience with a smooth and protected process.",
        number: "01",
    },
    {
        icon: BadgeCheck,
        title: "Verified Spaces",
        description:
            "Discover quality creative studios that meet your expectations.",
        number: "02",
    },
    {
        icon: Clock,
        title: "Flexible Scheduling",
        description:
            "Choose the hours that work best for your projects and busy schedule.",
        number: "03",
    },
    {
        icon: Headphones,
        title: "Dedicated Support",
        description:
            "Our support team is here to help whenever you need assistance.",
        number: "04",
    },
];

function Background() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            <div className="absolute -left-32 -top-32 h-[380px] w-[380px] rounded-full bg-[#DCC9FC]/60 blur-3xl dark:bg-[#704A9D]/15" />

            <div className="absolute right-[-120px] top-1/3 h-[400px] w-[400px] rounded-full bg-[#EBD9FF]/70 blur-3xl dark:bg-[#704A9D]/15" />

            <div className="absolute bottom-[-180px] left-1/3 h-[350px] w-[350px] rounded-full bg-[#DCC5FA]/50 blur-3xl dark:bg-[#8056B5]/10" />
        </div>
    );
}

function Badge() {
    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F0E8FF] px-5 py-2 text-sm font-semibold text-[#8F51EA] dark:bg-[#302341] dark:text-[#C4A9F7]">
            <Sparkles
                size={16}
                className="fill-[#8F51EA]/20 dark:text-[#C4A9F7]"
                aria-hidden
            />
            Why Choose Us?
        </span>
    );
}

function Heading() {
    return (
        <div className="relative">
            <h2 className="text-4xl font-extrabold tracking-tight text-[#211D35] dark:text-[#F5F0FF] sm:text-5xl">
                Your Trust,{" "}
                <span className="bg-gradient-to-r from-[#A26BF5] to-[#FE53BB] bg-clip-text text-transparent">
                    Our Priority
                </span>
            </h2>

            <Sparkles
                className="absolute -right-9 -top-7 hidden h-8 w-8 text-[#A26BF5] dark:text-[#C4A9F7] lg:block"
                aria-hidden
            />
        </div>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    description,
    number,
}: Feature) {
    return (
        <article className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-[26px] border border-purple-100/80 bg-white/85 p-7 shadow-[0_12px_35px_-18px_rgba(143,81,234,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-[0_20px_40px_-18px_rgba(143,81,234,0.4)] dark:border-[#49375F] dark:bg-[#211A30]/90 dark:shadow-black/20 dark:hover:border-[#7955A5] dark:hover:shadow-purple-950/30 sm:p-8">

            {/* Background decoration */}
            <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#EDE2FE] to-[#F9E9FF] opacity-70 transition-transform duration-500 group-hover:scale-125 dark:from-[#49316C] dark:to-[#302341]" />

            {/* Card number */}
            <div className="relative flex items-center justify-between">
                <div className="flex h-[62px] w-[62px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#A26BF5] to-[#7940D0] text-white shadow-lg shadow-purple-200 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 dark:shadow-purple-950/40">
                    <Icon size={28} strokeWidth={2.1} />
                </div>

                <span className="text-4xl font-extrabold tracking-tight text-[#E9DDFB] dark:text-[#49375F]">
                    {number}
                </span>
            </div>

            {/* Card content */}
            <div className="relative mt-7">
                <h3 className="text-xl font-bold text-[#211D35] transition-colors group-hover:text-[#8F51EA] dark:text-[#F5F0FF] dark:group-hover:text-[#C4A9F7]">
                    {title}
                </h3>

                <p className="mt-3 text-[15px] leading-7 text-[#77718B] dark:text-[#B6AFC7]">
                    {description}
                </p>
            </div>

            {/* Bottom accent */}
            <div className="relative mt-auto flex justify-end pt-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3ECFF] text-[#8F51EA] transition-all duration-300 group-hover:bg-[#8F51EA] group-hover:text-white dark:bg-[#3A2A50] dark:text-[#C4A9F7] dark:group-hover:bg-[#8F51EA] dark:group-hover:text-white">
                    <ArrowUpRight size={19} />
                </span>
            </div>
        </article>
    );
}

export default function WhyChooseUs() {
    return (
        <section
            id="why-choose"
            className="relative w-full overflow-hidden bg-gradient-to-b from-[#F9F6FF] to-[#F2ECFE] transition-colors duration-300 dark:from-[#15111F] dark:to-[#1C1629]"
        >
            <Background />

            <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">

                {/* Section heading */}
                <div className="flex flex-col items-center text-center">
                    <Badge />

                    <div className="mt-6">
                        <Heading />
                    </div>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-[#77718B] dark:text-[#B6AFC7] sm:text-lg">
                        {DESCRIPTION}
                    </p>
                </div>

                {/* Feature cards */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-7">
                    {FEATURES.map((feature) => (
                        <FeatureCard
                            key={feature.number}
                            {...feature}
                        />
                    ))}
                </div>

                {/* Bottom message */}
                <div className="mt-12 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
                    <ShieldCheck
                        size={19}
                        className="text-[#8F51EA] dark:text-[#C4A9F7]"
                    />
                    <p className="text-sm font-medium text-[#77718B] dark:text-[#B6AFC7]">
                        Your creative journey deserves a space you can trust.
                    </p>
                </div>
            </div>
        </section>
    );
}