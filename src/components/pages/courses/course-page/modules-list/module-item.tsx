
import { CircularProgress } from "@/components/ui/circular-progress";
import * as Accorcion from "@radix-ui/react-accordion"


type ModulesItemProps = {
    data: CourseModuleWithLessons;
}
export const ModulesItem = ({ data }: ModulesItemProps) => {
    return (
        <Accorcion.Item
            value={data.id}
            className="border border-border rounded-lg group">
            <Accorcion.Trigger className="flex items-center gap-4 w-full hover:bg-muted/50 transition-all" >
                <div className="w-10 h-10 rounded-full font-semibold bg-black/70 flex items-center justify-center transition-all">
                    {data.order}
                    <CircularProgress progress={50} className="absolute w-10 h-10 rounded-full" />
                </div>
            </Accorcion.Trigger>
            <Accorcion.Content>
                Content
            </Accorcion.Content>
        </Accorcion.Item>
    )
}