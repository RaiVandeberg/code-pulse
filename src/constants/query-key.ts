import { CourseProgress } from "@/components/pages/courses/course-details/course-progress";

export const queryKeys = {
    CourseProgress: (courseSlug: string) => ["course-progress", courseSlug],
} as const