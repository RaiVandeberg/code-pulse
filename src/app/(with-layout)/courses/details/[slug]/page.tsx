import { getCourse } from "@/actions/courses";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CirclePlay, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

type CourseDetailsPageProps = {
    params: Promise<{
        slug: string;
    }>
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
    const { slug } = await params;
    const { course } = await getCourse(slug)

    if (!course) return notFound();

    return (
        <div className="grid grid-cols-[1fr,400px] gap-10">
            <section className="flex flex-col">
                <div className="flex justify-between gap-6 flex-col md:flex-row">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold mt-6 ">
                            {course.title}
                        </h1>
                        {course?.shortDescription && (
                            <p className="text-muted-foreground mt-1">
                                {course.shortDescription}
                            </p>
                        )}
                        <div className="flex items-center flex-wrap gap-2.5 mt-5">
                            {course.tags.map((tag) => (
                                <Badge key={tag.id}>{tag.name}</Badge>
                            ))}
                        </div>
                    </div>
                    <Image
                        src={course.thumbnail}
                        alt={course.title}
                        width={400}
                        height={300}
                        className="aspect-video rounded-2xl border border-primary object-cover w-full md:w-auto" />
                </div>

                <Separator className="my-6" />
                <div className="w-full grid md:grid-cols-[1fr_400px] gap-10">
                    <Tabs defaultValue="overview">
                        <TabsList className="w-full md:max-w-[300px]">
                            <TabsTrigger value="overview" className="p-3" >
                                <LayoutDashboard />
                                Visão
                            </TabsTrigger>
                            <TabsTrigger value="content" className="p-3" >
                                <CirclePlay />
                                Conteúdo
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <p>{course.description}</p>
                        </TabsContent>
                        <TabsContent value="content">
                            <p>{course.difficulty}</p>
                        </TabsContent>
                    </Tabs>
                    <div>
                        <p></p>
                    </div>
                </div>
            </section>
        </div>
    )
}
