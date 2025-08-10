"use server"

import { prisma } from "@/lib/prisma";

const getLastSevenDays = () => {

    const dates = []

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date);
    }
    return dates;
}

export const getNewUsersStats = async (): Promise<StatsChartData[]> => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const users = await prisma.user.groupBy({
        by: ['createdAt'],
        where: {
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        _count: {
            _all: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
    const lastSevenDays = getLastSevenDays();
    const userCounts = new Map(
        users.map((user) => [user.createdAt.toISOString().split('T')[0], user._count._all])
    )
    console.log(userCounts);

    return lastSevenDays.map((date) => ({
        date,
        count: userCounts.get(date.toISOString().split('T')[0]) || 0
    }))
};


export const getPurchasedCoursesStats = async (): Promise<StatsChartData[]> => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const purchases = await prisma.coursePurchase.groupBy({
        by: ['createdAt'],
        where: {
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        _count: {
            _all: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
    const lastSevenDays = getLastSevenDays();
    const purchasesCounts = new Map(
        purchases.map((purchase) => [purchase.createdAt.toISOString().split('T')[0], purchase._count._all])
    )
    console.log(purchasesCounts);

    return lastSevenDays.map((date) => ({
        date,
        count: purchasesCounts.get(date.toISOString().split('T')[0]) || 0
    }))
};
