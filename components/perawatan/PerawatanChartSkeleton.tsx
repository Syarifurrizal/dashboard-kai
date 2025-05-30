import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function PerawatanChartSkeleton() {
    return (
        <Card className="h-[500px] p-4">
            <div className="w-full h-full flex flex-row justify-baseline items-end gap-4">
                <Skeleton className="h-2/12 w-8 rounded-md" />
                <Skeleton className="h-6/12 w-8 rounded-md" />
                <Skeleton className="h-4/12 w-8 rounded-md" />
                <Skeleton className="h-10/12 w-8 rounded-md" />
                <Skeleton className="h-8/12 w-8 rounded-md" />
                <Skeleton className="h-12/12 w-8 rounded-md" />
                <Skeleton className="h-2/12 w-8 rounded-md" />
                <Skeleton className="h-6/12 w-8 rounded-md" />
                <Skeleton className="h-4/12 w-8 rounded-md" />
                <Skeleton className="h-10/12 w-8 rounded-md" />
                <Skeleton className="h-8/12 w-8 rounded-md" />
                <Skeleton className="h-12/12 w-8 rounded-md" />
                <Skeleton className="h-2/12 w-8 rounded-md" />
                <Skeleton className="h-6/12 w-8 rounded-md" />
                <Skeleton className="h-4/12 w-8 rounded-md" />
                <Skeleton className="h-10/12 w-8 rounded-md" />
                <Skeleton className="h-8/12 w-8 rounded-md" />
                <Skeleton className="h-12/12 w-8 rounded-md" />
            </div>
        </Card>
    );
}
