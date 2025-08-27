import { EditorPreview } from "@/components/ui/editor";
import { LessonComments } from "./comments";
import { LessonPlayer } from "./lesson-player";


type LessonDetailsProps = {
    lesson: CourseLesson;
    nextLesson?: CourseLesson;
}

export const LessonDetails = ({ lesson, nextLesson }: LessonDetailsProps) => {
    return (
        <>
            <LessonPlayer lesson={lesson} nextLesson={nextLesson} />
            <div className="p-6 flex flex-col gap-6">
                <EditorPreview className="text-muted-foreground" value={lesson.description} />

                <LessonComments />
            </div>
        </>
    )
}