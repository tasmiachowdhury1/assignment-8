/**
 * Parsing helpers shared by the API layer and the studio detail UI.
 *
 * The backend stores several fields (`host`, `reviews`, `availability`) as
 * JavaScript object literals instead of JSON: keys are unquoted, strings may
 * use single quotes, and trailing commas are allowed. `JSON.parse` rejects all
 * of that, so those values have to be converted before parsing.
 */

/** Rewrites a JavaScript object/array literal so it can be parsed as JSON. */
function jsLiteralToJson(text: string): string {
    let out = "";
    let index = 0;

    while (index < text.length) {
        const char = text[index];

        // Copy string literals verbatim, normalising quotes to double quotes.
        if (char === '"' || char === "'") {
            const quote = char;
            let cursor = index + 1;
            let value = "";

            while (cursor < text.length) {
                const current = text[cursor];

                if (current === "\\") {
                    const escaped = text.slice(cursor, cursor + 2);

                    // `\'` is not a valid JSON escape, but is legal in JS.
                    value += quote === "'" && escaped === "\\'" ? "'" : escaped;
                    cursor += 2;
                    continue;
                }

                if (current === quote) {
                    cursor += 1;
                    break;
                }

                if (quote === "'" && current === '"') {
                    value += '\\"';
                    cursor += 1;
                    continue;
                }

                value += current;
                cursor += 1;
            }

            out += `"${value}"`;
            index = cursor;
            continue;
        }

        // Quote bare keys: `{ name: "x" }` becomes `{ "name": "x" }`.
        if (/[A-Za-z_$]/.test(char)) {
            let cursor = index;

            while (cursor < text.length && /[\w$]/.test(text[cursor])) {
                cursor += 1;
            }

            const word = text.slice(index, cursor);
            let lookahead = cursor;

            while (lookahead < text.length && /\s/.test(text[lookahead])) {
                lookahead += 1;
            }

            if (text[lookahead] === ":") {
                out += `"${word}"`;
            } else if (word === "undefined") {
                out += "null";
            } else {
                out += word;
            }

            index = cursor;
            continue;
        }

        // Drop trailing commas: `{ a: 1, }` becomes `{ a: 1 }`.
        if (char === ",") {
            let lookahead = index + 1;

            while (lookahead < text.length && /\s/.test(text[lookahead])) {
                lookahead += 1;
            }

            if (text[lookahead] === "}" || text[lookahead] === "]") {
                index += 1;
                continue;
            }
        }

        out += char;
        index += 1;
    }

    return out;
}

/**
 * Parses a field the API may return as JSON, as a JSON-encoded string, or as a
 * JavaScript object literal. Returns `fallback` when nothing can be parsed.
 */
export function parseJsonField<T>(value: unknown, fallback: T): T {
    if (value == null) {
        return fallback;
    }

    let parsed: unknown = value;

    // Handle normal and double-encoded JSON strings.
    for (let depth = 0; depth < 3 && typeof parsed === "string"; depth++) {
        const text = parsed.trim();

        if (!text) {
            return fallback;
        }

        let next: unknown;

        try {
            next = JSON.parse(text);
        } catch {
            const loose = jsLiteralToJson(text);
            const candidates = [loose];

            // Tolerate a bare `key: value` list with no surrounding braces.
            if (loose.includes(":") && !/^[{[]/.test(loose)) {
                candidates.push(`{${loose}}`);
            }

            for (const candidate of candidates) {
                try {
                    next = JSON.parse(candidate);
                    break;
                } catch {
                    // Try the next candidate.
                }
            }
        }

        if (next === undefined) {
            return fallback;
        }

        parsed = next;
    }

    return (parsed ?? fallback) as T;
}

/**
 * Copies an object with every key trimmed. One API record stores its host
 * under a key with a leading space (`" host"`), which would otherwise be
 * invisible to `record.host` lookups.
 */
export function trimKeys<T>(value: T): T {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return value;
    }

    return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
            key.trim(),
            entry,
        ])
    ) as T;
}
