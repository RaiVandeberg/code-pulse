"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import qs from "query-string";


export const SearchInput = () => {

    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const currentTags = searchParams.getAll("tag");
    const currentQuery = searchParams.get("query");

    useEffect(() => {
        if (currentQuery === debouncedValue) return;
        if (!currentQuery && !debouncedValue) return;

        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                tags: currentTags,
                query: debouncedValue || undefined,
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
        focus();
    }, [debouncedValue, currentQuery, currentTags, pathname, router]);

    return (
        <div className="flex-1 max-w-[400px] relative">
            <Input className="h-9 pl-9 peer" placeholder="Busque por um curso..."
                value={value}
                onChange={({ target }) => setValue(target.value)} />

            <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground peer-focus:text-primary transition-all"
                size={16}
            />
        </div>
    );
}