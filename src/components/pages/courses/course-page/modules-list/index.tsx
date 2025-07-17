"use client"

import { cn } from "@/lib/utils"
import * as Accordion from "@radix-ui/react-accordion"
import { ModulesItem } from "./module-item"
import { usePreferencesStore } from "@/stores/preferences"
import { Button } from "@/components/ui/button"
import { PanelRightOpen } from "lucide-react"
import { useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { getCourseProgress } from "@/actions/course-progress"
import { useParams } from "next/navigation"
import { queryKeys } from "@/constants/query-key"

type ModulesListProps = {
    modules: CourseModuleWithLessons[]
}


export const ModulesList = ({ modules }: ModulesListProps) => {
    const { expandModules, setExpandModules, modulesListCollapsed, setModulesListCollapsed } = usePreferencesStore()
    const initialCollapsed = useRef(false)
    const params = useParams()
    const courseSlug = params.slug as string;
    const moduleId = params.moduleId as string;

    useEffect(() => {
        if (initialCollapsed.current) return;
        initialCollapsed.current = true;
        setModulesListCollapsed(window.innerWidth < 768)
    }, [setModulesListCollapsed])


    const handleToggleCollapse = () => {
        setModulesListCollapsed(!modulesListCollapsed)

    }
    const { data: courseProgress } = useQuery({
        queryKey: queryKeys.CourseProgress(courseSlug),
        queryFn: () => getCourseProgress(courseSlug),
        enabled: !!courseSlug

    })



    const completedLessons = courseProgress?.completedLessons ?? []


    return (
        <aside className={cn("h-full border-l border-border bg-sidebar p-4 overflow-y-auto overflow-x-hidden min-w-[380px] max-w-[380px] transition-all flex flex-col items-center",
            !modulesListCollapsed && "fixed top-0 bottom-0 z-10 right-0 sm:relative",
            modulesListCollapsed && "w-18 max-w-18 min-w-18 hidden sm:flex"
        )}
        >

            <div className={cn("absolute z-10 left-0 top-0 bottom-0 w-4 flex justify-start group cursor-e-resize group",
                modulesListCollapsed && "cursor-w-resize")}
                onClick={handleToggleCollapse}>
                <div className="h-full w-0.5 group-hover:bg-sidebar-border transition-all">

                </div>
            </div>
            {modulesListCollapsed ? (
                <Button
                    size="icon"
                    variant="outline"
                    onClick={handleToggleCollapse}>
                    <PanelRightOpen />
                </Button>
            ) : (
                <>
                    <Button
                        variant="outline"
                        onClick={handleToggleCollapse}
                        className="w-full flex sm:hidden mb-4">
                        Fechar módulos
                    </Button>

                    <Accordion.Root
                        type="single"
                        className="w-full h-full flex flex-col gap-3"
                        collapsible
                        defaultValue={moduleId}
                        value={expandModules ?? undefined}
                        onValueChange={setExpandModules}>

                        {modules.map((coursemodule) => (
                            <ModulesItem key={coursemodule.id} data={coursemodule}
                                completedLessons={completedLessons} />
                        ))}
                    </Accordion.Root>
                </>
            )}

        </aside>
    )
}