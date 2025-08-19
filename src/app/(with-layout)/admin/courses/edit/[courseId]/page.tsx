import { getCourse } from "@/actions/courses";
import { CourseForm } from "@/components/pages/admin/courses/course-form";
import { notFound } from "next/navigation";


type EditCoursePageProps = {
    params: Promise<{ courseId: string }>
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {

    const { courseId } = await params;

    const { course } = await getCourse(courseId, "id");

    if (!course) {
        notFound();
    }

    return <CourseForm
        initialData={{
            title: course.title,
            shortDescription: course.shortDescription ?? "",
            price: course.price,
            discountPrice: course.discountPrice ?? 0,
            description: course.description,
            difficulty: course.difficulty,
            tagIds: course.tags.map((tag) => tag.id),
            thumbnailUrl: course.thumbnail,
            modules: course.modules.map((mod) => ({
                id: mod.id,
                title: mod.title,
                description: mod.description,
                order: mod.order,
                lessons: mod.lessons.map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title,
                    description: lesson.description,
                    order: lesson.order,
                    videoId: lesson.videoId,
                    durationInMs: lesson.durationInMs,
                })),
            })),
        }}
    />
}