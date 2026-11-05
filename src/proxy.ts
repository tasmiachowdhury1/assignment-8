import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./app/lib/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    const user = session?.user;

    if (!user) {
        const loginUrl = new URL("/login", request.url);

        // After login, return to the booking page
        loginUrl.searchParams.set(
            "callbackUrl",
            request.nextUrl.pathname + request.nextUrl.search
        );

        return NextResponse.redirect(loginUrl);
    }

    // Allow logged-in users to continue
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/add-newstudio",
        "/my-booking",
        "/my-listings",
        "/studios/edit/:path*",
    ],
};