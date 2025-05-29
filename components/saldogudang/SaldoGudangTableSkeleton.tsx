import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function SaldoGudangTableSkeleton() {
    return (
        <Card className="p-4">
            <div className="w-full flex flex-col gap-2">
                <div className="flex flex-row gap-4 w-full">
                    <Skeleton className="h-8 w-full rounded-md" />
                    <Skeleton className="h-8 w-full rounded-md" />
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-8 w-full rounded-md" />
                    <Skeleton className="h-8 w-full rounded-md" />
                </div>

            </div>
        </Card>
    );
}
