import { LessonPlayer } from "./lesson-player";


type LessonDetailsProps = {
    lesson: CourseLesson;
}

export const LessonDetails = ({ lesson }: LessonDetailsProps) => {
    return (
        <>
            <LessonPlayer lesson={lesson} />
            <div className="p-6 flex flex-col gap-6">
                <p className="text-muted-foreground">{lesson.description}</p>

            </div>
        </>
    )
}