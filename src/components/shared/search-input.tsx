import { Input } from "@/components/ui/input";


export const SearchInput = () => {
    return (
        <div className="flex-1 max-w-[400px] relative">
            <Input className="h-9" placeholder="Busque por um curso..." />

        </div>
    );
}