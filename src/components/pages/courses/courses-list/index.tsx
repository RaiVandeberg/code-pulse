import { getCourses } from "@/actions/courses";
import { CourseItem } from "./course-item";

type CoursesListProps = {
    query: string;
    tags: string[] | string;
}

export const CoursesList = async ({ query, tags }: CoursesListProps) => {
    const courses = await getCourses({ query, tags });
    return (
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
                <CourseItem key={course.id} course={course} />
            ))}
        </section>
    );
};