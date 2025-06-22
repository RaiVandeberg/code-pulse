"use client"
import { Badge } from "@/components/ui/badge"
import { CourseTag } from "@/generated/prisma";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import path from "path";
import qs from "query-string";

type TagItemProps = {
    tag: CourseTag;
}

export const TagItem = ({ tag }: TagItemProps) => {

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentIds = searchParams?.getAll("tags")
    const currentQuery = searchParams?.get("query")
    const isSelected = currentIds.includes(tag.id)

    const onSelect = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                query: currentQuery,
                tags: isSelected ? currentIds.filter((id) => id !== tag.id)
                    : [...currentIds, tag.id]
            }
        }, {
            skipEmptyString: true,
            skipNull: true,
        }
        )
        router.push(url)
    }
    return (
        <Badge variant={isSelected ? "default" : "outline"} className="whitespace-nowrap hover:border-primary !cursor-pointer"
            onClick={onSelect}
        >{tag.name}</Badge>
    )
}