"use client";

import { useRouter } from "next/navigation";
import {
    Camera,
    EighthNotes,
    LayoutGrid,
    Mic,
    Palette,
    Volume2,
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const OPTIONS = [
    { value: "all", label: "All Categories", icon: LayoutGrid },
    { value: "photo-studios", label: "Photo Studios", icon: Camera },
    { value: "sound-stages", label: "Sound Stages", icon: Volume2 },
    { value: "podcast-rooms", label: "Podcast Rooms", icon: Mic },
    { value: "music-suites", label: "Music Suites", icon: EighthNotes },
    { value: "art-workshops", label: "Art Workshops", icon: Palette },
] as const;

const ITEM_LABELS: Record<string, string> = Object.fromEntries(
    OPTIONS.map((option) => [option.value, option.label]),
);

export default function SortBySelect({ value }: { value: string }) {
    const router = useRouter();

    const activeValue = OPTIONS.some((option) => option.value === value)
        ? value
        : "all";

    function handleChange(nextValue: string | null) {
        if (!nextValue || nextValue === activeValue) return;

        router.push(
            nextValue === "all" ? "/studios" : `/studios?category=${nextValue}`,
        );
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#211D35] dark:text-gray-200">
                Sort By:
            </span>

            <Select
                value={activeValue}
                onValueChange={handleChange}
                items={ITEM_LABELS}
            >
                <SelectTrigger
                    aria-label="Sort studios by category"
                    className="h-11 min-w-[210px] cursor-pointer rounded-xl border-[#D8CCF2] bg-white px-4 text-sm font-semibold text-[#211D35] shadow-sm transition hover:border-[#8F51EA] focus-visible:ring-[#8F51EA]/30 dark:border-[#49375F] dark:bg-[#211A30] dark:text-gray-200 dark:hover:border-purple-400 dark:focus-visible:ring-purple-400/30"
                >
                    <SelectValue />
                </SelectTrigger>

                <SelectContent
                    align="start"
                    className="rounded-xl border-[#E9DFF8] bg-white p-1.5 dark:border-[#49375F] dark:bg-[#211A30]"
                >
                    {OPTIONS.map((option) => {
                        const Icon = option.icon;

                        return (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className="cursor-pointer rounded-lg py-2.5 pl-3 pr-9 text-sm font-medium text-[#211D35] focus:bg-[#F0E7FE] focus:text-[#7C3AED] dark:text-gray-200 dark:focus:bg-[#352747] dark:focus:text-purple-300"
                            >
                                <Icon
                                    className="text-[#8F51EA] dark:text-purple-400"
                                    aria-hidden
                                />
                                {option.label}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}