"use client"


import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tooltip } from "@/components/ui/tooltip"
import { usePreferencesStore } from "@/stores/preferences"
import { PanelRightOpen } from "lucide-react"

import Link from "next/link"
import { useParams } from "next/navigation"


type TopDetailsProps = {
    course: CourseWithModulesAndLessons
}

export const TopDetails = ({ course }: TopDetailsProps) => {
    const params = useParams()
    const { setModulesListCollapsed, autoplay, setAutoplay } = usePreferencesStore()

    const moduleId = params.moduleId as string;
    const lessonId = params.lessonId as string;

    const currentModule = course.modules.find((module) => module.id === moduleId);
    const currentLesson = currentModule?.lessons?.find((lesson) => lesson.id === lessonId);
    return (
        <div className="w-full flex items-center gap-4 sm:gap-6 p-4 sm:border-n border-border bg-sder sticky top-0 z-10">
            <BackButton />

            <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Link href={`/courses/details/${course.slug}`}
                    className="font-semibold hover:text-primary transition-all line-clamp-1">
                    {course.title}
                </Link>
                <span className="text-muted-foreground">/</span>
                <p className="hidden sm:block line-clamp-1">{currentModule?.title}</p>

                <span className="text-muted-foreground hidden sm:block">/</span>
                <p className=" line-clamp-1">{currentLesson?.title}</p>
            </div>

            <div className="ml-auto flex items-center gap-4">
                <Tooltip content="Ativar autoplay">
                    <div className="flex items-center gap-2">
                        <span className="text-xs block sm:hidden">Ativar autoplay</span>
                        <Switch
                            checked={autoplay}
                            onCheckedChange={(checked) => setAutoplay(checked)}
                        />
                    </div>
                </Tooltip>
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setModulesListCollapsed(false)}
                    className="flex sm:hidden">
                    <PanelRightOpen />
                </Button>
            </div>
        </div>
    )
}