import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout({ children }) {
    return (
        <div className="px-5">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-6xl font-bold gradient-title">Industry Insights</h1>
            </div>
            <Suspense
                fallback={
                    <div className="w-full mt-4">
                        <BarLoader width="100%" color="#6B7280" />
                    </div>
                }
            >
                {children}
            </Suspense>
        </div>
    );
}