import { markLessonAsCompleted } from "@/actions/course-progress";
import { Tooltip } from "@/components/ui/tooltip";
import { cn, formatDuration } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query";

import { CircleCheck, CircleCheckBig, CircleX, Video } from "lucide-react";
import Link from "next/link"
import { useParams } from "next/navigation";

type LessonItemProps = {
    lesson: CourseLesson & {
        completed?: boolean;
    }
}

export const LessonItem = ({ lesson }: LessonItemProps) => {

    const params = useParams()
    const courseSlug = params.slug as string;
    const currentLessonId = null;
    const completed = lesson.completed;
    const PrimaryItem = completed ? CircleCheck : Video;
    const SecondaryItem = completed ? CircleX : CircleCheckBig;
    const lessonId = lesson.id;
    const { mutate: handleCompletedLesson, isPending: isCompletingLesson } = useMutation({
        mutationFn: () => markLessonAsCompleted({ lessonId, courseSlug })
    })
    const isLoading = isCompletingLesson;

    return (
        <Link className={cn(" flex items-center gap-2 text-muted-foreground text-sm p-2 hover:bg-muted/50 transition-all rounded-md",
            lesson.id === currentLessonId && "text-white",
            completed && "text-primary"
        )}
            href={`/courses/course-slug/module-id/lesson/${lesson.id}`}>

            <Tooltip content={completed ? "Marcar aula como não assistida" : "Marcar aula como assistida"}>
                <button type="button"
                    className="w-4 min-w-4 h-4 relative group/lesson-button disabled: opacity-50 cursor-not-allowed"
                    disabled={isLoading}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();


                        if (completed) {

                            return
                        }
                        handleCompletedLesson();
                    }}>
                    <PrimaryItem className={cn("w-full h-full opacity-100 transition-all group-hover/lesson-button:opacity-0", completed && "text-primary")} />
                    <SecondaryItem className="absolute inset-0 w-full h-full opacity-0 transition-all group-hover/lesson-button:opacity-100" />
                </button>
            </Tooltip>
            <p className="line-clamp-1"> {lesson.title} </p>

            <p className=" text-xs text-muted-foreground ml-auto">
                {formatDuration(lesson.durationInMs, true)}
            </p>
        </Link>
    )
}