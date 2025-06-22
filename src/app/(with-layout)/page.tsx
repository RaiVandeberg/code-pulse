import { CoursesList } from "@/components/pages/courses/courses-list";
import { CoursesTagsList } from "@/components/pages/courses/tags-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";


type CoursesPageProps = {
  searchParams: Promise<{
    query: string;
    tags: string[];
  }>
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {

  const { query, tags } = await searchParams;
  const suspenseKey = JSON.stringify({ query, tags });
  return (

    <>
      <Suspense key={`tags-${suspenseKey}`} fallback={<Skeleton className="w-full h-[22px] min-h-[22px]" />}>
        <CoursesTagsList />
      </Suspense>

      <Suspense key={suspenseKey} fallback={<Skeleton className="flex-1" />}>
        <CoursesList query={query} tags={tags} />
      </Suspense>
    </>
  );
}
