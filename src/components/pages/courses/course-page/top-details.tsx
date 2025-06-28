import { BackButton } from "@/components/ui/back-button"

import Link from "next/link"

type TopDetailsProps = {
    course: Course
}

export const TopDetails = ({ course }: TopDetailsProps) => {
    return (
        <div className="w-full flex items-center gap-4 sm:gap-6 p-4 sm:border-n border-border bg-sder sticky top-0 z-10">
            <BackButton />

            <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Link href={`/courses/details/${course.slug}`}
                    className="font-semibold hover:text-primary transition-all line-clamp-1">
                    {course.title}
                </Link>
                <span className="text-muted-foreground">/</span>
                <p className="hidden sm:block line-clamp-1">Título do módulo</p>

                <span className="text-muted-foreground hidden sm:block">/</span>
                <p className=" line-clamp-1">Título da aula</p>
            </div>

            <div className="ml-auto flex items-center gap-4">

            </div>
        </div>
    )
}