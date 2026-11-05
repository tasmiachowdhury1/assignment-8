import { MongoClient } from "mongodb";
import { normalizeStudio, type Studio } from "./api";
import { io } from "next/cache";

const DATABASE_NAME = "studioSpace";

// Defer MongoClient construction until first use so that the module import
// phase does not trigger Next.js prerender warnings for unstable values.
let cachedClient: MongoClient | undefined;
let cachedDb: ReturnType<MongoClient["db"]> | undefined;

async function ensureClient(): Promise<MongoClient> {
    // Suspend prerender so synchronous DB drivers / MongoClient init happen
    // at request time rather than during the static shell.
    await io();

    if (!cachedClient) {
        cachedClient = new MongoClient(process.env.MONGODB_URL!);
        await cachedClient.connect();
        cachedDb = cachedClient.db(DATABASE_NAME);
    }

    return cachedClient;
}

/**
 * Loads the top-rated studio spaces straight from MongoDB (newest first as a
 * tie-break). Data is intentionally uncached so newly added studios show up
 * right away.
 */
export async function getFeaturedStudios(limit = 6): Promise<Studio[]> {
    const client = await ensureClient();

    const docs = await client
        .db(DATABASE_NAME)
        .collection("studios")
        .find({})
        .sort({ rating: -1, _id: -1 })
        .limit(limit)
        .toArray();

    return docs.map((doc) => normalizeStudio(doc));
}