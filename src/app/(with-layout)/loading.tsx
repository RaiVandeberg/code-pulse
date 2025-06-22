import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
    return (
        <div className="flex items-center justify-center h-full">
            <Skeleton className="w-full flex-1" />
        </div>
    );
}
