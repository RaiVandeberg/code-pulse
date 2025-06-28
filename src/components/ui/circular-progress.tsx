import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type CircularProgressProps = ComponentProps<"svg"> & {
    progress: number;
};

export const CircularProgress = ({
    progress,
    className,
    ...props
}: CircularProgressProps) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress / 100);

    return (
        <svg
            {...props}
            className={cn("transform -rotate-90", className)}
            width="100"
            height="100"
            viewBox="0 0 100 100"
            version="1.1"
        >
            <circle
                r={radius}
                cx="50"
                cy="50"
                fill="transparent"
                className="text-transparent"
                stroke="currentColor"
                strokeWidth="8"
            />
            <circle
                r={radius}
                cx="50"
                cy="50"
                className="text-primary"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.35s" }}
            />
        </svg>
    );
};
