

export const queryKeys = {
    CourseProgress: (courseSlug: string) => ["course-progress", courseSlug],
    lessonComments: (lessonId: string) => ["lesson-comments", lessonId],
    purchasedCourses: ["purchased-courses"],
    courseTags: ["course-tags"],
} as const