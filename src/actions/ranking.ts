"use server"
import { prisma } from "@/lib/prisma"
import { formatName } from "@/lib/utils"


export const getRanking = async (): Promise<RankingUser[]> => {
    const ranking = await prisma.user.findMany({
        select: {
            id: true,
            fistName: true,
            lastName: true,
            imageUrl: true,
            _count: {
                select: {
                    completedLesson: true
                }
            }

        },
        orderBy: {
            completedLesson: {
                _count: "desc"
            }
        },
        take: 10
    });
    return ranking.map((user, index) => ({
        position: index + 1,
        id: user.id,
        name: formatName(user.fistName, user.lastName),
        imageUrl: user.imageUrl,
        completedLessons: user._count.completedLesson
    }))
}