

export const queryKeys = {
    CourseProgress: (courseSlug: string) => ["course-progress", courseSlug],
    lessonComments: (lessonId: string) => ["lesson-comments", lessonId]
} as const