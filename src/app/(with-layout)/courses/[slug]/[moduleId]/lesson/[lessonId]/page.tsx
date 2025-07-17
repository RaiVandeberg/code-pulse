import { getCourse } from "@/actions/courses";
import { LessonDetails } from "@/components/pages/courses/course-page/lesson-details";
import { ModulesList } from "@/components/pages/courses/course-page/modules-list";
import { TopDetails } from "@/components/pages/courses/course-page/top-details";
import { notFound } from "next/dist/client/components/navigation";

type CoursePageProps = {
    params: Promise<{
        slug: string;
    }>
}

export default async function CoursePage({ params }: CoursePageProps) {

    const { slug } = await params;
    const { course } = await getCourse(slug);
    if (!course) return notFound();


    return (
        <div className="w-full h-screen overflow-hidden grid grid-cols-[1fr_auto]">
            <div className="w-full h-full overflow-y-auto">
                <TopDetails course={course} />

                <LessonDetails lesson={course.modules[0].lessons[0]} />
            </div>


            <ModulesList modules={course.modules} />

        </div>
    )
}