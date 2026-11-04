import { parseJsonField, trimKeys } from "./json";

export const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

export type GuestReview = {
    name: string;
    rating: number;
    comment: string;
    date: string;
};

export type StudioHost = {
    name: string;
    email: string;
    photo: string;
};

export type StudioAvailability = {
    openingTime: string;
    closingTime: string;
};

export type Studio = {
    _id: string;
    title: string;
    imageUrl: string;
    category: string;
    pricePerHour: number;
    rating: number;
    location: string;
    /** Number of reviews, used by the studio cards. */
    reviews?: number;
    totalReviews?: number;
    description?: string;
    gallery?: string[];
    amenities?: string[];
    maxCapacity?: number;
    securityDeposit?: number;
    host?: StudioHost;
    availability?: StudioAvailability;
    guestReviews?: GuestReview[];
};

/** Parses values the API may return as JSON-encoded strings. */
function parseMaybeJson<T>(value: unknown, fallback: T): T {
    return parseJsonField(value, fallback);
}

function toNumber(value: unknown, fallback = 0): number {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    return fallback;
}

function toOptionalNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === "") {
        return undefined;
    }

    const parsed = toNumber(value, Number.NaN);
    return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * The API sometimes stores image URLs inside malformed strings such as
 * `image: "https://…"`. Extract the first usable URL instead of rendering it.
 */
function sanitizeImageUrl(value: unknown): string {
    if (typeof value !== "string") {
        return "";
    }

    const trimmed = value.trim();

    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    const match = trimmed.match(/https?:\/\/[^\s"'`]+/i);
    return match ? match[0] : "";
}

function uniqueImages(values: unknown[]): string[] {
    return values
        .map(sanitizeImageUrl)
        .filter((image) => image.length > 0)
        .filter((image, index, list) => list.indexOf(image) === index);
}

function normalizeFields(raw: unknown): Record<string, unknown> {
    if (!raw || typeof raw !== "object") {
        return {};
    }

    // One API record stores the host under a key with a leading space.
    return trimKeys(raw as Record<string, unknown>);
}

function normalizeHost(value: unknown) {
    const host = parseMaybeJson<Record<string, unknown> | null>(value, null);

    if (!host || typeof host !== "object") {
        return undefined;
    }

    const name = String(host?.name ?? "").trim();
    if (!name) {
        return undefined;
    }

    return {
        name,
        email: String(host?.email ?? "").trim(),
        photo: sanitizeImageUrl(host?.photo),
    };
}

function normalizeAvailability(
    value: unknown
): StudioAvailability | undefined {
    const availability = parseMaybeJson<Record<string, unknown> | null>(
        value,
        null
    );

    if (!availability || typeof availability !== "object") {
        return undefined;
    }

    const openingTime = String(availability.openingTime ?? "").trim();
    const closingTime = String(availability.closingTime ?? "").trim();

    if (!openingTime && !closingTime) {
        return undefined;
    }

    return { openingTime, closingTime };
}

function normalizeReviews(value: unknown): GuestReview[] {
    const parsed = parseMaybeJson<unknown>(value, []);

    if (!Array.isArray(parsed)) {
        return [];
    }

    return parsed
        .map((entry) => {
            const review = normalizeFields(entry);
            const name = String(review.name ?? "").trim();
            const comment = String(review.comment ?? "").trim();

            if (!name && !comment) {
                return undefined;
            }

            return {
                name: name || "Anonymous",
                rating: toNumber(review.rating),
                comment,
                date: String(review.date ?? "").trim(),
            } satisfies GuestReview;
        })
        .filter((review): review is GuestReview => Boolean(review));
}

function normalizeStringList(value: unknown): string[] {
    const parsed = parseMaybeJson<unknown>(value, []);

    if (!Array.isArray(parsed)) {
        return [];
    }

    return parsed
        .map((entry) => String(entry ?? "").trim())
        .filter((entry) => entry.length > 0);
}

export function normalizeStudio(raw: unknown): Studio {
    const fields = normalizeFields(raw);

    const imageUrl = sanitizeImageUrl(fields.imageUrl ?? fields.image);
    const gallery = normalizeStringList(fields.gallery);
    const guestReviews = normalizeReviews(fields.reviews);

    const totalReviews =
        toOptionalNumber(fields.totalReviews) ??
        (guestReviews.length > 0 ? guestReviews.length : undefined);

    return {
        _id: String(fields._id ?? ""),
        title: String(fields.title ?? "Untitled studio").trim(),
        imageUrl,
        category: String(fields.category ?? "Studio").trim(),
        pricePerHour: toNumber(fields.pricePerHour),
        rating: toNumber(fields.rating),
        location: String(fields.location ?? "").trim(),
        reviews: totalReviews,
        totalReviews,
        description: String(fields.description ?? "").trim() || undefined,
        gallery: uniqueImages(gallery).filter((image) => image !== imageUrl),
        amenities: normalizeStringList(fields.amenities),
        maxCapacity: toOptionalNumber(fields.maxCapacity),
        securityDeposit: toOptionalNumber(fields.securityDeposit),
        host: normalizeHost(fields.host),
        availability: normalizeAvailability(fields.availability),
        guestReviews,
    };
}

/**
 * Loads every studio from the API.
 * Data is intentionally uncached so newly added studios show up right away.
 */
export async function getStudios(): Promise<Studio[]> {
    const res = await fetch(`${API_URL}/studios`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to load studios (${res.status})`);
    }

    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
        return [];
    }

    return data.map(normalizeStudio);
}

/**
 * A studio record straight from the API: keys are normalised, but field values
 * may still be JSON- or JS-literal-encoded strings for the view to parse.
 */
export type RawStudio = Studio & Record<string, unknown>;

/** Finds a single studio by its database id. */
export async function getStudioById(
    id: string
): Promise<RawStudio | undefined> {
    const res = await fetch(`${API_URL}/studios/${encodeURIComponent(id)}`, {
        cache: "no-store",
    });

    if (res.status === 404) {
        return undefined;
    }

    if (!res.ok) {
        throw new Error(`Failed to load studio (${res.status})`);
    }

    const data: unknown = await res.json();

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return undefined;
    }

    // Normalise keys (one record stores `" host"` with a leading space) while
    // keeping the raw field values for the detail view to parse.
    return trimKeys(data) as RawStudio;
}
