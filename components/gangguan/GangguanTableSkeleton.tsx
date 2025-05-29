import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function GangguanTableSkeleton() {
    return (
        <>
            <Card className="p-4">
                <div className="w-full flex flex-col gap-2">
                    <div className="flex flex-row gap-4 w-full">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full rounded-md" />
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        {[...Array(2)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full rounded-md" />
                        ))}
                    </div>

                </div>
            </Card>
        </>
    );
}
