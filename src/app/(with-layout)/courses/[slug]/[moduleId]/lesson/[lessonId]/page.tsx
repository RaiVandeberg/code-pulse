import { getCourse, getPurchaseCourses } from "@/actions/courses";
import { LessonDetails } from "@/components/pages/courses/course-page/lesson-details";
import { ModulesList } from "@/components/pages/courses/course-page/modules-list";
import { TopDetails } from "@/components/pages/courses/course-page/top-details";
import { notFound, redirect } from "next/dist/client/components/navigation";

type CoursePageProps = {
    params: Promise<{
        slug: string;
        moduleId: string;
        lessonId: string;
    }>
}

export default async function CoursePage({ params }: CoursePageProps) {

    const { slug, moduleId, lessonId } = await params;
    const { course } = await getCourse(slug);
    if (!course) return notFound();



    const purchasedCourses = await getPurchaseCourses();

    const isPurchased = purchasedCourses.some((purchasedCourse) => purchasedCourse.id === course.id);


    if (!isPurchased) {
        return redirect(`/courses/details/${slug}`);
    }
    const currentModule = course.modules.find((module) => module.id === moduleId);
    if (!currentModule) return notFound();

    const allLessons = course.modules.flatMap((module) => module.lessons);

    const currentLessonIndex = allLessons.findIndex((lesson) => lesson.id === lessonId);

    const currentLesson = allLessons[currentLessonIndex];
    const nextLesson = allLessons[currentLessonIndex + 1];

    if (!currentLesson) return notFound();

    return (
        <div className="w-full h-screen overflow-hidden grid grid-cols-[1fr_auto]">
            <div className="w-full h-full overflow-y-auto">
                <TopDetails course={course} />

                <LessonDetails
                    lesson={currentLesson}
                    nextLesson={nextLesson}
                />
            </div>


            <ModulesList modules={course.modules} />

        </div>
    )
}