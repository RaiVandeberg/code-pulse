type Course = import("@/generated/prisma").Course
type CourseTag = import("@/generated/prisma").CourseTag
type CourseModule = import("@/generated/prisma").CourseModule
type CourseLesson = import("@/generated/prisma").CourseLesson

type CourseWithModulesAndTags = Course & {
    tags: CourseTag[];
    modules: CourseModule[];
}