
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                type="button"
                aria-label="Change theme"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-white text-[#8F51EA] dark:border-[#49375F] dark:bg-[#211A30] dark:text-yellow-300"
            >
                <Sun size={19} />
            </button>
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-white text-[#8F51EA] transition hover:bg-purple-50 dark:border-[#49375F] dark:bg-[#211A30] dark:text-yellow-300 dark:hover:bg-[#302341]"
        >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
    );
}
