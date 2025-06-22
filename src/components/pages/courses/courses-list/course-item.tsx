
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link"


type CourseItemProps = {
    course: CourseWithModulesAndTags
};

export const CourseItem = ({ course }: CourseItemProps) => {
    return (
        <Link className="border rounded-lg bg-card overflow-hidden hover:border-primary transition-all "
            href={`/courses/details/${course.slug}`}>
            <Image
                src={course.thumbnail}
                alt={`Thumbnail do curso ${course.title}`}
                width={400}
                height={200}
                className="w-full h-[160px] object-cover "
            />
            <div className="px-3 py-3.5 flex flex-col gap-2 ">
                <h3 className="font-bold text-sm">
                    {course.title}
                </h3>
                <div className="flex gap-2 overflow-hidden mask-r-from-80%">
                    <Badge variant="outline" className="max-w-max border-primary bg-primary/10 text-primary gap-1" >
                        <Bookmark size={14} />
                        {course.modules.length} Módulos
                    </Badge>
                    {course.tags.map((tag) => (
                        <Badge key={`${course.id}-${tag.id}`} variant="outline" className="max-w-max ">
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            </div>
        </Link>
    )
}