type Course = import("@/generated/prisma").Course
type CourseTag = import("@/generated/prisma").CourseTag
type CourseModule = import("@/generated/prisma").CourseModule

type CourseWithModulesAndTags = Course & {
    tags: CourseTag[];
    modules: CourseModule[];
}