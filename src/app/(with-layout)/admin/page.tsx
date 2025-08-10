import { getNewUsersStats, getPurchasedCoursesStats } from "@/actions/stats";
import { StatusCharts } from "@/components/pages/admin/stats-charts";

export default async function AdminPage() {

    const newUsersStats = await getNewUsersStats();

    const purchasedCoursesStats = await getPurchasedCoursesStats();

    return (
        <StatusCharts
            newUsersStats={newUsersStats}
            purchasedCoursesStats={purchasedCoursesStats}
        />
    )
}