import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout({ children }) {
    return (
        <div className="px-5">
            
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