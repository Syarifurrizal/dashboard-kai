import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function DistribusiChartSkeleton() {
    return (
        <>
            <Card className="w-full h-fit p-4">
                <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                    <Skeleton className="w-full h-6 rounded-md" />
                    <Skeleton className="w-full h-6 rounded-md" />
                </div>
                <Skeleton className="w-full h-auto rounded-full aspect-square" />
            </Card>
        </>
    );
}