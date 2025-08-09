import { getPurchaseCoursesWithDetails } from "@/actions/courses";
import { CourseItem } from "@/components/pages/courses/courses-list/course-item";

export default async function PurchasedCoursePage() {

    const courses = await getPurchaseCoursesWithDetails();
    return (
        <>
            <h1 className="text-2xl font-bold">Meus Cursos</h1>
            <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                    <CourseItem key={course.id} course={course} redirectTo="lessons" />
                ))}
            </section>
        </>
    )
}