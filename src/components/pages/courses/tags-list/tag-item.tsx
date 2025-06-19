import { Badge } from "@/components/ui/badge"
import { CourseTag } from "@/generated/prisma";


type TagItemProps = {
    tag: CourseTag;
}

export const TagItem = ({ tag }: TagItemProps) => {
    return (
        <Badge>{tag.name}</Badge>
    )
}