
import { Suspense } from "react";
import EditStudioClient from "./EditStudioClient";

export default function EditStudioPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#F7F4FF]">
                    <p className="text-lg font-semibold text-purple-600">
                        Loading studio details...
                    </p>
                </div>
            }
        >
            <EditStudioClient />
        </Suspense>
    );
}
