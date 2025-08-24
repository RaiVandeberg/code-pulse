type Course = import("@/generated/prisma").Course
type CourseTag = import("@/generated/prisma").CourseTag
type CourseModule = import("@/generated/prisma").CourseModule
type CourseLesson = import("@/generated/prisma").CourseLesson
type CompletedLesson = import("@/generated/prisma").CompletedLesson
type LessonComment = import("@/generated/prisma").LessonComment
type User = import("@/generated/prisma").User
type PlatformNotification = import("@/generated/prisma").Notification


type CourseModuleWithLessons = CourseModule & {
    lessons: CourseLesson[];
}

type CourseWithModulesAndTags = Course & {
    tags: CourseTag[];
    modules: CourseModule[];
}

type CourseWithModulesAndLessons = Course & {
    modules: CourseModuleWithLessons[];
}

type LessonCommentWithUserAndReplies = LessonComment & {
    user: User;
    replies?: LessonCommentWithUserAndReplies[];
}

type StatsChartData = {
    date: Date,
    count: number,
}

type AdminUser = User & {
    purchasedCourses: number;
    completedCourses: number;
}

type AdminComments = LessonComment & {
    user: User;
    lesson: CourseLesson & {
        module: CourseModule & {
            course: Course;
        };
    };
    repliesCount: number;
}