import { getCourseProgress } from "@/actions/course-progress";
import { getCourse, getPurchaseCourse } from "@/actions/courses";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound, redirect } from "next/dist/client/components/navigation";


type CoursePageProps = {
    params: Promise<{
        slug: string;
    }>
}

export default async function CoursePage({ params }: CoursePageProps) {

    const { slug } = await params;
    const { course } = await getCourse(slug);
    if (!course) return notFound();

    const purchasedCourses = await getPurchaseCourse();

    const isPurchased = purchasedCourses.some((purchasedCourse) => purchasedCourse.id === course.id);


    if (!isPurchased) {
        return redirect(`/courses/details/${slug}`);
    }
    const { completedLessons } = await getCourseProgress(slug);

    const allLessons = course.modules.flatMap((module) => module.lessons);

    let lessonToRedirect = allLessons[0];

    const firstCompletedLesson = allLessons.find((lesson) => {
        const completed = completedLessons.some((completedLesson) => completedLesson.lessonId === lesson.id);
        return !completed
    })

    if (firstCompletedLesson) {
        lessonToRedirect = firstCompletedLesson;
    }

    if (lessonToRedirect) {
        redirect(
            `/courses/${slug}/${lessonToRedirect.moduleId}/lesson/${lessonToRedirect.id}`
        );
    }
    return (
        <Skeleton className="flex-1" />
    )
}